import { Link, Route, Routes, useLocation } from "react-router-dom";
import AddAnnouncement from "./AddAnnouncement";
import RegisterClub from "./registerClub";
import GetRegistrations from "./getRegistrations";
import ExportPdf from "./ExportPdf";

export default function EnterConvenor() {
    const location = useLocation();
    const isGetRegistrations = location.pathname.includes('getRegistrations') || location.pathname.includes('exportPdf') || location.pathname.includes('updateRoundStatus')|| location.pathname.includes('addRecruitmentAnnouncement')|| location.pathname.includes('RegisterClub') ; 

    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/4 bg-white shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome To Convenor Dashboard</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="RegisterClub"
                  className="block py-2 px-4 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition duration-200"
                >
                  Register Club
                </Link>
              </li>
              <li>
                <Link
                  to="addRecruitmentAnnouncement"
                  className="block py-2 px-4 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition duration-200"
                >
                  Add Recruitment Announcement
                </Link>
              </li>
              <li>
                <Link
                  to="getRegistrations"
                  className="block py-2 px-4 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition duration-200"
                >
                  Get Registrations
                </Link>
              </li>
              <li>
                <Link
                  to="exportPdf"
                  className="block py-2 px-4 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition duration-200"
                >
                  Export Club Recruitment Result
                </Link>
              </li>
              
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-10">
          <Routes>
            <Route path="RegisterClub" element={<RegisterClub />} />
            <Route path="addRecruitmentAnnouncement" element={<AddAnnouncement />} />
            <Route path="getRegistrations" element={<GetRegistrations />} />
            {/* <Route path="updateRoundStatus" element={<UpdateRoundStatus />} /> */}
            <Route path="exportPdf" element={<ExportPdf />} />
          </Routes>
          {!isGetRegistrations && (
            <div className="mt-10">
              <img
                src="https://cdn.iris.nitk.ac.in/mb.jpg"
                alt="Welcome image"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    );
  }