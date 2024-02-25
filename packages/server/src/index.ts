import "dotenv/config";
import express from "express";
import { router } from "./router";
import { errorHandler } from "./middleware/error-handler";

const app = express();

const PORT = process.env.PORT || 6060;

app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
