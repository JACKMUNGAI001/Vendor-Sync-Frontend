import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setData(response.data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Role: {user?.role || 'Not logged in'}</p>
      <ul className="mt-4">
        {data.map(item => (
          <li key={item.id} className="p-2 border-b">{item.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;