import React from 'react';
import { Link } from 'react-router-dom';

const Root: React.FC = () => {
  return (
    <div>
      <h1>Welcome to User Management</h1>
      <nav>
        <ul>
          <li>
            <Link to="/form">Go to User Form</Link>
          </li>
          <li>
            <Link to="/list">Go to User List</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Root;
