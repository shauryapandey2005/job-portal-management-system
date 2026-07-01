import { useState, useEffect } from 'react';
import api from '../api/api';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch jobs (with search param)
  const fetchJobs = async (search = '') => {
    try {
      const res = await api.get(`/jobs?search=${search}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert('Applied successfully! 🎉');
    } catch (err) {
      alert(err.response?.data?.message || 'Apply failed');
    }
  };

  return (
    <div className="dashboard">
      <h1>Available Jobs</h1>

      <input
        className="search-bar"
        placeholder="Search by title or company..."
        value={searchTerm}
        onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchJobs(e.target.value);
        }}
      />

      {jobs.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', textAlign: 'center' }}>
          No jobs found. Try searching or posting a new job!
        </p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id} className="job-card">
              <div className="job-info">
                <h3>{job.title}</h3>
                <p>
                  🏢 {job.company}
                  {job.location && <span style={{ marginLeft: '10px' }}>📍 {job.location}</span>}
                </p>
                {job.salary && (
                  <p style={{ marginTop: '5px', color: '#10b981', fontSize: '0.9rem' }}>
                    💰 {job.salary}
                  </p>
                )}
              </div>
              <button onClick={() => handleApply(job._id)}>Apply Now</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
