import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import InputPage from './components/InputPage';
import ApiDocs from './components/ApiDocs';
import EventReport from './components/EventReport'
import BatchReport from './components/BatchReport'
import Homepage from './components/HomePage';
const App = () => {
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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
