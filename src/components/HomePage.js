import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [userDetails, setUserDetails] = useState(null); // State to store user details
  const [selectedBox, setSelectedBox] = useState(null); // State to track selected box

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
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle click on user information box
  const handleBoxClick = (box) => {
    setSelectedBox(box === selectedBox ? null : box); // Toggle selected box
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-10">
      <div className="bg-white p-5 rounded-lg shadow-md max-w-full w-full animate-fadeIn">
        <h1 className="text-3xl font-semibold mb-10 text-center">WELCOME TO BLOCKCHAIN NETWORK</h1>
        {/* Display user details */}
        {userDetails && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-2 px-4 bg-blue-500 text-white rounded-lg">
              <p className="text-lg font-bold">User Information</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`bg-blue-100 hover:bg-blue-300 py-4 px-6 rounded-lg cursor-pointer ${
                  selectedBox === 'usermailid' ? 'transform scale-105' : ''
                }`}
                onClick={() => handleBoxClick('usermailid')}
              >
                <p className="text-sm text-blue-800">User Mail ID:</p>
                <p className="text-lg font-semibold">{userDetails.usermailid}</p>
              </div>
              <div
                className={`bg-orange-100 hover:bg-orange-300 py-4 px-6 rounded-lg cursor-pointer ${
                  selectedBox === 'orgname' ? 'transform scale-105' : ''
                }`}
                onClick={() => handleBoxClick('orgname')}
              >
                <p className="text-sm text-orange-800">Organization Name:</p>
                <p className="text-lg font-semibold">{userDetails.orgname}</p>
              </div>
              <div
                className={`bg-blue-100 hover:bg-blue-300 py-4 px-6 rounded-lg cursor-pointer ${
                  selectedBox === 'orgid' ? 'transform scale-105' : ''
                }`}
                onClick={() => handleBoxClick('orgid')}
              >
                <p className="text-sm text-blue-800">Organization ID:</p>
                <p className="text-lg font-semibold">{userDetails.orgid}</p>
              </div>
              <div
                className={`bg-orange-100 hover:bg-orange-300 py-4 px-6 rounded-lg cursor-pointer ${
                  selectedBox === 'usertype' ? 'transform scale-105' : ''
                }`}
                onClick={() => handleBoxClick('usertype')}
              >
                <p className="text-sm text-orange-800">User Type:</p>
                <p className="text-lg font-semibold">{userDetails.usertype}</p>
              </div>
              <div
                className={`bg-blue-100 hover:bg-blue-300 py-4 px-6 rounded-lg cursor-pointer ${
                  selectedBox === 'projectid' ? 'transform scale-105' : ''
                }`}
                onClick={() => handleBoxClick('projectid')}
              >
                <p className="text-sm text-blue-800">Network ID:</p>
                <p className="text-lg font-semibold">{userDetails.networkid}</p>
              </div>
              <div
                className={`bg-orange-100 hover:bg-orange-300 py-4 px-6 rounded-lg cursor-pointer ${
                  selectedBox === 'projectname' ? 'transform scale-105' : ''
                }`}
                onClick={() => handleBoxClick('projectname')}
              >
                <p className="text-sm text-orange-800">Project Name:</p>
                <p className="text-lg font-semibold">{userDetails.projectname}</p>
              </div>
              {/* Add more fields as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
