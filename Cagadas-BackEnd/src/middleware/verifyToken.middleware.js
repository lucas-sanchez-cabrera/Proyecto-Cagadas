import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Skip token verification for public routes
  const publicRoutes = ["/", "/api/auth/login", "/api/auth/register"];

  if (publicRoutes.includes(req.path)) {
    return next();
  }

  try {
    // Check for token in cookies
    const token = req.cookies.stockiseAuth;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
