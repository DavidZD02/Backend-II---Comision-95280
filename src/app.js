import express from "express";

import healthRouter from "./routes/health.router.js";
import createEventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import EventsDAO from "./dao/events.dao.js";
import EventsRepository from "./repositories/events.repository.js";
import EventsService from "./services/events.service.js";

import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const eventsDAO = new EventsDAO();
const eventsRepository = new EventsRepository(eventsDAO);
const eventsService = new EventsService(eventsRepository);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRouter);
app.use("/api/events", createEventsRouter(eventsService));
app.use("/api/sessions", sessionsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
