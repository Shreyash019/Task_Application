import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = 'https://task-application-rt3q.onrender.com';
export const UserSignUp = createAsyncThunk(
  'auth/UserSignUp',
  async (data) => {
    try {

      const response = await axios.post(`${apiUrl}/user/sign-up`, data);
      return response.data;
    } catch (error) {
      // Handle specific error codes or messages if needed
      if (error.response && error.response.status === 400) {
        throw new Error('Some Value missing!');
      }
      if (error.response && error.response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (error.response && error.response.status === 409) {
        throw new Error('User exist with given name!');
      }
      throw error;
    }
  }
);

export const UserSignIn = createAsyncThunk(
  'auth/UserSignIn',
  async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/user/sign-in`, data);

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Either password or email missing!');
      }
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid Credentials');
      }
      // Handle unexpected errors
      throw new Error('An unexpected error occurred');
    }
  }
);

export const GoogleSignIn = createAsyncThunk(
  'auth/GoogleSignIn',
  async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/user/google-sign-in`, {token: data});

      return response.data;
    } catch (error) {
      // Handle specific error codes or messages if needed
      if (error.response && error.response.status === 400) {
        throw new Error('Access token missing');
      }
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid Credentials');
      }
      throw error;
    }
  }
);

export const UserSignOut = createAsyncThunk(
  'auth/UserSignOut',
  async () => {
    const response = await axios.get(`${apiUrl}/user/sign-out`)
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    token: undefined,
    status: 'idle',
    error: undefined,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false
      state.token = undefined,
      state.isLoading = false
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserSignUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(UserSignUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated =  true
        state.token = action.payload.token,
        state.user = action.payload.user
      })
      .addCase(UserSignUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })

      .addCase(UserSignIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(UserSignIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated =  true
        state.token = action.payload.token,
        state.user = action.payload.user
      })
      .addCase(UserSignIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })


      .addCase(GoogleSignIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(GoogleSignIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated =  true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(GoogleSignIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })

      .addCase(UserSignOut.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(UserSignOut.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.token = undefined
        state.isAuthenticated =  false
      })
      .addCase(UserSignOut.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
