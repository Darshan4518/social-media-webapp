import jwt from "jsonwebtoken";
export const isAuthonticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "user not authonticated" });
    }
    const decode = jwt.verify(token, "jfdkusdhlfiuserytghfiurehg");
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.id = decode.userId;

    next();
  } catch (error) {
    console.log(error);
  }
};
