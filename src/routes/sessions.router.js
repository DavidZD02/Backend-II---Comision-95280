import { Router } from "express";
import { register, login, current, logout } from "../controllers/sessions.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export default function createSessionsRouter(sessionsService) {
  const router = Router();
  router.post("/register", register(sessionsService));
  router.post("/login", login(sessionsService));
  router.get("/current", auth, current);
  router.post("/logout", logout);

  return router;
}
