import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingModule from './LoadingModule';

const ApiDocs = () => {
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [username, setUserName] = useState('');
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');

    if (!user) {
      setShowTimeoutModal(true);
      setTimeout(() => {
        navigate('/LoginPage');
      }, 2000);
      return;
    }

    setAuthToken(token);
    setUserName(user);

    const fetchSwaggerUrl = async () => {
      try {
        console.log("token",token);
        console.log("user",user);
        const response = await axios.get('http://20.244.10.93:3009/get-swagger-url', {
          params: { username: user },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        setSwaggerUrl(response.data.swagger_url);
        console.log(response.data.swagger_url);
      } catch (error) {
        console.error('Error fetching Swagger URL:', error);
        navigate('/LoginPage');
      }
    };

    fetchSwaggerUrl();
  }, [navigate]);

  return (
    <div>
      {showTimeoutModal && <LoadingModule message="Session Timed Out. Redirecting to Login Page..." />}
      {swaggerUrl ? (
        <iframe
          src={swaggerUrl}
          title="API Docs"
          className="w-full h-full"
          style={{ height: 'calc(100vh - 4rem)' }} // Adjust height as needed
        ></iframe>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ApiDocs;
