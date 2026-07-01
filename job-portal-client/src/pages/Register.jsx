import { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit">Register</button>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
