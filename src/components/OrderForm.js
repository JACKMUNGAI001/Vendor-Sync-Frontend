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

  const onSubmit = async (data) => {
    if (user.role !== 'manager') {
      setError('Only Procurement Managers can create orders');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert materials array to object format for material_list
      const materialList = {};
      materials.forEach((material, index) => {
        if (material.name && material.quantity) {
          materialList[`item_${index + 1}`] = {
            name: material.name,
            quantity: material.quantity,
            specifications: material.specifications
          };
        }
      });

      await axios.post('http://localhost:5000/orders', {
        material_list: materialList,
        vendor_id: parseInt(data.vendor_id),
        delivery_date: data.delivery_date,
        special_instructions: data.special_instructions
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create order');
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Purchase Order</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

