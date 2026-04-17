import express from "express";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
dotenv.config();

const app = express();
app.use(express.json());

//api routes path
import urlRoutes from "./routes/url.routes";

//middlewares
app.use("/api", urlRoutes);

app.get("/", (req, res) => {
  res.send("URL Shortener API running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
