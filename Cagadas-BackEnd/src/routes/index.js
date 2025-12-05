import userRoutes from "./user.route.js";
import poopRoutes from "./poop.route.js";


export const configureRoutes = (app) => {
  // Test route
  app.use("/api/user", userRoutes);
  app.use("/api/poop", poopRoutes);
  app.get("/", (req, res) => {
    res.json({ message: "Poop API working correctly" });
  });
};
