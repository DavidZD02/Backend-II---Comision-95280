import { env } from "../config/env.config.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 3600000, // 1 hora
  secure: env.NODE_ENV === "production",
};

export const register = (sessionsService) => async (req, res) => {
  const user = await sessionsService.register(req.body);
  res.status(201).json({ status: "success", payload: user });
};

export const login = (sessionsService) => async (req, res) => {
  const { token } = await sessionsService.login(req.body);
  res.cookie("currentUser", token, cookieOptions);
  res.status(200).json({ status: "success", message: "Login correcto" });
};

export const current = (req, res) => {
  const { id, email, role } = req.user;
  res.status(200).json({ status: "success", payload: { id, email, role } });
};

export const logout = (req, res) => {
  res.clearCookie("currentUser", cookieOptions);
  res.status(200).json({ status: "success", message: "Sesión cerrada" });
}
