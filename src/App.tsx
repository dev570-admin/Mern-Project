import { useState, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';  
import SignUp from './SignUp';
import Home from "./pages/Home"; // ✅ Import Home/Dashboard
import ProtectedRoute from './components/ProtectedRoutes';
import PublicRoute from './components/PublicRoute';

import { ToastContainer } from 'react-toastify';

<ToastContainer position="top-center" />

function App() {


  return (
 
       <Router>
      <Routes>

        {/* ✅ Public Routes */}
        <Route  path="/" element={ <PublicRoute> <Login /> </PublicRoute>  } />
        <Route  path="/register" element={ <PublicRoute> <SignUp /></PublicRoute> }/>

            {/* 🔒 Protected Routes  only logged in users */}
          <Route path="/home"  element={<ProtectedRoute> <Home /></ProtectedRoute> }/>

      </Routes>
    </Router>
    
  
  )
}

export default App
