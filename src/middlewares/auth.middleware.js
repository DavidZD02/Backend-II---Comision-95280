import AppError from "../utils/appError.js";
import { verifyToken } from "../utils/jwt.js";

export const auth = (req, res, next) => {
  const token = req.cookies.currentUser;
  AppError.assert(token, "No autenticado", 401);
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
  } catch (error) {
    throw new AppError("No autenticado", 401);
  }
  next();
};
