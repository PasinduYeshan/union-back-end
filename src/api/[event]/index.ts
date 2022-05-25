import { Router } from "express";
import auth from "../../utils/auth";

import addEvent from "./add_event";
import updateEvent from "./update_event";
import { getEvents, getSingleEvent } from "./get_event";

const rEvent = Router();

// Add event
rEvent.post("/add", auth.officer, addEvent);

// Update event
rEvent.put("/update/:eventId", auth.officer, updateEvent);

// Get event
rEvent.get("/get", getEvents);
rEvent.get("/get/:eventId", getSingleEvent);

export default rEvent;
