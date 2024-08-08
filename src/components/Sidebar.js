import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const LoadingModal = ({ message }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-md shadow-lg">
      <div className="flex items-center space-x-2">
        <svg
          className="w-5 h-5 text-blue-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  </div>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Function to fetch user details
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Get the token from session storage
        const response = await fetch('http://20.244.10.93:3009/userdetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ usermailid: sessionStorage.getItem('user') }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUserDetails(userData); // Set user details in state
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails(); // Call the function when component mounts
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setLogoutMessage('Logging out...');
    console.log(logoutMessage, "find", isLoggingOut)

    // Simulating logout delay (you can remove setTimeout in actual implementation)
    setTimeout(() => {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      navigate('/');
      setIsLoggingOut(false); // Resetting loading state
    }, 1000);
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed text-gray-800 ${isOpen ? 'sideBarOpen' : 'sideBarClose'} h-full p-4 transition-width duration-300 flex flex-col justify-between clr fs`}>
      <div>
        <div className="flex items-center justify-between mb-8">
          {isOpen && (
            <img
              src="https://prod.gs1datakart.org/assets/GS1_India_White_orange-D_5OpZvg.svg"
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
              <NavLink to="HomePage" className="custom-button" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="api-docs" className="custom-button" activeClassName="active">
                API Docs
              </NavLink>
            </li>
            <li className="mb-4">
              <button className="custom-button w-full text-left">
                Reports
              </button>
              <ul className="pl-4">
                <li className="mb-4">
                  <NavLink to="event-report" className="custom-button" activeClassName="active">
                    Event Report
                  </NavLink>
                </li>
                <li className="mb-4">
                  <NavLink to="batch-report" className="custom-button" activeClassName="active">
                    Batch Report
                  </NavLink>
                </li>
              </ul>
            </li>
            {userDetails && userDetails.usertype === 'Admin' && (
              <li className="mb-4">
                <NavLink to="add-user" className="custom-button" activeClassName="active">
                  Add / Delete User
                </NavLink>
              </li>
            )}
            {userDetails && userDetails.usertype === 'NetworkAdmin' && (
              <li className="mb-4">
                <button onClick={() => openInNewTab('http://explorer.gs1indiadatakart.org/')} className="custom-button">
                  Explorer
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
      {isOpen && (
        <button
          onClick={handleLogout}
          className="custom-button text-left"
        >
          Logout
        </button>
      )}
      {isLoggingOut && <LoadingModal message={logoutMessage} />}
    </div>
  );
};

export default Sidebar;
