import express from "express";
import cors from "cors";
import morgan from "morgan";
import { configureRoutes } from "../routes/index.js";

const app = express();
const frontendUrls = (
  process.env.FRONTEND_URLS ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const corsOptions = {
  origin: frontendUrls,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors(corsOptions));

app.use(morgan("dev"));

configureRoutes(app);

export default app;
