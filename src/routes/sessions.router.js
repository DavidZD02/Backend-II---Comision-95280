import { Router } from "express";
import { register, login, current, logout } from "../controllers/sessions.controller.js";

export default function createSessionsRouter(sessionsService) {
  const router = Router();
  router.post("/register", register(sessionsService));
  router.post("/login", login);
  router.get("/current", current);
  router.post("/logout", logout);

  return router;
}
