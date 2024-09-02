import React, { useState, useEffect } from 'react';
import './AddUser.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingModule from './LoadingModule';

// Loading Modal Component
const LoadingModal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-md shadow-lg">
      <div className="flex items-center space-x-2">
        <span>{message}</span>
      </div>
      {message.includes('Adding user...') || message.includes('Deleting user...') || message.includes('Updating user access...') ? null : (<div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-bold"
        >
          Okay
        </button>
      </div>)}
    </div>
  </div>
);

// Confirmation Dialog Component
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-md shadow-lg">
      <div className="flex items-center space-x-2">
        <span>{message}</span>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 font-bold"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 font-bold"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

// Main AddUser Component
const AddUser = () => {
  const [orgs, setOrgs] = useState([{ orgpolicy: 'read', users: [{ usertype: 'User', usermailId: '', useraccess: 'Both' }] }]);
  const [usermailidExists, setUsermailidExists] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
 // const [responseMessage, setResponseMessage] = useState('');
  const [activeTab, setActiveTab] = useState('addUser');
  const [deleteEmail, setDeleteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState('');
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // setOrgs([{ orgpolicy: 'read', users: [{ usertype: 'User', usermailId: '', useraccess: 'Both' }] }]);
    setDeleteEmail('');
    setUsermailidExists(false);
    const user = sessionStorage.getItem('user');

    if (!user) {
      setShowTimeoutModal(true);
      setTimeout(() => {
        navigate('/LoginPage');
      }, 2000); // Delay to show the modal for 2 seconds before redirecting
      return;
    }
    // Fetch user details from API
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem('token');
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
          setUserDetails(userData);
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const checkUsermailidExists = async (usermailid) => {
    try {
      const response = await axios.get('http://20.244.10.93:3009/check-usermail', {
        params: { usermailid },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };
  const handleUsermailChange = async (orgIndex, userIndex, value) => {
    const usermailidExists = await checkUsermailidExists(value);
    setUsermailidExists(usermailidExists);

    const updatedOrgs = [...orgs];
    updatedOrgs[orgIndex].users[userIndex].usermailId = value;
    setOrgs(updatedOrgs);
  };

  // const addUser = (orgIndex) => {
  //   const updatedOrgs = [...orgs];
  //   updatedOrgs[orgIndex].users.push({ usertype: 'User', usermailId: '' });
  //   setOrgs(updatedOrgs);
  // };

  // const removeUser = (orgIndex, userIndex) => {
  //   const updatedOrgs = [...orgs];
  //   if (updatedOrgs[orgIndex].users.length > 1) {
  //     updatedOrgs[orgIndex].users.splice(userIndex, 1);
  //     setOrgs(updatedOrgs);
  //   } else {
  //     alert('Each organization should have at least one user.');
  //   }
  // };

  const handleSubmitAddUser = async (e) => {
    e.preventDefault();
    
    const adminEmail = userDetails.usermailid;
    const orgname = userDetails?.orgname;

    try {
      setLoadingMessage('Adding user...');
      setIsLoading(true);
      for (let org of orgs) {
        for (let user of org.users) {
          const postData = {
            adminEmail,
            newUser: {
              usermailid: user.usermailId,
              usertype: user.usertype,
              useraccess: user.useraccess,
              orgname: orgname,
            },
          };
          console.log(postData)
          const response = await axios.post('http://20.244.10.93:3009/addUserWithAttributes', postData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('API Response:', response.data);
        }
      }

      setOrgs([{ orgpolicy: 'read', users: [{ usertype: 'User', usermailId: '' }] }]);
      setUsermailidExists(false);
      setLoadingMessage('User added successfully!');
      setIsLoading(true);
    } catch (error) {
      console.error('Error adding user:', error);
      setLoadingMessage('Failed to add user. Please try again.');
    }
  };

  const handleSubmitModifyUserAccess = async (e) => {
    e.preventDefault();

    const adminEmail = userDetails.usermailid;
    const orgname = userDetails?.orgname;

    try {
      setLoadingMessage('Updating user access...');
      setIsLoading(true);

      for (let org of orgs) {
        for (let user of org.users) {
          const postData = {
            adminEmail: adminEmail,
            department: user.usermailId,    // department as usermailId
            userorg: orgname,
            newUserAccess: user.useraccess, // access as newUserAccess
          };
          console.log(postData);

          const response = await axios.post('http://20.244.10.93:3009/updateUserType', postData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('API Response:', response.data);
        }
      }
      setOrgs([{ orgpolicy: 'read', users: [{ usertype: 'User', usermailId: '' }] }]);
      //setUsermailidExists(false);
      setLoadingMessage('User access updated successfully!');
    } catch (error) {
      console.error('Error updating user access:', error);
      setLoadingMessage('Failed to update user access. Please try again.');
    }
  };

  const handleDeleteButtonClick = (e) => {
    e.preventDefault();
    setConfirmDeleteEmail(deleteEmail);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    setLoadingMessage('Deleting user...');

    const adminEmail = userDetails.usermailid;

    try {
      // Perform delete operation
      const response = await axios.post('http://20.244.10.93:3009/deleteUser', {
        adminEmail: adminEmail,
        usermailid: confirmDeleteEmail,
      });

      console.log('Delete User API Response:', response.data);
      setLoadingMessage(`User ${confirmDeleteEmail} deleted successfully!`);
      setDeleteEmail('');
    } catch (error) {
      console.error('Error deleting user:', error);
      setLoadingMessage(`Failed to delete user ${confirmDeleteEmail}. Please try again. Or User does not exist`);
    } finally {
      setIsLoading(true);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleCloseModal = () => {
    setIsLoading(false);
  };
  const handleAccessChange = (orgIndex, userIndex, value) => {
    const updatedOrgs = [...orgs];
    updatedOrgs[orgIndex].users[userIndex].useraccess = value;
    setOrgs(updatedOrgs);
  };

  const handleUsertypeChange = (orgIndex, userIndex, value) => {
    const updatedOrgs = [...orgs];
    updatedOrgs[orgIndex].users[userIndex].usertype = value;
    setOrgs(updatedOrgs);
  };


  return (
    <div className="page-container relative">
      {showTimeoutModal && <LoadingModule message="Session Timed Out. Redirecting to Login Page..." />}
      <div className="container">
        <div className="flex justify-center mb-4">
          <button
            className={`tab-button ${activeTab === 'addUser' ? 'active' : ''}`}
            onClick={() => setActiveTab('addUser')}
          >
            Add User
          </button>
          <button
            className={`tab-button ${activeTab === 'deleteUser' ? 'active' : ''}`}
            onClick={() => setActiveTab('deleteUser')}
          >
            Delete User
          </button>
          <button
            className={`tab-button ${activeTab === 'modifyUserAccess' ? 'active' : ''}`}
            onClick={() => setActiveTab('modifyUserAccess')}
          >
            Modify UserAccess
          </button>
        </div>

        {activeTab === 'addUser' && (
  <form onSubmit={handleSubmitAddUser} className="tab-container">
            {orgs.map((org, orgIndex) => (
              <div key={orgIndex} className="org-container">
                <div className="users-container space-y-4">
                  {org.users.map((user, userIndex) => (
                    <div key={userIndex} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <label htmlFor={`usermailId-${orgIndex}-${userIndex}`} className="text-gray-700 font-bold">User Email : </label>
                      <input
                        type="email"
                        id={`usermailId-${orgIndex}-${userIndex}`}
                        value={user.usermailId}
                        onChange={(e) => handleUsermailChange(orgIndex, userIndex, e.target.value)}
                        required
                        className="mt-1 w-[83%] p-1 border border-gray-300 rounded"
                      /><br /><br />
                      <label htmlFor={`access-${orgIndex}-${userIndex}`} className="text-gray-700 font-bold"> Access : </label>
                      <select
                        id={`access-${orgIndex}-${userIndex}`}
                        value={user.useraccess}
                        onChange={(e) => handleAccessChange(orgIndex, userIndex, e.target.value)}
                        className="mt-1 w-[83%] ml-[29px] p-1 border border-gray-300 rounded"
                        required
                      >
                        <option value="Both">Both</option>
                        <option value="Read">Read</option>
                        <option value="Write">Write</option>

                      </select>
                      <br /><br />
                      <label htmlFor={`usertype-${orgIndex}-${userIndex}`} className="text-gray-700 font-bold mt-2">
                        User Type :
                      </label>
                      <select
                        id={`usertype-${orgIndex}-${userIndex}`}
                        value={user.usertype}
                        onChange={(e) => handleUsertypeChange(orgIndex, userIndex, e.target.value)}
                        className="mt-1 w-[83%] ml-[9px] p-1 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="NetworkAdmin">Network Admin</option>
                      </select>


                      {usermailidExists && <p className="text-red-600">Usermailid already exists</p>}
                    </div>
                    
                  ))}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="abc"
            >
              Add
            </button>
          </form>
        )}

{activeTab === 'deleteUser' && (
  <div className="tab-container">
    <form onSubmit={handleDeleteButtonClick}>
      <div className="form-group mb-4">
        <div className='p-4 border border-gray-200 rounded-lg'>
          <label htmlFor="deleteUsermailId" className="text-gray-700 font-bold delete-user-label">User Email : </label>
          <input
            type="email"
            id="deleteUsermailId"
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            className="mt-1 p-1 border border-gray-300 rounded w-[83%]"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 font-bold"
      >
        Delete
      </button>
    </form>
  </div>
)}

        {activeTab === 'modifyUserAccess' && (
          <form onSubmit={handleSubmitModifyUserAccess} className="tab-container">
            {orgs.map((org, orgIndex) => (
              <div key={orgIndex} className="org-container">
                <div className="users-container space-y-4">
                  {org.users.map((user, userIndex) => (
                    <div key={userIndex} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <label htmlFor={`usermailId-${orgIndex}-${userIndex}`} className="text-gray-700 font-bold">User Email : </label>
                      <input
                        type="email"
                        id={`usermailId-${orgIndex}-${userIndex}`}
                        value={user.usermailId}
                        onChange={(e) => handleUsermailChange(orgIndex, userIndex, e.target.value)}
                        required
                        className="mt-1 w-[83%] p-1 border border-gray-300 rounded"
                      />

                      <br /><br />
                      <label htmlFor={`access-${orgIndex}-${userIndex}`} className="text-gray-700 font-bold mt-2">Access : </label>
                      <select
                        id={`access-${orgIndex}-${userIndex}`}
                        value={user.useraccess}
                        onChange={(e) => handleAccessChange(orgIndex, userIndex, e.target.value)}
                        className="mt-1 w-[83%] ml-[29px] p-1 border border-gray-300 rounded"
                        required
                      >
                        <option value="Both">Both</option>
                        <option value="Read">Read</option>
                        <option value="Write">Write</option>
                      </select>

                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" className="abc">Modify</button>
          </form>
        )}


        {isLoading && (
          <LoadingModal message={loadingMessage} onClose={handleCloseModal} />
        )}

        {showConfirmDialog && (
          <ConfirmationDialog
            message={`Are you sure you want to delete user ${confirmDeleteEmail}?`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
};

export default AddUser;
