import express from "express"
import UserController from '../controllers/userController.js';

export const router = express.Router();

const userController = new UserController();
router.get("/:id",userController.byId.bind(userController));
router.get("/",userController.index.bind(userController))
router.post("/",userController.create.bind(userController));

