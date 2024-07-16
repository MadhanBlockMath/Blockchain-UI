import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const authenticateUser = async () => {
        const username = sessionStorage.getItem('user');
        console.log(username);
        if (!username) {
          navigate('/LoginPage');
          return;
        }

        try {
          // Get the auth token
          const authToken = await getAuthToken(username);
          
          // Validate the auth token
          const isValid = await validateAuthToken(authToken);

          if (!isValid) {
            navigate('/LoginPage');
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          navigate('/LoginPage');
        }
      };

      authenticateUser();
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

const getAuthToken = async (username) => {
  try {
    const response = await axios.get('http://20.244.10.93:3009/get-auth-token', {
      params: { username }
    });
    return response.data.token;
  } catch (error) {
    throw new Error('Failed to get auth token');
  }
};

const validateAuthToken = async (token) => {
  try {
    const response = await axios.get('http://20.244.10.93:3009/protected', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.status !== 401 && response.status !== 403;
  } catch (error) {
    return false;
  }
};

export default withAuth;
