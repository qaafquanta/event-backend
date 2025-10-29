import dotenv from 'dotenv';
dotenv.config();

// middleware untuk verifikasi JWT
import jwt from "jsonwebtoken";
import type{ Request, Response, NextFunction } from "express";

const secretKey = process.env.SECRET_KEY_TKN || "secretttt";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, secretKey);
    (req as any).user = decoded; // simpan user info ke request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token",tokenYangDiCek:token });
  }
};
