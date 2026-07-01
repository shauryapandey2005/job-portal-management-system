import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '' // Backend requires this!
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', jobData);
      alert('Job posted successfully! 🚀');
      navigate('/');
    } catch (err) {
      alert('Failed to post job: ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Post a New Job</h2>
        <input
          type="text"
          placeholder="Job Title (e.g. Frontend Developer)"
          onChange={(e) => setJobData({...jobData, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Company Name (e.g. Google)"
          onChange={(e) => setJobData({...jobData, company: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Location (e.g. Remote, New York)"
          onChange={(e) => setJobData({...jobData, location: e.target.value})}
        />
        <input
          type="text"
          placeholder="Salary (e.g. $100,000)"
          onChange={(e) => setJobData({...jobData, salary: e.target.value})}
        />
        {/* NEW DESCRIPTION FIELD */}
        <textarea
          placeholder="Job Description (Required)"
          onChange={(e) => setJobData({...jobData, description: e.target.value})}
          required
          rows="4"
        />
        <button type="submit">Publish Job</button>
      </form>
    </div>
  );
};

export default PostJob;
