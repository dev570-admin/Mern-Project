// SignUp or register new user
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//import * as Yup from 'yup';
import { useFormik } from 'formik'; // this library/packege used for used for  front-end form validation

import { signUpSchema } from './schemas';
import { ToastContainer,toast } from 'react-toastify';// used for error /suss msg on poup
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
 const [successMessage , setSuccessMessage ]=useState("");
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
   onSubmit: async (values, { resetForm }) => {
  try {
    const url = "http://localhost:5000/api/auth/signup";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)  // ✅ SEND only values here
    });

    const data = await response.json();
    console.log(data);
if (response.ok) {
  toast.success("✅ Registration Successful!");
  console.log("Form submitted ✅", values);
  setSuccessMessage("Registration Successful!");

  setTimeout(() => {
   navigate('/');
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
  }
},
  });

  return (
    <div className="container mt-5">  
    <h2 style={{ textAlign: "center" }}>Register</h2>
    <form onSubmit={formik.handleSubmit} className="w-50 mx-auto mt-5">
      {/* registration success msg */}
      {successMessage &&(<div className='alert alert-success'>{successMessage}</div>)}
      {/* Name Field */}
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          autoFocus
          className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="alert alert-danger">{formik.errors.name}</div>
        )}
      </div>

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

      {/* Confirm Password Field */}
      <div className="mb-3">
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="alert alert-danger">{formik.errors.confirmPassword}</div>
        )}
      </div>

      <button type="submit" className="btn btn-success">Register</button>
        <Link to="/"  className="btn btn-primary" style={{ color: "#ffffff", marginLeft:"10px" }}> Login</Link>
    </form>
      
    </div>
  );
}
