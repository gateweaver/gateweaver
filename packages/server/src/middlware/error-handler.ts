import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error(err);

  if (err.name === "UnauthorizedError") {
    res.status(401).send({
      error: "Unauthorized",
    });
  } else {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};
