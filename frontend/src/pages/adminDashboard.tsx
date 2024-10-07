import { Route, Routes, Link } from 'react-router-dom';
import ViewClubs from './adminRoutes/viewClubs';
import ManageUsers from './adminRoutes/manageUsers';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="bg-black p-4 h-[10%]">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="" className="text-white text-2xl font-bold">
            NITK Club Recruitment Portal - Admin
          </Link>
          <div className="space-x-4">
            <Link to="viewClubs" className="text-white hover:text-gray-300">
              View Clubs
            </Link>
            <Link to="manageUsers" className="text-white hover:text-gray-300">
              Manage Users
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow">
        <Routes>
          {/* Default Route with a Welcome Message */}
          <Route
            path=""
            element={
              <AdminDashboard/>
            }
          />
          <Route path="viewClubs" element={<ViewClubs />} />
          <Route path="manageUsers" element={<ManageUsers />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
