import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApiDocs = () => {
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSwaggerUrl = async () => {
      const username = sessionStorage.getItem('user');
      // const authToken = sessionStorage.getItem('token');
      if (!username) {
        navigate('/login');
        return;
      }

      try {
        const authTokenResponse = await axios.get('http://localhost:4000/get-auth-token', {
          params: { username },
        });

        const authToken = authTokenResponse.data.token;

        const response = await axios.get('http://localhost:4000/get-swagger-uri', {
          params: { username },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
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
