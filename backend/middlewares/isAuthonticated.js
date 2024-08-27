import jwt from "jsonwebtoken";
export const isAuthonticated = async (req, res, next) => {
  try {
    // for react-native
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // websites

    const token = req.cookies?.token || authHeader.split(" ")[1];

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
    console.log(error);
  }
};
