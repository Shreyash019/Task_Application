import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from "./globalState/Stores.js";
import Login from "./screens/User/Login";
import SignUp from "./screens/User/SignUp";
import Tasks from "./screens/Task/Tasks";
import AddTask from "./screens/Task/AddTask.jsx"
import SingleTask from './screens/Task/SingleTask.jsx';
import EditTasks from './screens/Task/EditTasks.jsx';
import ErrorPage from './screens/Navigation/ErrorPage.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <ProtectedRoute element={<Tasks />} />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'new-task',
        element: <ProtectedRoute element={<AddTask />} />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'single-task/:tid',
        element: <ProtectedRoute element={<SingleTask />} />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'edit-task/:tid',
        element: <ProtectedRoute element={<EditTasks />} />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'login',
        element: <Login />,
        errorElement: <ErrorPage />,
      }
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} fallbackElement={<div>Error</div>} />
      </PersistGate>
    </Provider>,
  </React.StrictMode>,
);