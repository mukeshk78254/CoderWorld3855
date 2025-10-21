import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Pagination from './Pagination';

const AllSubmissionsHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/submission/history?page=${pagination.page}&limit=${pagination.limit}`);
        
        if (response.data && response.data.submissions) {
          setSubmissions(response.data.submissions);
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          }));
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setError('Failed to fetch your submission history');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAllSubmissions();
    }
  }, [pagination.page, pagination.limit, isAuthenticated]);

  const changePage = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Submission History</h2>
      
      {submissions.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>You haven't submitted any solutions yet.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Problem</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={submission._id}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                    <td>
                      {submission.problemid ? (
                        <div>
                          <div className="font-medium">{submission.problemid.title}</div>
                          <div className="text-xs opacity-60">
                            <span className={`badge ${submission.problemid.difficulty === 'easy' ? 'badge-success' : 
                              submission.problemid.difficulty === 'medium' ? 'badge-warning' : 'badge-error'} badge-sm mr-1`}>
                              {submission.problemid.difficulty}
                            </span>
                            {submission.problemid.tags}
                          </div>
                        </div>
                      ) : (
                        <span className="text-error">Problem not found</span>
                      )}
                    </td>
                    <td>{submission.language}</td>
                    <td>
                      <span className={`badge ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td>{submission.runtime} ms</td>
                    <td>{submission.memory} KB</td>
                    <td>{formatDate(submission.createdAt)}</td>
                    <td>
                      <button 
                        className="btn btn-xs btn-primary"
                        onClick={() => window.location.href = `/problem/${submission.problemid?._id}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.totalPages} 
              onPageChange={changePage} 
            />
          </div>
          
          <div className="mt-4 text-center text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} submissions
          </div>
        </>
      )}
    </div>
  );
};

export default AllSubmissionsHistory;