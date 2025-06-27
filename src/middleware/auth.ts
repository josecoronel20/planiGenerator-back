// Middleware de autenticación
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    console.log("Token verificado");
    next();
  } catch (error) {
    console.log("Token inválido", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
