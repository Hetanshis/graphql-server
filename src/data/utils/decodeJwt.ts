import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
const decodeJwt = async (req: any, res: Response, next: NextFunction) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      throw new Error("Token is not found");
    }

    token = token.split(" ")[1];

    if (!token) {
      throw new Error("Token is not found");
    }

    const decode = jwt.verify(token, `${process.env.JWT_CODE}`);

    req.user = decode;
    next();
  } catch (err) {
    return res.json(err);
  }
};
export default decodeJwt;
