import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUsers, deleteUser, updateUser } from '../slices/userSlice';
import { Link } from 'react-router-dom';
import './UserList.css';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id)).then(() => {
      dispatch(fetchUsers());
    });
  };

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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = (id: string) => {
    dispatch(updateUser({ id, ...editFormData })).unwrap().then(() => {
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
        <Link to="/form">Go to User Form</Link>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
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
                <button onClick={() => handleEditSubmit(user.id)}>Save</button>
                <button onClick={() => setEditingUser(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default UserList;
