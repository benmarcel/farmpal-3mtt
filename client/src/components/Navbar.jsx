import {useState} from 'react'
import { Link, NavLink } from 'react-router-dom'
import useAuth from '../context/useAuth'
const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const handleLogout = () => {
    if (user) {
      logout();
    }
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  return (
 
      <header className=" shadow-md p-2 absolute top-0 left-0 w-full z-50 bg-white text-primary">
      {/* Navigation Bar */}
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
         <div className='inline-flex items-center space-x-2 '>
            <img src="/farmpal-logo.png" alt="Logo" width={70} height={70} />
        </div>

        {/* Desktop Navigation - Hidden on small screens, visible on medium and up */}
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              ` hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/chat"
            onClick={closeMenu}
            className={({ isActive }) =>
              `text-gray-700 hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Chat
          </NavLink>
          
         
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              ` hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
          Dashboard 
          </NavLink>
          <NavLink
            to="/weather"
            className={({ isActive }) =>
              `hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Weather
          </NavLink>
         
        
         {user ? (<NavLink
            to="/login"
            onClick={handleLogout}
          >
            Logout
          </NavLink>) : (
          <NavLink
            to="/login"
          >
            Login
          </NavLink>
        )}
        </div>
        {/* Hamburger Icon - Visible on small screens, hidden on medium and up */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="hover:text-secondary focus:outline-none">
            {/* Hamburger icon (three lines) */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Conditionally rendered based on isMenuOpen state */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center md:hidden">
          {/* Close Button */}
          <button onClick={toggleMenu} className="absolute top-4 right-4 text-gray-700 hover:text-secondary focus:outline-none">
            {/* Close icon (X) */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-6 text-xl">
            <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `text-gray-700 hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/chat"
            onClick={closeMenu}
            className={({ isActive }) =>
              `text-gray-700 hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Chat
          </NavLink>
          
          <NavLink
            to="/dashboard"
            onClick={closeMenu}
            className={({ isActive }) =>
              `text-gray-700 hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Dashboard 
          </NavLink>
          <NavLink
            to="/weather"
            onClick={closeMenu}
            className={({ isActive }) =>
              `text-gray-700 hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Weather
          </NavLink>
          <NavLink
            to="/login"
            onClick={closeMenu}
            className={({ isActive }) =>
              `text-gray-700 hover:text-secondary transition duration-300 ${isActive ? 'font-bold text-secondary' : ''}`
            }
          >
            Login
          </NavLink>
          </nav>
        </div>
      )}
    </header>
    
  )
}

export default Navbar
  