import * as Yup from "yup";

export const signUpSchema =  Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(25, 'Name must be at most 25 characters')
        .required('Name is required'),

      email: Yup.string()
        .trim()
        .required('Email is required')
        .email('Invalid email')
        .matches(
      /^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,}$/,
      '❌ Invalid email format (e.g., abc@xyz.com)'
    ),

      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Must contain at least one number')
        .matches(/[@$!%*#?&]/, 'Must contain at least one special character'),

      confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'), // ✅ Match check
    });



export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('❌ Invalid email format')
    .required('⚠️ Email is required')
    .matches(
      /^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,}$/,
      '❌ Invalid email format (e.g., abc@xyz.com)'
    ),

  password: Yup.string()
    .min(6, '⚠️ Password must be at least 6 characters')
    .required('⚠️ Password is required')
    .matches(/[A-Z]/, '❌ Must contain at least one uppercase letter')
    .matches(/[a-z]/, '❌ Must contain at least one lowercase letter')
    .matches(/[0-9]/, '❌ Must contain at least one number')
    .matches(/[@$!%*#?&]/, '❌ Must contain at least one special character'),
});