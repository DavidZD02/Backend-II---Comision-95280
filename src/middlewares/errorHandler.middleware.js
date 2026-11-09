import { env } from "../config/env.config.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isServerError = status >= 500;

  if (isServerError) console.error(err);

  res.status(status).json({
    status: "error",
    message:
      isServerError && env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
  });
};
