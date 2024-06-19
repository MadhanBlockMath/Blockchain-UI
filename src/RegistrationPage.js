import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RegistrationPage.css';
import Modal from './Modal';

const RegistrationPage = () => {
  const [projectname, setProjectName] = useState('');
  const [orgs, setOrgs] = useState([{ orgname: '', orgpolicy: 'read', users: [{ usertype: 'User', username: '', usermailId: '', password: '' }] }]);
  const [gs1Org, setGs1Org] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const navigate = useNavigate();

  const checkUsernameExists = async (username) => {
    try {
      const response = await axios.get('http://localhost:4000/check-username', {
        params: { username },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const addOrg = () => {
    setOrgs([...orgs, { orgname: '', orgpolicy: 'read', users: [{ usertype: 'User', username: '', usermailId: '', password: '' }] }]);
  };

  const removeOrg = (index) => {
    if (orgs.length > 1) {
      setOrgs(orgs.filter((_, i) => i !== index));
    } else {
      alert('Each organization should have at least one user.');
    }
  };

  const handleOrgChange = (index, field, value) => {
    const updatedOrgs = orgs.map((org, i) => (i === index ? { ...org, [field]: value } : org));
    setOrgs(updatedOrgs);
  };

  const addUser = (orgIndex) => {
    const updatedOrgs = orgs.map((org, i) => (i === orgIndex ? { ...org, users: [...org.users, { usertype: 'User', username: '', usermailId: '', password: '' }] } : org));
    setOrgs(updatedOrgs);
  };

  const removeUser = (orgIndex, userIndex) => {
    const updatedOrgs = orgs.map((org, i) => (i === orgIndex ? { ...org, users: org.users.length > 1 ? org.users.filter((_, j) => j !== userIndex) : org.users } : org));
    if (orgs[orgIndex].users.length > 1) {
      setOrgs(updatedOrgs);
    } else {
      alert('Each organization should have at least one user.');
    }
  };

  const handleUserChange = (orgIndex, userIndex, field, value) => {
    const updatedOrgs = orgs.map((org, i) => (i === orgIndex ? {
      ...org, users: org.users.map((user, j) => (j === userIndex ? { ...user, [field]: value } : user))
    } : org));
    setOrgs(updatedOrgs);
  };

  const handleUsernameChange = async (orgIndex, userIndex, value) => {
    const usernameExists = await checkUsernameExists(value);
    setUsernameExists(usernameExists);
    handleUserChange(orgIndex, userIndex, 'username', value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameExists) {
      alert('Username already exists. Please choose a different username.');
      return;
    }
    console.log('Submitting orgs:', orgs, 'Make GS1 Default:', gs1Org, 'project name', projectname);
    try {
      const response = await axios.post('http://localhost:4000/register', { projectname, orgs, gs1Org }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setShowModal(true);
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error.response.data);
      alert(`${error.response.data}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/LoginPage');
  };

  return (
    <div className="page-container">
      <img
        src="https://www.gs1india.org/wp-content/uploads/2022/06/logo-600x402-1-600x402.png"
        alt="Top Left Image"
        className="top-left-image"
      />
      <div className="container">
        <h2 className='font-bold'>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectname" className="block text-gray-700 font-bold">Project Name:</label>
            <input
              type="text"
              id="projectname"
              value={projectname}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="mt-1 block w-full p-1 border border-gray-300 rounded"
            />
          </div>
          {orgs.map((org, orgIndex) => (
            <div key={orgIndex} className="org-container">
              <div className="form-group grid md:grid-cols-5 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label htmlFor={`orgname-${orgIndex}`} className="block text-gray-700 font-bold">Organization Name:</label>
                  <input
                    type="text"
                    id={`orgname-${orgIndex}`}
                    value={org.orgname}
                    onChange={(e) => handleOrgChange(orgIndex, 'orgname', e.target.value)}
                    required
                    className="mt-1 block w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`orgpolicy-${orgIndex}`} className="block text-gray-700 font-bold">Organization Policy:</label>
                  <select
                    id={`orgpolicy-${orgIndex}`}
                    value={org.orgpolicy}
                    onChange={(e) => handleOrgChange(orgIndex, 'orgpolicy', e.target.value)}
                    className="mt-1 block w-full p-1 border border-gray-300 rounded"
                  >
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="">
                  {orgIndex > 0 && (
                    <button
                      type="button"
                      className="bg-red-600 text-white rounded hover:bg-red-700 m-2 mt-6"
                      onClick={() => removeOrg(orgIndex)}
                    >
                      -
                    </button>
                  )}
                  {orgIndex === orgs.length - 1 && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white m-2 mt-6 rounded hover:bg-blue-700"
                      onClick={addOrg}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
              <div className="users-container space-y-4">
                {org.users.map((user, userIndex) => (
                  <div key={userIndex} className="user-container grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label htmlFor={`usertype-${orgIndex}-${userIndex}`} className="block text-gray-700 font-bold">User Type:</label>
                      <select
                        id={`usertype-${orgIndex}-${userIndex}`}
                        value={user.usertype}
                        onChange={(e) => handleUserChange(orgIndex, userIndex, 'usertype', e.target.value)}
                        className="mt-1 block w-full p-1 border border-gray-300 rounded"
                      >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`username-${orgIndex}-${userIndex}`} className="block text-gray-700 font-bold">Username:</label>
                      <input
                        type="text"
                        id={`username-${orgIndex}-${userIndex}`}
                        value={user.username}
                        onChange={(e) => handleUsernameChange(orgIndex, userIndex, e.target.value)}
                        required
                        className="mt-1 block w-full p-1 border border-gray-300 rounded"
                      />
                      {usernameExists && <p className="text-red-600">Username already exists</p>}
                    </div>
                    <div>
                      <label htmlFor={`usermailId-${orgIndex}-${userIndex}`} className="block text-gray-700 font-bold">User Email:</label>
                      <input
                        type="email"
                        id={`usermailId-${orgIndex}-${userIndex}`}
                        value={user.usermailId}
                        onChange={(e) => handleUserChange(orgIndex, userIndex, 'usermailId', e.target.value)}
                        required
                        className="mt-1 block w-full p-1 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor={`password-${orgIndex}-${userIndex}`} className="block text-gray-700 font-bold">Password:</label>
                      <input
                        type="password"
                        id={`password-${orgIndex}-${userIndex}`}
                        value={user.password}
                        onChange={(e) => handleUserChange(orgIndex, userIndex, 'password', e.target.value)}
                        required
                        className="mt-1 block w-full p-1 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center">
                      {userIndex > 0 && (
                        <button
                          type="button"
                          className="bg-red-600 text-white rounded hover:bg-red-700 m-2 mt-6"
                          onClick={() => removeUser(orgIndex, userIndex)}
                        >
                          -
                        </button>
                      )}
                      {userIndex === org.users.length - 1 && (
                        <button
                          type="button"
                          className="bg-blue-600 text-white m-2 mt-6 rounded hover:bg-blue-700"
                          onClick={() => addUser(orgIndex)}
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-1 md:grid-cols-8 form-group flex items-center mt-4">
            <input
              type="checkbox"
              id="gs1Org"
              checked={gs1Org}
              onChange={(e) => setGs1Org(e.target.checked)}
              className="md:col-span-1 mr-2 "
            />
            <label htmlFor="gs1Org" className="md:col-span-6 block text-gray-700 font-bold">Allow GS1 as Default Organization</label>
          </div>
          <button
            type="submit"
            className="mt-4 block w-full bg-blue-600 text-white p-1 rounded hover:bg-blue-700 font-bold"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/LoginPage" className="text-blue-600 hover:underline font-bold">Already have an account? Login here</Link>
        </div>
      </div>
      <Modal show={showModal} onClose={() => handleCloseModal()} />
    </div>
  );
};

export default RegistrationPage;
