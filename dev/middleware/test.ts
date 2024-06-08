import { Request, Response, NextFunction } from "express";

export const test = async (req: Request, res: Response, next: NextFunction) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  const data = await response.json();

  if (data.userId === 1) {
    return next();
  }

  return res.status(403).send("Forbidden");
};
