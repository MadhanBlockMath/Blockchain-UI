import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import withAuth from './withAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className={`bg-blue-100 text-gray-800 ${isOpen ? 'w-64' : 'w-16'} min-h-screen p-4 transition-width duration-300 flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between mb-8">
          {isOpen && (
            <img
              src="https://www.gs1india.org/wp-content/uploads/2022/06/logo-600x402-1-600x402.png"
              alt="GS1 India Logo"
              className="w-24 h-auto"
            />
          )}
          <button onClick={toggleSidebar} className="focus:outline-none">
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            )}
          </button>
        </div>
        {isOpen && (
          <ul>
            <li className="mb-4">
              <Link to="api-docs" className="block p-2 rounded hover:bg-blue-200">
                API Docs
              </Link>
            </li>
            <li className="mb-4">
              <Link to="event-report" className="block p-2 rounded hover:bg-blue-200">
                Event Batch Report
              </Link>
            </li>
          </ul>
        )}
      </div>
      {isOpen && (
        <button
          onClick={handleLogout}
          className="block p-2 rounded hover:bg-blue-200 text-left"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default withAuth(Sidebar);
