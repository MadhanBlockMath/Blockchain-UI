import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingModule from './components/LoadingModule';

const LoginPage = () => {
  const [usermailid, setusermailid] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

  const handleusermailidChange = (e) => {
    setusermailid(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage('Authenticating your credentials...');

    try {
      const response = await fetch('http://20.244.10.93:3009/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usermailid, password })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', usermailid);
        console.log('Access Token:', token);
        console.log('User:', usermailid);
        setLoadingMessage('Network Connected!');
        setTimeout(() => {
          navigate('/InputPage/Homepage');
        }, 1000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid usermailid or password');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen bg-gray-100 relative">
      <img
        src="https://www.gs1india.org/wp-content/uploads/2022/06/logo-600x402-1-600x402.png"
        alt="GS1 India Logo"
        className="absolute top-0 left-0 m-4 w-24 h-auto"
      />
      <img
        src="https://www.gs1belu.org/sites/gs1belu/files/styles/banner/public/2020-10/GS1_Corp_Visual_Size4_RGB_2014-12-17.png?h=ecbffee2&itok=UPOULwv2"
        alt="GS1 India Facebook"
        className="absolute top-0 left-0 w-auto h-1/2 opacity-15 pointer-events-none z-0"
      />
      <img
        src="https://www.gs1belu.org/sites/gs1belu/files/styles/banner/public/2020-10/GS1_Corp_Visual_Size4_RGB_2014-12-17.png?h=ecbffee2&itok=UPOULwv2"
        alt="GS1 India Facebook"
        className="absolute bottom-0 left-0 w-auto h-1/2 opacity-15 pointer-events-none z-0"
      />
      <div className="register-container bg-white p-6 rounded-lg shadow-md max-w-xs w-full mt-16 relative z-10">
        <div className="register-link text-right mb-4">
          <Link to="/Register" className="text-blue-600 hover:underline font-bold">Register</Link>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-4">
            <label htmlFor="usermailid" className="block text-gray-700 font-bold mb-2">User mail ID:</label>
            <input
              type="text"
              id="usermailid"
              name="usermailid"
              required
              value={usermailid}
              onChange={handleusermailidChange}
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
      {isLoading && <LoadingModule message={loadingMessage} />}
    </div>
  );
};

export default LoginPage;
