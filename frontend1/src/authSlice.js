
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient'; 
const getSerializableError = (error) => {
  if (error.response) {
   
    return {
      message: error.response.data?.message || error.message,
      statusCode: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {

    return {
      message: 'No response from server. Please check your internet connection.',
      statusCode: null,
      data: null,
    };
  } else {
    
    return {
      message: error.message,
      statusCode: null,
      data: null,
    };
  }
};


export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/send-otp-for-registration', userData);
      
      
      if (response.data.developmentMode && response.data.otp) {
        localStorage.setItem('devOtp', response.data.otp);
        console.log('🔑 Development OTP stored:', response.data.otp);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(getSerializableError(error));
    }
  }
);


export const verifyOtpAndRegister = createAsyncThunk(
  'auth/verifyOtpAndRegister',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/verify-otp-and-register', otpData);
   
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(getSerializableError(error));
    }
  }
);


export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/resend-otp-for-registration', emailData);
      
      
      if (response.data.developmentMode && response.data.otp) {
        localStorage.setItem('devOtp', response.data.otp);
        console.log('🔑 Development OTP stored for resend:', response.data.otp);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(getSerializableError(error));
    }
  }
);


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
     
      const response = await axiosClient.post('/user/register', userData);
      
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      return rejectWithValue(getSerializableError(error));
    }
  }
);


export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🚀 loginUser thunk: Starting login with credentials:', credentials);
      const response = await axiosClient.post('/user/login', credentials);
      
      console.log('✅ loginUser thunk: Login successful, response:', response.data);
      
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); 

      console.log('💾 loginUser thunk: Stored token and user in localStorage');
      return response.data.user; 
    } catch (error) {
      console.log('❌ loginUser thunk: Login failed:', error);
      return rejectWithValue(getSerializableError(error));
    }
  }
);


export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
     
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (error.response?.status === 401) {
        
        return rejectWithValue(null);
      }
      return rejectWithValue(getSerializableError(error));
    }
  }
);


export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async (socialData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/social-login', socialData);
      
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      return rejectWithValue(getSerializableError(error));
    }
  }
);


export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
     
      await axiosClient.post('/user/logout');
    } catch (error) {
      console.warn("Backend logout failed, but client-side data will still be cleared:", getSerializableError(error));
    
    } finally {

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'), 
    loading: false,
    error: null, 
   
    otpSent: false,
    emailForVerification: null,
    resendLoading: false
  },
  reducers: {
    
    clearError: (state) => {
      state.error = null;
    },
   
    resetOtpState: (state) => {
      state.otpSent = false;
      state.error = null;
      state.loading = false;
      state.resendLoading = false;
      state.emailForVerification = null;
    },
    
    updateProfileImage: (state, action) => {
      if (state.user) {
        state.user.profileImage = action.payload;
        
        const updatedUser = { ...state.user, profileImage: action.payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
   
    removeProfileImage: (state) => {
      if (state.user) {
        state.user.profileImage = null;
     
        const updatedUser = { ...state.user, profileImage: null };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
   
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
     
      localStorage.setItem('user', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
       
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
     
        state.error = action.payload; 
        state.isAuthenticated = false;
        state.user = null;
        
      })
  
      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; 
        state.user = action.payload;
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        state.isAuthenticated = false;
        state.user = null;
        
      })
  
      
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload; 
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        
        if (action.payload === null) {
          state.error = null;
        } else {
          state.error = action.payload;
        }
        state.isAuthenticated = false;
        state.user = null;
        
      })
  
      
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
  
     
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; 
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        state.isAuthenticated = false;
        state.user = null;
      })

    
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.emailForVerification = action.meta.arg.emailId;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtpAndRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAndRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.otpSent = false;
        state.emailForVerification = null;
      })
      .addCase(verifyOtpAndRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })

      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, updateProfileImage, removeProfileImage, resetOtpState, loginSuccess } = authSlice.actions; // Export actions
export default authSlice.reducer;