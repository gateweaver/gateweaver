import { Request, Response } from "express";

export const testHandler = (_: Request, res: Response) => {
  res.send("This is a custom handler response");
};
