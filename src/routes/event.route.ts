import express from "express";
import {
  getAllEvents,
  filterAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/events", getAllEvents);
router.get("/filter", filterAllEvents);
router.get("/:id", getEventById);
router.post("/create", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
