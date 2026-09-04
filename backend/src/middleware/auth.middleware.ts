import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getConfig } from "../config/env";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const isAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const config = getConfig();
    const decoded = jwt.verify(
      token,
      config.JWT_SECRET
    ) as JwtPayload;

    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
