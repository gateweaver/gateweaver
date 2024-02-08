import express from "express";

const app = express();

const PORT = process.env.PORT || 6060;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
