import { Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).send("Internal server error");
};
