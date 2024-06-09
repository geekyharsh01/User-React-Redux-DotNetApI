import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the structure of a User object
interface User {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  location: string;
}

// Define the structure of the state for user management
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Initial state for the user slice
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// API base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", API_URL);  // Debugging line to check if API_URL is being read correctly

// Asynchronous thunk action to fetch users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(`${API_URL}/api/user`);
  return response.data;
});

// Asynchronous thunk action to add a new user
export const addUser = createAsyncThunk('users/addUser', async (user: User) => {
  const response = await axios.post(`${API_URL}/api/user`, user);
  return response.data;
});

// Asynchronous thunk action to update an existing user
export const updateUser = createAsyncThunk('users/updateUser', async (user: User) => {
  const response = await axios.put(`${API_URL}/api/user/${user.id}`, user);
  return response.data;
});

// Asynchronous thunk action to delete a user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  await axios.delete(`${API_URL}/api/user/${id}`);
  return id;
});

// Create a slice for user management
const userSlice = createSlice({
  name: 'users',  // Name of the slice
  initialState,   // Initial state
  reducers: {},   // Reducers (none in this case)
  extraReducers: (builder) => {  // Extra reducers for handling async actions
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;  // Set loading to true when fetching users
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false when fetch is complete
        state.users = action.payload;  // Update users with the fetched data
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;  // Set loading to false when fetch fails
        state.error = action.error.message || 'Failed to fetch users';  // Set error message
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);  // Add the new user to the users array
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;  // Update the user in the users array
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);  // Remove the deleted user from the users array
      });
  },
});

// Export the reducer to be used in the store
export default userSlice.reducer;
