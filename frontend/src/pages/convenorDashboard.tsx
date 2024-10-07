import { Route, Routes, Link } from 'react-router-dom';
import EnterConvenor from './convenorRoutes/enterConvenor';

const ConvenorDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="bg-black p-4 h-[10%]">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="" className="text-white text-2xl font-bold">
            NITK Club Recruitment Portal - Convenor
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow">
        <Routes>
          {/* Default Route with a Welcome Message */}
          <Route path="/*" element={<EnterConvenor />} />
        </Routes>
      </div>
    </div>
  );
};

export default ConvenorDashboard;
