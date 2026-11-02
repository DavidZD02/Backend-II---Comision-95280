import { env } from "../config/env.config.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: "error",
    message:
      env.NODE_ENV === "production" ? "Error interno del servidor" : err.message,
  });
};
