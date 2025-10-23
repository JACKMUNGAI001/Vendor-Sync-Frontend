import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Role: {user?.role || 'Not logged in'}</p>
    </div>
  );
}

export default Dashboard;