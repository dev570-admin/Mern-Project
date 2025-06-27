//AuthValidion.js

import joi from 'joi';// used for  backend-form validation

export const SignUpValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
  });
const data={
  "name":req.body.name,
  "email":req.body.email,
  "password":req.body.password
}
  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).json({
      message: "❌ Validation Error",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};

export const LoginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "❌ Validation Error",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};

export default { SignUpValidation, LoginValidation };