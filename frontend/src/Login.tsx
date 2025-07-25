import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//import * as Yup from 'yup';
import { useFormik } from 'formik'; // this library/packege used for used for  front-end form validation

import { signUpSchema } from './schemas';
import {loginSchema} from './schemas'

import { ToastContainer,toast } from 'react-toastify';// used for error /suss msg on poup
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
 const [successMessage , setSuccessMessage ]=useState("");
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
   onSubmit: async (values, { resetForm }) => {
  try {
    const url = "http://localhost:5000/api/auth/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
<<<<<<< HEAD
      credentials: "include", 
      body: JSON.stringify(values)
=======
       credentials: "include", 
      body: JSON.stringify(values)  // ✅ SEND only values here
      
>>>>>>> 59685a40d071d0ca8a7d5ffd171ba8f9c5d06362
    });

    const data = await response.json();
    console.log(data);
<<<<<<< HEAD
    if (response.ok) {
      // Store user info in localStorage
      localStorage.setItem('name', data.name);
      localStorage.setItem('email', data.email);
      toast.success("✅ Login Successful!");
      setSuccessMessage("Login Successful!");
      setTimeout(() => {
        setSuccessMessage("");
        resetForm();
        navigate('/home');
      }, 2000);
    } else {
      toast.error(data.message || "❌ Login failed");
    }
  } catch (error) {
    console.error("❌ Login API Error:", error);
    toast.error("❌ Login failed due to network error");
=======
if (response.ok) {

  // Store user info in localStorage
  localStorage.setItem('name', data.name);
  localStorage.setItem('email', data.email);
  // localStorage.setItem('token', data.token);
  toast.success("✅ Login Successful!");
  console.log("Form submitted ✅", values);
  setSuccessMessage("Login Successful!");

  setTimeout(() => {
   navigate('/home');
    setSuccessMessage("");
  }, 3000);

  resetForm();
 console.log("Response from API:", values.message);
} else {
      toast.error(data.message || "❌ Signup failed");
      console.log(error);
    }
  } catch (error) {
    console.error("❌ Signup API Error:", error);
    toast.error("❌ Signup failed due to network error");
>>>>>>> 59685a40d071d0ca8a7d5ffd171ba8f9c5d06362
  }
},
  });

  return (
    <div className="container mt-5">  
    <h2 style={{ textAlign: "center" }}>Login</h2>
    <form onSubmit={formik.handleSubmit} className="w-50 mx-auto mt-5">
      {/* registration success msg */}
      {successMessage &&(<div className='alert alert-success'>{successMessage}</div>)}
    
      {/* Email Field */}
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="alert alert-danger">{formik.errors.email}</div>
        )}
      </div>
      {/* Password Field */}
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
         type={showPassword ? "text" : "password"}
          name="password"
          className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

           <button
      type="button"
      className="btn btn-light  mt-2 mb-2"
      onClick={() => setShowPassword((prev) => !prev)} 
    >
           <i className ={` ${showPassword ? "bi-eye-slash" : "bi-eye"} `} style={{
           
           paddingTop: '10px',
          paddingBottom: '15px',
          paddingLeft: '20px',
           paddingRight: '20px',
            marginTop: '20px',
           marginBottom: '10px',
          marginLeft: '15px',
          marginRight: '15px',
        borderRadius: '8px',
        height: '60px',
          width: '100px',
         
            
            }} ></i> 
         {/* <i className={ `bi ${showPassword ? "bi-eye-slash" : "bi-eye"} `}></i> */}
    </button> 
 
        {formik.touched.password && formik.errors.password && (
          <div className="alert alert-danger">{formik.errors.password}</div>
        )}
      </div>
      <button type="submit" className="btn btn-success">Login</button>

       <p>Yet not have an account? <Link to="/register" >SignUP/Register</Link></p>
    </form>
      
    </div>
  );
}
