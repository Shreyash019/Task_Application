import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = 'https://task-application-rt3q.onrender.com';
export const fetchAllUsersTasks = createAsyncThunk(
  'tasks/fetchAllUsersTasks',
  async ({token, sort, search}) => {
    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      const response = await axios.get(`${apiUrl}/task?sort=${sort || 'default'}&search=${search || ""}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        withCredentials: true, // Include credentials if needed
      });
      return response.data;
    } catch (error) {
      // Handle specific error codes or messages if needed
      if (error.response && error.response.status === 400) {
        throw new Error('Missing value!');
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Task data not found!');
      }
      if (error.response && error.response.status === 403) {
        throw new Error('Something went wrong please try after some time!');
      }
      if (error.response && error.response.status === 500) {
        throw new Error('Server problem!');
      }
      throw error;
    }
  }
);
export const taskStatusUpdate = createAsyncThunk(
  'tasks/taskStatusUpdate',
  async ({token, status, tasks}) => {
    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      const response = await axios.post(`${apiUrl}/task/status-update`, {status, tasks}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        withCredentials: true, // Include credentials if needed
      });
      return response.data;
    } catch (error) {
      // Handle specific error codes or messages if needed
      if (error.response && error.response.status === 400) {
        throw new Error('Missing value!');
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Task data not found!');
      }
      if (error.response && error.response.status === 403) {
        throw new Error('Something went wrong please try after some time!');
      }
      if (error.response && error.response.status === 500) {
        throw new Error('Server problem!');
      }
      throw error;
    }
  }
);
export const createANewTask = createAsyncThunk(
  'auth/createANewTask',
  async ({token, title, description}) => {
    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      const response = await axios.post(`${apiUrl}/task`, {title, description}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        withCredentials: true, // Include credentials if needed
      });
      return response.data;
    } catch (error) {
      // Handle specific error codes or messages if needed
      if (error.response && error.response.status === 400) {
        throw new Error('Please provide all details');
      }
      if (error.response && error.response.status === 403) {
        throw new Error('Something went wrong please try after some time!');
      }
      if (error.response && error.response.status === 500) {
        throw new Error('Server problem!');
      }
      throw error;
    }
  }
);
export const editATask = createAsyncThunk(
  'auth/editATask',
  async ({token, tid, title, description}) => {
    try {

      if (!token) {
        throw new Error('Unauthorized');
      }
      const response = await axios.put(`${apiUrl}/task/${tid}`, {
        title, description
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        withCredentials: true, // Include credentials if needed
      });
      return response.data;
    } catch (error) {
      // Handle specific error codes or messages if needed
      if (error.response && error.response.status === 400) {
        throw new Error('Please provide all details');
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Task data not found!');
      }
      if (error.response && error.response.status === 403) {
        throw new Error('Something went wrong please try after some time!');
      }
      if (error.response && error.response.status === 500) {
        throw new Error('Server problem!');
      }
      throw error;
    }
  }
);
export const deleteUserTask = createAsyncThunk(
  'auth/deleteAUser',
  async ({token, id}) => {
    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      const response = await axios.delete(`${apiUrl}/task/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        withCredentials: true, // Include credentials if needed
      });
      return response.data;
    } catch (error) {
      // Handle specific error codes or messages if needed
      if (error.response && error.response.status === 400) {
        throw new Error('Missing value!');
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Task data not found!');
      }
      if (error.response && error.response.status === 403) {
        throw new Error('Something went wrong please try after some time!');
      }
      if (error.response && error.response.status === 500) {
        throw new Error('Server problem!');
      }
      throw error;
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: undefined,
    allTasks: undefined
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsersTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllUsersTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTasks = action.payload
      })
      .addCase(fetchAllUsersTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })


      .addCase(createANewTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createANewTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTasks = undefined;
      })
      .addCase(createANewTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })

      .addCase(editATask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editATask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTasks = undefined;
      })
      .addCase(editATask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })

      .addCase(deleteUserTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUserTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTasks = undefined;
      })
      .addCase(deleteUserTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
  },
});

export default taskSlice.reducer;
