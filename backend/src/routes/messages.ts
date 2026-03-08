import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import * as messagesController from "../controllers/messages.controller";

export const messagesRouter = Router();

messagesRouter.get("/:userId", isAuthenticated, messagesController.getMessages);
messagesRouter.post("/:userId", isAuthenticated, messagesController.sendMessage);
