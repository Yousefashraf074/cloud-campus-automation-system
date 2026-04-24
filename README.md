# Campus Automation System

A production-ready Campus Automation System built with React, Tailwind CSS, Node.js, Express, MongoDB Atlas, and AWS S3. This repository includes a backend API, frontend app, AWS S3 resume upload integration, Docker support, and GitHub Actions CI.

## Features

- **Multi-role Authentication**: Student, Company, and Admin roles with JWT
- **Job Management**: Companies can post jobs, students can apply
- **Resume Upload**: AWS S3 integration for production, local storage for development
- **Application Tracking**: Students can track applications, companies can manage applicants
- **Responsive UI**: Modern React frontend with Tailwind CSS
- **Production Ready**: Docker, CI/CD, environment-based configuration

## Repository Structure

- `backend/` - Express API and MongoDB backend
- `frontend/` - React + Vite + Tailwind frontend
- `static/resumes/` - Local resume storage (development)
- `.github/workflows/nodejs.yml` - CI workflow for frontend and backend
- `Dockerfile` - Backend containerization

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Set values for:

- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secure random token secret
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (production only)
- `AWS_REGION` (production only)
- `AWS_S3_BUCKET` (production only)
- `NODE_ENV` — 'development' or 'production'

**Note**: In development mode (`NODE_ENV=development`), resume uploads use local file storage. AWS credentials are only required for production deployment.

### 3. Run the backend

```bash
npm run dev  # Development with auto-restart
npm start    # Production
```

### 4. API Endpoints

#### Authentication
- `POST /api/auth/register` — Register student, company, or admin
- `POST /api/auth/login` — Login and receive JWT

#### Users
- `GET /api/users/profile` — Get authenticated profile
- `PUT /api/users/profile` — Update authenticated profile

#### Jobs
- `GET /api/jobs` — List jobs with search/filter query params
- `POST /api/jobs` — Create job (company/admin)
- `GET /api/jobs/:id` — Get job details
- `PUT /api/jobs/:id` — Update job
- `DELETE /api/jobs/:id` — Delete job

#### Applications
- `POST /api/applications` — Apply to a job (student)
- `GET /api/applications/me` — Student applications
- `GET /api/applications/company` — Company applications
- `PUT /api/applications/:id` — Accept/reject application

#### File Upload
- `POST /api/uploads/resume` — Upload resume (local storage in dev, S3 in prod)

#### Status
- `GET /api/status/aws` — Check storage configuration status

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set the API base URL:

```bash
cp .env.example .env
```

Set:
- `VITE_API_BASE_URL` — Backend API URL (default: http://localhost:5000)

### 3. Run the frontend

```bash
npm run dev   # Development server
npm run build # Production build
npm run preview # Preview production build
```

### 4. Available pages

- `/` — Home page
- `/login` — Login
- `/register` — Register as student/company/admin
- `/dashboard` — Role-specific dashboard
- `/admin/dashboard` — Admin management
- `/company/dashboard` — Company job management
- `/student/dashboard` — Student applications

---

## File Storage Configuration

### Development Mode
- Uses local file system (`static/resumes/`)
- No AWS credentials required
- Files served via `/static/` endpoint

### Production Mode
- Uses AWS S3 for scalable file storage
- Requires valid AWS credentials and S3 bucket
- Files stored with public read access

### AWS S3 Setup (Production)

1. Create AWS account and IAM user with S3 permissions
2. Create S3 bucket in your preferred region
3. Set environment variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET`

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Set `MONGO_URI` in backend/.env

### Local MongoDB

```bash
# Install MongoDB locally
# Set MONGO_URI=mongodb://localhost:27017/campus-automation
```

---

## Docker Deployment

### Backend Container

```bash
cd backend
docker build -t campus-backend .
docker run -p 5000:5000 campus-backend
```

### Environment Variables in Docker

```bash
docker run -p 5000:5000 \
  -e MONGO_URI=your_mongo_uri \
  -e JWT_SECRET=your_jwt_secret \
  -e NODE_ENV=production \
  campus-backend
```

---

## Development Workflow

1. **Backend**: `cd backend && npm run dev`
2. **Frontend**: `cd frontend && npm run dev`
3. **Database**: Ensure MongoDB is running
4. **Test**: Use `/api/status/aws` to verify storage configuration

---

## API Testing

### Check Storage Status
```bash
curl http://localhost:5000/api/status/aws
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student"}'
```

---

## Screenshots

### Login Page
A clean, modern login experience for students, companies, and admins.

![Login Screen](./docs/screenshots/login.png)

### Student Dashboard
Student dashboard with resume upload, application tracking, and open jobs summary.

![Student Dashboard](./docs/screenshots/student-dashboard.png)

---

## Production Deployment

### Frontend → Vercel

1. Create a new Vercel project and point it to the `frontend/` folder.
2. Add environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend-url.com/api`
3. Set build command:
   - `npm install && npm run build`
4. Set output directory:
   - `dist`
5. Deploy and verify the site loads.

### Backend → Render

1. Create a new Web Service on Render.
2. Set the root directory to `backend/`.
3. Use runtime: `Node 20`
4. Build command:
   - `npm install`
5. Start command:
   - `npm start`

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details

5. Start command:
   - `npm start`
6. Add environment variables in Render:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET`
   - `PORT` = `5000`
7. Once deployed, copy the Render service URL and use it as `VITE_API_BASE_URL` in Vercel.

### Backend → AWS EC2

1. Provision an EC2 instance with Node.js installed.
2. Clone the repo and install dependencies in `backend/`.
3. Copy `backend/.env.example` to `.env` and configure the values.
4. Use a process manager such as `pm2`:
   - `pm2 start server.js --name campus-automation-backend`
5. Configure Nginx or Apache as a reverse proxy to forward traffic to port `5000`.
6. Ensure the security group allows inbound traffic on HTTP/HTTPS.

### MongoDB Atlas

1. Create a cluster in MongoDB Atlas.
2. Configure a database user and get the connection string.
3. Add your backend's IP address to the network access list, or use `0.0.0.0/0` for development.
4. Paste the connection string into `backend/.env` as `MONGO_URI`.

### Frontend Environment File Example

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### Backend Environment File Example

Create `backend/.env` with:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
PORT=5000
NODE_ENV=production
```

---

## Docker Support

A `backend/Dockerfile` is included for containerized backend deployment.

Build and run locally:

```bash
cd backend
docker build -t campus-automation-backend .
docker run -d -p 5000:5000 --env-file .env campus-automation-backend
```

---

## CI/CD

GitHub Actions is configured in `.github/workflows/nodejs.yml` to install dependencies and build both frontend and backend on pushes to `main`.

---

## Notes

- Use `bcryptjs` for secure password hashing
- Use `jsonwebtoken` for JWT auth
- Use `aws-sdk` to upload resumes to S3
- Use role-based middleware to protect routes
- Use Vite + Tailwind for modern UI development
