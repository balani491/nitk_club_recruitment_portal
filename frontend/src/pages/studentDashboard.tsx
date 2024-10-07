import { Route, Routes, Link } from 'react-router-dom';
import EnterStudent from './studentRoutes/enterStudent';
import SeeRegistrationStatus from './studentRoutes/seeRegistrationStatus';
import GetAnnouncement from './studentRoutes/getAnnouncement';

const StudentDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="bg-black p-4 h-[10%]">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="" className="text-white text-2xl font-bold">
            NITK Club Recruitment Portal - Student
          </Link>
          <div className="space-x-4">
            <Link to="getAnnouncements" className="text-white hover:text-gray-300">
              Announcements
            </Link>
            <Link to="seeRegistrationStatus" className="text-white hover:text-gray-300">
              Registration Status
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow">
        <Routes>
          {/* Default Route with a Welcome Message */}
          <Route path="" element={<EnterStudent />} />
          <Route path="getAnnouncements" element={<GetAnnouncement />} />
          <Route path="seeRegistrationStatus" element={<SeeRegistrationStatus />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
