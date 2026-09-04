import { Router } from "express";
import {
  createUser,
  login,
  getCurrentUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller";
import { isAuth } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", login);
authRouter.post("/forget-password", forgotPassword);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/new-password", resetPassword);
authRouter.get("/me", isAuth, getCurrentUser);

export default authRouter;
