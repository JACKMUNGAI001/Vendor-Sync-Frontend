import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dashboard', {
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
    <div>
      <h1>Dashboard</h1>
      <p>Role: {user?.role || 'Not logged in'}</p>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;