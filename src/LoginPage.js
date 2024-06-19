import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', username);
        console.log('Access Token:', token);
        console.log('User:', username);
        navigate('/InputPage');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen bg-gray-100 relative">
      <img
        src="https://www.gs1india.org/wp-content/uploads/2022/06/logo-600x402-1-600x402.png"
        alt="GS1 India Logo"
        className="absolute top-0 left-0 m-4 w-24 h-auto"
      />
      <div className="register-container bg-white p-6 rounded-lg shadow-md max-w-xs w-full">
        <div className="register-link text-right mb-4">
          <Link to="/Register" className="text-blue-600 hover:underline font-bold">Register</Link>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={handleUsernameChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {errorMessage && (
            <div className="error-message text-red-500 mb-4">
              {errorMessage}
            </div>
          )}

          <div className='flex justify-center'>
            <button
              type="submit"
              className="w-1/3 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
