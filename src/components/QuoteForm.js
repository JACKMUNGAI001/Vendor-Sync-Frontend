import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { DollarSign, FileText, Send } from 'lucide-react';

const QuoteForm = ({ orderId, onSubmitSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const price = watch('price', '');

  const onSubmit = async (data) => {
    if (!user) {
      setSubmitError('Please log in to submit a quote');
      return;
    }

    if (user.role !== 'vendor') {
      setSubmitError('Only vendors can submit quotes');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const quoteData = {
        order_id: parseInt(orderId),
        price: parseFloat(data.price),
        notes: data.notes || ''
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(quoteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit quote');
      }

      setSubmitSuccess(true);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      setTimeout(() => {
        setSubmitSuccess(false);
        if (onCancel) onCancel();
      }, 2000);

    } catch (error) {
      console.error('Quote submission error:', error);
      setSubmitError(error.message || 'Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (value) => {
    if (!value) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quote Submitted Successfully!</h3>
          <p className="text-gray-600">Your quote has been sent to the procurement manager.</p>
          <p className="text-sm text-gray-500 mt-2">You will be notified when it's reviewed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Submit Quote for Order #{orderId}</h3>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quote Price ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
                validate: {
                  positive: value => parseFloat(value) > 0 || 'Price must be greater than 0'
                }
              })}
              className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
          {price && (
            <p className="text-sm text-gray-600 mt-1">
              Formatted: ${formatPrice(price)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes & Conditions (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Include any special terms, delivery conditions, warranty information, or additional notes for the procurement manager..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This information will help the manager evaluate your quote.
          </p>
        </div>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {submitError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Quote
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Quote Submission Tips:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Ensure your price is competitive but covers all costs</li>
          <li>• Include any special terms or conditions in the notes</li>
          <li>• Consider delivery timelines and any additional services</li>
          <li>• Double-check all calculations before submitting</li>
        </ul>
      </div>
    </div>
  );
};

export default QuoteForm;