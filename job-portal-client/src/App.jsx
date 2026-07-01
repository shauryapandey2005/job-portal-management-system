import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/Postjob';
import Applications from './pages/Application'; // 1. Import here!
import Navbar from './components/Navbar';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/post-job" element={user ? <PostJob /> : <Navigate to="/login" />} />

        {/* 2. Add the Applications route here! */}
        <Route path="/applications" element={user ? <Applications /> : <Navigate to="/login" />} />

        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
