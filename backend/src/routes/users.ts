import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import * as usersController from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter.get("/", isAuthenticated, usersController.listUsers);
