import { Link  } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          NITK Club Recruitment Portal
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Sign In
          </Link>
          <Link to="/signup" className="text-white hover:text-gray-300">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}