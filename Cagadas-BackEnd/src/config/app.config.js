import express from "express";
import cors from "cors";
import morgan from "morgan";
import { configureRoutes } from "../routes/index.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://192.168.1.97:5173"], // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors(corsOptions));

app.use(morgan("dev"));

configureRoutes(app);

export default app;
