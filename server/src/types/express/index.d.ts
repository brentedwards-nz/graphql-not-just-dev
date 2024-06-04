import express from "express";

declare global {
  namespace Express {
    interface Request {
      isAuth?: boolean
      user?: Record<string,any>
    }
  }
}