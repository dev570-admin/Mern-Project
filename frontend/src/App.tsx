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
<<<<<<< HEAD
import AddProducts from './pages/AddProducts';
=======
>>>>>>> 59685a40d071d0ca8a7d5ffd171ba8f9c5d06362

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
<<<<<<< HEAD
          <Route path="/addproducts"  element={<ProtectedRoute> <AddProducts /></ProtectedRoute> }/>

      </Routes>
    </Router>
=======

      </Routes>
    </Router>
    
  
>>>>>>> 59685a40d071d0ca8a7d5ffd171ba8f9c5d06362
  )
}

export default App
