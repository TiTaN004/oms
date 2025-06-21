import React, { useState, useEffect } from "react";
import logo from "../../assets/forgot-img.svg";
import { Link } from "react-router-dom";
import API_ENDPOINTS from "../../utils/apiConfig";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP expiry
  useEffect(() => {
    let interval = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown => countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ text: '', type: '' });
    }
  };

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      showMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();

      if (data.outVal === 1) {
        setStep(2);
        setCountdown(900); // 15 minutes countdown
        showMessage('OTP sent successfully to your email', 'success');
      } else {
        showMessage(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.otp.trim()) {
      showMessage('Please enter the OTP');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          action: 'verify_otp'
        })
      });

      const data = await response.json();

      if (data.outVal === 1) {
        setStep(3);
        showMessage('OTP verified successfully', 'success');
      } else {
        showMessage(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.newPassword.trim()) {
      showMessage('Please enter new password');
      return;
    }

    // if (formData.newPassword.length < 6) {
    //   showMessage('Password must be at least 6 characters long');
    //   return;
    // }

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (data.outVal === 1) {
        showMessage('Password reset successfully! You can now login with your new password.', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resendOTP = () => {
    const fakeEvent = { preventDefault: () => {} };
    sendOTP(fakeEvent);
  };

  return (
    <div className="flex h-screen min-h-full flex-col md:flex-row md:items-center justify-center px-6 py-12 lg:px-8 bg-[#e8eefc]">
      <div className="flex justify-center w-[100%] md:w-[50%]">
        <img
          className="w-[350px] md:w-[580px]"
          src={logo}
          alt="Forgot Password"
        />
      </div>

      <div className="mt-10 md:mt-0 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
              2
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
              3
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form className="space-y-6" onSubmit={sendOTP}>
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Forgot Password
            </h2>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="text-center flex w-full justify-center rounded-sm bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form className="space-y-6" onSubmit={verifyOTP}>
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Verify OTP
            </h2>
            <div className="text-center text-sm text-gray-600">
              Enter the 6-digit OTP sent to <strong>{formData.email}</strong>
            </div>
            {countdown > 0 && (
              <div className="text-center text-sm text-indigo-600">
                OTP expires in: <strong>{formatTime(countdown)}</strong>
              </div>
            )}
            <div>
              <label htmlFor="otp" className="block text-sm/6 font-medium text-gray-900">
                OTP Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  maxLength="6"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="text-center flex w-full justify-center rounded-sm bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={resendOTP}
                disabled={countdown > 0 || loading}
                className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
              >
                {countdown > 0 ? `Resend OTP in ${formatTime(countdown)}` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form className="space-y-6" onSubmit={resetPassword}>
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Set New Password
            </h2>
            <div>
              <label htmlFor="newPassword" className="block text-sm/6 font-medium text-gray-900">
                New Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Password must be at least 6 characters long
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="text-center flex w-full justify-center rounded-sm bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        <div className="text-sm w-full text-center mt-4">
          <Link
            to="/"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}