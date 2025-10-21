import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useLocation } from 'react-router-dom';

import { loginUser } from '../authSlice';

import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';




const AuthModal = ({ isOpen, onClose, mode = 'login', redirectPath = null }) => {

  const [formMode, setFormMode] = useState(mode);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({

    emailId: '',

    password: '',

    name: ''

  });

  const [errors, setErrors] = useState({});



  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);



  useEffect(() => {
  
    if (!isOpen) return;
    if (isAuthenticated) {
      const target = redirectPath || '/home';
      console.log('User authenticated via AuthModal, redirecting to:', target);
      onClose();
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isOpen, navigate, redirectPath, onClose]);



  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({

      ...prev,

      [name]: value

    }));

    

    if (errors[name]) {

      setErrors(prev => ({

        ...prev,

        [name]: ''

      }));

    }

  };



  const validateForm = () => {

    const newErrors = {};



    if (!formData.emailId) {

      newErrors.emailId = 'Email is required';

    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {

      newErrors.emailId = 'Email is invalid';

    }



    if (!formData.password) {

      newErrors.password = 'Password is required';

    } else if (formData.password.length < 8) {

      newErrors.password = 'Password must be at least 8 characters';

    }



    if (formMode === 'signup' && !formData.name) {

      newErrors.name = 'Name is required';

    }



    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

   

    if (!validateForm()) return;



    try {

      await dispatch(loginUser(formData)).unwrap();

    } catch (err) {

      console.error('Authentication failed:', err);

    }

  };



  const toggleFormMode = () => {

    setFormMode(prev => prev === 'login' ? 'signup' : 'login');

    setErrors({});

    setFormData({

      emailId: '',

      password: '',

      name: ''

    });

  };



  if (!isOpen) return null;



  return (

    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl">

       

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-white">

            {formMode === 'login' ? 'Welcome Back' : 'Create Account'}

          </h2>

          <button

            onClick={onClose}

            className="text-gray-400 hover:text-white transition-colors"

          >

            <X className="w-6 h-6" />

          </button>

        </div>



       

        <form onSubmit={handleSubmit} className="space-y-4">

          {formMode === 'signup' && (

            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">

                Full Name

              </label>

              <div className="relative">

                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input

                  type="text"

                  name="name"

                  value={formData.name}

                  onChange={handleInputChange}

                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"

                  placeholder="Enter your full name"

                />

              </div>

              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}

            </div>

          )}



          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">

              Email Address

            </label>

            <div className="relative">

              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input

                type="email"

                name="emailId"

                value={formData.emailId}

                onChange={handleInputChange}

                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"

                placeholder="Enter your email"

              />

            </div>

            {errors.emailId && <p className="text-red-400 text-sm mt-1">{errors.emailId}</p>}

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">

              Password

            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input

                type={showPassword ? 'text' : 'password'}

                name="password"

                value={formData.password}

                onChange={handleInputChange}

                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"

                placeholder="Enter your password"

              />

              <button

                type="button"

                onClick={() => setShowPassword(!showPassword)}

                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"

              >

                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}

              </button>

            </div>

            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}

          </div>



          {error && (

            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">

              <p className="text-red-400 text-sm">{error}</p>
 </div>

          )}



          <button

            type="submit"

            disabled={loading}

            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

          >

            {loading ? 'Processing...' : (formMode === 'login' ? 'Sign In' : 'Create Account')}

          </button>

        </form>



        

        <div className="mt-6 text-center">

          <p className="text-gray-400">

            {formMode === 'login' ? "Don't have an account?" : "Already have an account?"}

            <button

              onClick={toggleFormMode}

              className="ml-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"

            >

              {formMode === 'login' ? 'Sign Up' : 'Sign In'}

            </button>

          </p>

        </div>



       

        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">

          <p className="text-blue-300 text-sm text-center">

            {formMode === 'login'

              ? 'Sign in to access problems and start coding!'

              : 'Create your account to join our coding community!'

            }

          </p>

        </div>

      </div>

    </div>

  );

};



export default AuthModal;