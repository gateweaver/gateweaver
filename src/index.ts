import "dotenv/config";
import express from "express";
import { router } from "./router";

const app = express();

const PORT = process.env.PORT || 6060;

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
