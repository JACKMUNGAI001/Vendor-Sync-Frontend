import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function QuoteForm({ orderId, onSubmitSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (!user) {
      alert('Please log in to submit a quote');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/quotes', {
        order_id: orderId,
        price: parseFloat(data.price),
        notes: data.notes || ''
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      alert('Quote submitted successfully!');
      reset();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error('Quote submission error:', error);
      alert(error.response?.data?.message || 'Failed to submit quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Submit Quote for Order #{orderId}</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price ($)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          {...register('price', { 
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' }
          })}
          className="input-field"
          placeholder="Enter your quote price"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows="3"
          className="input-field"
          placeholder="Any additional notes or conditions..."
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-primary w-full disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Quote'}
      </button>
    </form>
  );
}

export default QuoteForm;