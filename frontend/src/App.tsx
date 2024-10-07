import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Don't forget to import the CSS
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import StudentDashboard from './pages/studentDashboard';
import ConvenorDashboard from './pages/convenorDashboard';
import AdminDashboard from './pages/adminDashboard';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/studentDashboard/*" element={<StudentDashboard />} />
          <Route path="/convenorDashboard/*" element={<ConvenorDashboard />} />
          <Route path="/adminDashboard/*" element={<AdminDashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
