import express from "express"; 
import { Router } from "express";
import Joi from "joi";
import {registerHandler, loginHandler} from "../handlers/authHandlers";
import {createValidator} from "express-joi-validation";

import { Request, Response } from "express";

const authRoutes: Router = express.Router()

const validator = createValidator()

const passwordSchema = Joi.string().min(6).max(30).required();
const requireStringSchema = Joi.string().required();

const loginSchema = Joi.object({
  email: requireStringSchema,
  password: passwordSchema,
});

const resetSchema = Joi.object({
  email: requireStringSchema,
});

const refreshSchema = Joi.object({
  email: requireStringSchema,
  password: passwordSchema,
});

const verifyResetTokenSchema = Joi.object({
  token: requireStringSchema,
});

const resetPasswordSchema = Joi.object({
  token: requireStringSchema,
  password: passwordSchema,
});

const registerSchema = Joi.object({
  email: requireStringSchema,
  password: passwordSchema,
  firstName: Joi.string().min(2).max(20).required(),
  secondName: Joi.string().min(2).max(20).required(),
})

authRoutes.post(
  "/register",
  validator.body(registerSchema),
  registerHandler
);

authRoutes.post(
  "/login",
  validator.body(loginSchema),
  loginHandler
);

// authRoutes.post(
//   "/reset",
//   validator.body(resetSchema),
//   authHandlers.resetHandler
// );

// authRoutes.post(
//   "/verifyresettoken",
//   validator.body(verifyResetTokenSchema),
//   authHandlers.verifyResetTokenHandler
// );

// authRoutes.post(
//   "/resetpassword",
//   validator.body(resetPasswordSchema),
//   authHandlers.resetPasswordHandler
// );

// authRoutes.get(
//   "/refresh",
//   authHandlers.refreshHandler
// );

// authRoutes.post(
//   "/logout",
//   validator.body(refreshSchema),
//   authHandlers.logoutHandler
// );

// authRoutes.get(
//   "/users",
//   authMiddleware,
//   authHandlers.usersHandler
// );

export default authRoutes;