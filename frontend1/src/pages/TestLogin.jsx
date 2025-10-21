import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { useState } from 'react';

function TestLogin() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);
  const [testData, setTestData] = useState({
    emailId: 'test@example.com',
    password: 'password123'
  });

  const handleTestLogin = () => {
    console.log('🧪 Testing login with:', testData);
    dispatch(loginUser(testData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={testData.emailId}
              onChange={(e) => setTestData({...testData, emailId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={testData.password}
              onChange={(e) => setTestData({...testData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </div>

        
        <div className="mt-6 space-y-2">
          <div className="text-sm">
            <strong>Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
          </div>
          <div className="text-sm">
            <strong>Loading:</strong> {loading ? '⏳ Yes' : '✅ No'}
          </div>
          <div className="text-sm">
            <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}
          </div>
          {error && (
            <div className="text-sm text-red-600">
              <strong>Error:</strong> {JSON.stringify(error, null, 2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestLogin;




























