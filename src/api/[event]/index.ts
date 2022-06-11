import { Router } from "express";
import auth from "../../utils/auth";

import addEvent from "./add_event";
import updateEvent from "./update_event";
import deleteEvent from "./delete_event";
import { getEvents, getSingleEvent } from "./get_event";

const rEvent = Router();

// Add event
rEvent.post("/add", auth.officer, addEvent);

// Update event
rEvent.put("/update/:eventId", auth.officer, updateEvent);

// Get event
rEvent.get("/get", getEvents);
rEvent.get("/get/:eventId", getSingleEvent);

// Delete event
rEvent.delete("/delete/:eventId", auth.officer, deleteEvent);

export default rEvent;
