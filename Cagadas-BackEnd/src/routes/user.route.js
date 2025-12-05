import { Router } from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  login,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/login", login);
router.put("/:id", updateUser);

export default router;
