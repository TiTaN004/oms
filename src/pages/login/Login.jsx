// import React from "react";
// import logo from "../../assets/OTPlogo.png";
// import { Link, useNavigate } from "react-router-dom";

// export default function Login() {
//   const navigation = useNavigate()
//   const handleSubmit = () => {
//     navigation('/dashboard/')
//   }

//   return (
//     <div className="flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-[#e8eefc]">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         <img
//           className="mx-auto h-[150px] w-auto"
//           src={logo}
//           alt="Your Company"
//         />
//         <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//           Welcome Back
//         </h2>
//         <h6 className=" text-center text-md/9 tracking-tight text-gray-900">
//           Please login to continue your account
//         </h6>
//       </div>

//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label
//               htmlFor="ID"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Email ID
//             </label>
//             <div className="mt-2">
//               <input
//                 type="text"
//                 name="ID"
//                 id="ID"
//                 autoComplete="ID"
//                 required
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center justify-between">
//               <label
//                 htmlFor="password"
//                 className="block text-sm/6 font-medium text-gray-900"
//               >
//                 Password
//               </label>
//               <div className="text-sm">
//                 <Link
//                   to="/forgot-password"
//                   className="font-semibold text-indigo-600 hover:text-indigo-500"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//             </div>
//             <div className="mt-2">
//               <input
//                 type="password"
//                 name="password"
//                 id="password"
//                 autoComplete="current-password"
//                 required
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-sm bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Login
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import logo from "../../assets/OTPlogo.png";
import { Link, useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../utils/apiConfig";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.statusCode === 200 && data.outVal === 1) {
        // Store user data and token
        localStorage.setItem('authToken', data.data[0].token);
        localStorage.setItem('userData', JSON.stringify(data.data[0]));
        
        // Navigate to dashboard
        navigate('/dashboard/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-[#e8eefc]">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-[150px] w-auto"
          src={logo}
          alt="OMS Logo"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Welcome Back
        </h2>
        <h6 className="text-center text-md/9 tracking-tight text-gray-900">
          Please login to continue your account
        </h6>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div>
            <label
              htmlFor="userName"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="userName"
                id="userName"
                value={formData.userName}
                onChange={handleInputChange}
                autoComplete="email"
                required
                disabled={loading}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
                disabled={loading}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-sm bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}