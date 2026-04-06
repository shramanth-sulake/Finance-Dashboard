import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { getAuthToken } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Layout from './components/Layout';

// main app component
function App() {
  // check if user is logged in
  // let's use useState so it updates the UI when it changes
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

  // render routes here
  return (
    <Routes>
      {/* this is the login page */}
      <Route path="/login" element={
        !isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />
      } />
      
      {/* authenticated routes, they need layout */}
      <Route element={isAuthenticated ? <Layout setAuth={setIsAuthenticated} /> : <Navigate to="/login" />}>
        {/* homepage */}
        <Route path="/" element={<Dashboard />} />
        {/* records page */}
        <Route path="/records" element={<Records />} />
      </Route>
      
      {/* fallback for 404, just send them home lol */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// gotta export it so main.tsx can use it
export default App;
