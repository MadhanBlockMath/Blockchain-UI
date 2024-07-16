import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApiDocs = () => {
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [username, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');

    if (!user) {
      navigate('/LoginPage');
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
    swaggerUrl ? (
      <iframe
        src={swaggerUrl}
        title="API Docs"
        className="w-full h-full"
        style={{ height: 'calc(100vh - 4rem)' }} // Adjust height as needed
      ></iframe>
    ) : (
      <div>Loading...</div>
    )
  );
};

export default ApiDocs;
