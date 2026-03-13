import { Router } from "express";
import {
  createPoop,
  getAllPoops,
  getMyPoops,
  getMonthAllPoops,
  getWeekAllPoops,
  getYearAllPoops,
  getClassificationPoints,
} from "../controllers/poop.controller.js";

const router = Router();

router.post("/", createPoop);
router.get("/", getAllPoops);
router.get("/month", getMonthAllPoops);
router.get("/week", getWeekAllPoops);
router.get("/year", getYearAllPoops);
router.get("/classification", getClassificationPoints);
router.get("/:userId", getMyPoops);

export default router;
