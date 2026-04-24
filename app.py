from flask import Flask, render_template, redirect, url_for, request, flash, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['UPLOAD_FOLDER'] = 'static/cv_uploads'
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB limit

from models import db, User, Job, Application
db.init_app(app)

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Home route
@app.route('/')
def home():
    return render_template('home.html')

# Register route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']
        if User.query.filter_by(username=username).first():
            flash('Username already exists.', 'danger')
            return redirect(url_for('register'))
        user = User(username=username, password=generate_password_hash(password), role=role, approved=(role=='Student'))
        db.session.add(user)
        db.session.commit()
        flash('Registration successful. Please login.', 'success')
        return redirect(url_for('login'))
    return render_template('register.html')

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            if not user.approved and user.role != 'Admin':
                flash('Your account is not approved yet.', 'warning')
                return redirect(url_for('login'))
            session['user_id'] = user.id
            session['role'] = user.role
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials.', 'danger')
    return render_template('login.html')

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('home'))

# Dashboard route
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    if user.role == 'Student':
        jobs = Job.query.filter_by(approved=True).all()
        applications = Application.query.filter_by(student_id=user.id).all()
        return render_template('student_dashboard.html', user=user, jobs=jobs, applications=applications)
    elif user.role == 'Company':
        jobs = Job.query.filter_by(company_id=user.id).all()
        return render_template('company_dashboard.html', user=user, jobs=jobs)
    elif user.role == 'Admin':
        users = User.query.filter(User.role != 'Admin').all()
        jobs = Job.query.all()
        return render_template('admin_dashboard.html', user=user, users=users, jobs=jobs)
    else:
        return redirect(url_for('logout'))

# Upload CV
@app.route('/upload_cv', methods=['POST'])
def upload_cv():
    if 'user_id' not in session or session['role'] != 'Student':
        return redirect(url_for('login'))
    file = request.files['cv']
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(f"cv_{session['user_id']}.pdf")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        user = User.query.get(session['user_id'])
        user.cv_filename = filename
        db.session.commit()
        flash('CV uploaded successfully.', 'success')
    else:
        flash('Please upload a PDF file.', 'danger')
    return redirect(url_for('dashboard'))

# Download CV (for company/admin)
@app.route('/download_cv/<int:student_id>')
def download_cv(student_id):
    user = User.query.get(student_id)
    if user and user.cv_filename:
        return send_from_directory(app.config['UPLOAD_FOLDER'], user.cv_filename, as_attachment=True)
    flash('CV not found.', 'danger')
    return redirect(url_for('dashboard'))

# Post job (Company)
@app.route('/post_job', methods=['GET', 'POST'])
def post_job():
    if 'user_id' not in session or session['role'] != 'Company':
        return redirect(url_for('login'))
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        job = Job(title=title, description=description, company_id=session['user_id'], approved=False)
        db.session.add(job)
        db.session.commit()
        flash('Job posted. Awaiting admin approval.', 'success')
        return redirect(url_for('dashboard'))
    return render_template('post_job.html')

# Apply for job (Student)
@app.route('/apply/<int:job_id>')
def apply(job_id):
    if 'user_id' not in session or session['role'] != 'Student':
        return redirect(url_for('login'))
    job = Job.query.get(job_id)
    if not job or not job.approved:
        flash('Job not available.', 'danger')
        return redirect(url_for('dashboard'))
    existing = Application.query.filter_by(student_id=session['user_id'], job_id=job_id).first()
    if existing:
        flash('Already applied to this job.', 'warning')
        return redirect(url_for('dashboard'))
    app_obj = Application(student_id=session['user_id'], job_id=job_id)
    db.session.add(app_obj)
    db.session.commit()
    flash('Applied successfully!', 'success')
    return redirect(url_for('dashboard'))

# View applicants (Company)
@app.route('/view_applicants/<int:job_id>')
def view_applicants(job_id):
    if 'user_id' not in session or session['role'] != 'Company':
        return redirect(url_for('login'))
    job = Job.query.get(job_id)
    if not job or job.company_id != session['user_id']:
        flash('Unauthorized.', 'danger')
        return redirect(url_for('dashboard'))
    applications = Application.query.filter_by(job_id=job_id).all()
    return render_template('view_applicants.html', job=job, applications=applications)

# Admin: Approve/reject users
@app.route('/approve_user/<int:user_id>')
def approve_user(user_id):
    if 'user_id' not in session or session['role'] != 'Admin':
        return redirect(url_for('login'))
    user = User.query.get(user_id)
    if user:
        user.approved = True
        db.session.commit()
        flash('User approved.', 'success')
    return redirect(url_for('dashboard'))

@app.route('/reject_user/<int:user_id>')
def reject_user(user_id):
    if 'user_id' not in session or session['role'] != 'Admin':
        return redirect(url_for('login'))
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        flash('User rejected and deleted.', 'success')
    return redirect(url_for('dashboard'))

# Admin: Approve/reject jobs
@app.route('/approve_job/<int:job_id>')
def approve_job(job_id):
    if 'user_id' not in session or session['role'] != 'Admin':
        return redirect(url_for('login'))
    job = Job.query.get(job_id)
    if job:
        job.approved = True
        db.session.commit()
        flash('Job approved.', 'success')
    return redirect(url_for('dashboard'))

@app.route('/reject_job/<int:job_id>')
def reject_job(job_id):
    if 'user_id' not in session or session['role'] != 'Admin':
        return redirect(url_for('login'))
    job = Job.query.get(job_id)
    if job:
        db.session.delete(job)
        db.session.commit()
        flash('Job rejected and deleted.', 'success')
    return redirect(url_for('dashboard'))

# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
