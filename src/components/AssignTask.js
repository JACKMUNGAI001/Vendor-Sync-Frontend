import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, AlertCircle, CheckCircle } from 'lucide-react';

const AssignTask = ({ orderId, orderDetails, onClose, onAssignSuccess }) => {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingStaff, setFetchingStaff] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setFetchingStaff(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users?role=staff`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      const staffArray = Array.isArray(data) ? data : (data.users || data.data || []);
      setStaff(staffArray);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      setError('Failed to load staff members. Please try again.');
    } finally {
      setFetchingStaff(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    
    if (!selectedStaff) {
      setError('Please select a staff member');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/assignments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            order_id: orderId,
            staff_id: selectedStaff,
            notes: notes.trim()
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign task');
      }

      setSuccess(true);
      
      // Call success callback after short delay
      setTimeout(() => {
        if (onAssignSuccess) {
          onAssignSuccess();
        }
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Assignment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedStaffMember = staff.find(s => s.id === parseInt(selectedStaff));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Assign Task to Staff</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAssign} className="p-6">
          {/* Order Details */}
          {orderDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order #:</span> {orderId}
              </p>
              {orderDetails.product_name && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Product:</span> {orderDetails.product_name}
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">Task assigned successfully!</p>
            </div>
          )}

          {/* Staff Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Staff Member *
            </label>
            {fetchingStaff ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || success}
                required
              >
                <option value="">-- Select Staff --</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.username} {s.email && `(${s.email})`}
                  </option>
                ))}
              </select>
            )}
            {staff.length === 0 && !fetchingStaff && (
              <p className="text-sm text-amber-600 mt-2">
                No staff members available. Please add staff members first.
              </p>
            )}
          </div>

          {/* Selected Staff Info */}
          {selectedStaffMember && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {selectedStaffMember.name || selectedStaffMember.username}
                </p>
                {selectedStaffMember.email && (
                  <p className="text-xs text-blue-700">{selectedStaffMember.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || success}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || success || staff.length === 0}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Assigning...
                </span>
              ) : (
                'Assign Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTask;