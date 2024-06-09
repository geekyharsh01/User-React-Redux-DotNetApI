import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUsers, deleteUser, updateUser } from '../slices/userSlice';
import { Link } from 'react-router-dom';
import './UserList.css';

const UserList: React.FC = () => {
  // Initialize the Redux dispatch function
  const dispatch = useDispatch<AppDispatch>();
  
  // Select users, loading status, and error from the Redux state
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  // State to manage the currently editing user ID and form data for editing
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    location: ''
  });

  // Fetch users when the component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle deleting a user
  const handleDelete = (id: string) => {
    dispatch(deleteUser(id)).then(() => {
      // Fetch the updated user list after deletion
      dispatch(fetchUsers());
    });
  };

  // Handle editing a user
  const handleEdit = (user: any) => {
    setEditingUser(user.id);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      email: user.email,
      location: user.location
    });
  };

  // Handle changes to the edit form inputs
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  // Handle submitting the edited user data
  const handleEditSubmit = (id: string) => {
    dispatch(updateUser({ id, ...editFormData })).unwrap().then(() => {
      // Reset editing state and fetch the updated user list after successful update
      setEditingUser(null);
      dispatch(fetchUsers());
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {/* Link to navigate to the user form page */}
      <Link to="/form">Go to User Form</Link>
      
      {/* User list */}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-details">
              <p><strong>First Name:</strong> {editingUser === user.id ? (
                <input
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleEditChange}
                />
              ) : user.firstName}</p>
              <p><strong>Last Name:</strong> {editingUser === user.id ? (
                <input
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleEditChange}
                />
              ) : user.lastName}</p>
              <p><strong>Address:</strong> {editingUser === user.id ? (
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                />
              ) : user.address}</p>
              <p><strong>Email:</strong> {editingUser === user.id ? (
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                />
              ) : user.email}</p>
              <p><strong>Location:</strong> {editingUser === user.id ? (
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                />
              ) : user.location}</p>
            </div>
            {editingUser === user.id ? (
              <>
                <button className="btn btn-success" onClick={() => handleEditSubmit(user.id)}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => handleEdit(user)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
