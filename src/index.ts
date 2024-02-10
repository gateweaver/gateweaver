import "dotenv/config";
import express from "express";
import { parseConfig } from "./utils/config/parse-config";

const app = express();

const PORT = process.env.PORT || 6060;

app.get("/", (req, res) => {
  const config = parseConfig("config.yml");

  res.send(config);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
