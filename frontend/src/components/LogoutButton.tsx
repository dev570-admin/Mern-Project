import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    await axios.get('/api/auth/logout');

    // ✅ Clear all user-related localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // <--- THIS is required

    navigate('/'); // or use window.location.href = 'http://localhost:5173/';
  } catch (error) {
    console.error('❌ Logout failed:', error.message);
    alert('Logout failed');
  }
};


  return (
    <button
      type="button"
      className="btn btn-danger"
      onClick={handleLogout}
    >
      Logout 
    </button>
  );
};

export default LogoutButton;
