import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import InputPage from './components/InputPage';
import ApiDocs from './components/ApiDocs';
import EventReport from './components/EventReport'
import BatchReport from './components/BatchReport'
import Homepage from './components/HomePage';
import AddUser from './components/AddUser';
import axios from 'axios';
const App = () => {
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Register" element={<RegistrationPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/InputPage" element={<InputPage />}>
          <Route path="HomePage" element={<Homepage />} />
          <Route path="api-docs" element={<ApiDocs />} />
          <Route path="event-report" element={<EventReport />} />
          <Route path="batch-report" element={<BatchReport />} />
          <Route path="add-user" element={<AddUser checkUsermailidExists ={checkUsermailidExists} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
