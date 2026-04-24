import { getUserRole } from '../utils/auth';
import StudentDashboard from './StudentDashboard';
import CompanyDashboard from './CompanyDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardPage = () => {
  const role = getUserRole();

  return (
    <div>
      {role === 'student' && <StudentDashboard />}
      {role === 'company' && <CompanyDashboard />}
      {role === 'admin' && <AdminDashboard />}
      {!role && <div className="rounded-3xl bg-white p-8 shadow-lg">No role assigned.</div>}
    </div>
  );
};

export default DashboardPage;
