import jwt from "jsonwebtoken";

export const isAuthonticated = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "user not authonticated" });
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.id = decode.userId;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
