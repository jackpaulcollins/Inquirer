/* eslint-disable import/extensions */
import React, { useState, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { UserContext } from './contexts/userContext.js';

import PrivateRoutes from './utils/PrivateRoutes';
import api from './utils/api';

import Documents from './components/Documents';
import Note from './components/Note';
import Nav from './components/Nav';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateNote from './components/CreateNote';
import DocumentUpload from './components/DocumentUpload';
import DocumentViewer from './components/Document.jsx';
import './index.css';

function App() {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.post('/auth/verify', { token })
        .then((response) => {
          setUserId(response.data.userId);
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message === 'Token expired') {
            localStorage.setItem('flashMessage', 'Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/login';
          } else {
            // eslint-disable-next-line no-console
            console.log(error);
          }
        }).finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line max-len
  const memoizedContext = useMemo(() => ({ userContextValue: { userId }, isLoading }), [userId, isLoading]);

  return (
    <UserContext.Provider value={memoizedContext}>
      <div className="App">
        <Nav />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={(
                <PrivateRoutes>
                  <Documents />
                </PrivateRoutes>
              )}
            />
            <Route
              path="/notes/new"
              element={(
                <PrivateRoutes>
                  <CreateNote />
                </PrivateRoutes>
              )}
            />
            <Route
              path="/notes/:id"
              element={(
                <PrivateRoutes auth>
                  <Note />
                </PrivateRoutes>
              )}
            />
            <Route
              path="/documents/upload"
              element={(
                <PrivateRoutes auth>
                  <DocumentUpload />
                </PrivateRoutes>
              )}
            />
            <Route
              path="/documents/:id"
              element={(
                <PrivateRoutes auth>
                  <DocumentViewer />
                </PrivateRoutes>
              )}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
