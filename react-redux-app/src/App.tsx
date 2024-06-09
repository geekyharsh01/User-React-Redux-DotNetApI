import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import Root from './components/root';
const App: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/form" element={<UserForm />} />
          <Route path="/list" element={<UserList />} />
          <Route path="/" element={<Root/>} />
        </Routes>
    </Router>
  );
};

export default App;
