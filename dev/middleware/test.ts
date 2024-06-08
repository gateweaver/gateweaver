import { Request, Response, NextFunction } from "express";

export function test(req: Request, res: Response, next: NextFunction) {
  if (req.headers["x-test"] === "test") {
    return next();
  }

  return res.status(403).send("Forbidden");
}
