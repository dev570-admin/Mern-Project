import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setLoggedInUser(name);
    }
  }, []);

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "GET",
      credentials: "include" // ✅ To include the cookie in request
    });

    // Clear frontend data (optional but good)
    localStorage.removeItem('name');
    localStorage.removeItem('email');

    // Redirect after short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);

  } catch (error) {
    console.error("Logout failed", error);
  }
};

  return (
    <div container>
      <h2>✅ Helo: {loggedInUser}</h2>
      
        <button type="button" className="btn btn-danger mt-3" onClick={handleLogout} style={{ marginLeft: '15px',}}>Logout</button>
      <div className='row justify-content-md-center '> 
        <h2 className='col-md-6 text-center'> Product Data </h2>
        </div>
    </div>
  );
}
