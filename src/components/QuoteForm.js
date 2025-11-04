import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { DollarSign, FileText, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const QuoteForm = ({ orderId, onSubmitSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requirementId = searchParams.get('requirement_id');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [requirement, setRequirement] = useState(null);
  const [vendorVerified, setVendorVerified] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const price = watch('price', '');

  useEffect(() => {
    checkVendorStatus();
    if (requirementId || orderId) {
      fetchRequirement(requirementId || orderId);
    }
  }, [requirementId, orderId]);

  const checkVendorStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/vendor/status`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const isVerified = data.is_approved || data.verified || false;
        setVendorVerified(isVerified);
        
        if (!isVerified) {
          setSubmitError('Your vendor account must be verified by a manager before you can submit quotes. Please contact the procurement team.');
        }
      }
    } catch (err) {
      console.error('Failed to check vendor status:', err);
      // Don't block submission if status check fails
      setVendorVerified(true);
    } finally {
      setCheckingStatus(false);
    }
  };

  const fetchRequirement = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/requirements/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setRequirement(data);
      }
    } catch (err) {
      console.error('Failed to fetch requirement:', err);
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      setSubmitError('Please log in to submit a quote');
      return;
    }

    if (user.role !== 'vendor') {
      setSubmitError('Only vendors can submit quotes');
      return;
    }

    if (!vendorVerified) {
      setSubmitError('Your account must be verified before submitting quotes.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const quoteData = {
        requirement_id: parseInt(requirementId || orderId),
        order_id: parseInt(orderId),
        price: parseFloat(data.price),
        delivery_time: data.delivery_time || '',
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

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Your vendor account must be verified before submitting quotes. Please contact the procurement manager.');
        }
        throw new Error(responseData.error || responseData.message || 'Failed to submit quote');
      }

      setSubmitSuccess(true);
      reset();
      
      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        if (onCancel) {
          onCancel();
        }
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
            <CheckCircle className="h-8 w-8 text-green-600" />
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
        <div>
          <h3 className="text-lg font-semibold">
            Submit Quote {orderId && `for Order #${orderId}`}
          </h3>
          <p className="text-sm text-gray-600">Provide your price quote and delivery details</p>
        </div>
      </div>

      {/* Loading Status Check */}
      {checkingStatus && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Verifying vendor status...</p>
        </div>
      )}

      {/* Requirement Details */}
      {requirement && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Requirement Details
          </h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <span className="font-medium">Product:</span> {requirement.product_name}
            </p>
            <p>
              <span className="font-medium">Quantity:</span> {requirement.quantity} {requirement.unit || 'units'}
            </p>
            {requirement.delivery_date && (
              <p>
                <span className="font-medium">Required by:</span>{' '}
                {new Date(requirement.delivery_date).toLocaleDateString()}
              </p>
            )}
            {requirement.description && (
              <p className="pt-2 border-t border-blue-200 mt-2">
                <span className="font-medium">Description:</span> {requirement.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Verification Warning */}
      {!checkingStatus && !vendorVerified && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-900 font-medium mb-1">Account Not Verified</p>
            <p className="text-amber-800 text-sm">
              Your vendor account must be verified by a procurement manager before you can submit quotes.
              Please contact the procurement team for assistance.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quote Price ($) *
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
                min: { value: 0.01, message: 'Price must be positive' },
                validate: {
                  positive: value => parseFloat(value) > 0 || 'Price must be greater than 0'
                }
              })}
              className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
              disabled={isSubmitting || !vendorVerified}
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
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Delivery Time *
          </label>
          <input
            type="text"
            {...register('delivery_time', {
              required: 'Delivery time is required'
            })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="e.g., 7-10 business days, 2 weeks, 1 month"
            disabled={isSubmitting || !vendorVerified}
          />
          {errors.delivery_time && (
            <p className="text-red-500 text-sm mt-1">{errors.delivery_time.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Specify how long it will take to deliver the products
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes & Conditions (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Include any special terms, delivery conditions, warranty information, or additional notes for the procurement manager..."
            disabled={isSubmitting || !vendorVerified}
          />
          <p className="text-xs text-gray-500 mt-1">
            This information will help the manager evaluate your quote.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting || !vendorVerified || checkingStatus}
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
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Quote Submission Tips:
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Ensure your price is competitive but covers all costs</li>
          <li>• Include any special terms or conditions in the notes</li>
          <li>• Be realistic with delivery timelines</li>
          <li>• Consider delivery costs and any additional services</li>
          <li>• Double-check all calculations before submitting</li>
        </ul>
      </div>
    </div>
  );
};

export default QuoteForm;