import { Request, Response, NextFunction } from "express";

export function example(req: Request, res: Response, next: NextFunction) {
  if (req.headers["x-example"] === "example") {
    return next();
  }

  return res.status(403).send("Forbidden");
}
