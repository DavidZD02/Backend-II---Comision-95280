import { Router } from "express";
import { getEvents } from "../controllers/events.controller.js";

export default function createEventsRouter(eventsService) {
  const router = Router();

  router.get("/", getEvents(eventsService));

  return router;
}
