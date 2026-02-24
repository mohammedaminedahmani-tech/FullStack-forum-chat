import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"; 
import { getGlobalMessages, sendGlobalMessage } from "../controllers/globalMessage.controller.js";

const router = express.Router();

router.get("/", protectRoute, getGlobalMessages);

router.post("/send", protectRoute, sendGlobalMessage);

export default router;
