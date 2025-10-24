// OrderForm component will be implemented here
import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrderForm() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState([{ name: '', quantity: '', specifications: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    // Fetch vendors for dropdown
    const fetchVendors = async () => {
      try {
        // This endpoint would need to be created by Maureen
        const response = await axios.get('http://localhost:5000/vendors', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    
    if (user) fetchVendors();
  }, [user]);


  const addMaterialField = () => {
    setMaterials([...materials, { name: '', quantity: '', specifications: '' }]);
  };

  const removeMaterialField = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterialField = (index, field, value) => {
    const updatedMaterials = materials.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(updatedMaterials);
  };
