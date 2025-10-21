import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient';

const ChangePassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axiosClient.post('/api/auth/send-password-otp', { email });
      setStep(2);
      setSuccess('OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      await axiosClient.post('/api/auth/change-password', { email, otp, newPassword });
      setSuccess('Password changed successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      {success && <div className="mb-4 text-green-400">{success}</div>}
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <label className="block text-gray-300 mb-2">Registered Email</label>
          <input
            type="email"
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleChangePassword}>
          <label className="block text-gray-300 mb-2">OTP</label>
          <input
            type="text"
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          <label className="block text-gray-300 mb-2">New Password</label>
          <input
            type="password"
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <label className="block text-gray-300 mb-2">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save New Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
