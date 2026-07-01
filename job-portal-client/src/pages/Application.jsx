import { useState, useEffect } from 'react';
import api from '../api/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications');
        setApplications(response.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      }
    };
    fetchApplications();
  }, []);

  // NEW: Function to handle deleting an application
  const handleDelete = async (id) => {
    // Add a quick confirmation popup so users don't click it by accident
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await api.delete(`/applications/${id}`);
      alert('Application withdrawn successfully.');

      // Instantly remove the deleted application from the UI without reloading the page
      setApplications(applications.filter(app => app._id !== id));
    } catch (err) {
      alert('Failed to delete application: ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div className="dashboard">
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>You haven't applied to any jobs yet. Head to the dashboard to find your next role!</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app._id} className="job-card">
              <div className="job-info">
                <h3>{app.job?.title || 'Unknown Job'}</h3>
                <p>🏢 {app.job?.company || 'Unknown Company'}</p>
                <p style={{ marginTop: '8px', color: '#10b981', fontWeight: '500' }}>
                  Status: {app.status || 'Application Submitted 🚀'}
                </p>
              </div>

              {/* NEW: Delete Button */}
              <button
                onClick={() => handleDelete(app._id)}
                className="logout-btn"
                style={{ marginTop: '0', width: 'auto' }}
              >
                Withdraw
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Applications;
