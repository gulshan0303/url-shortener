import express from "express";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL Shortener API running 🚀");
});

const PORT = process.env.PORT || 3000;

async function testDB() {
  await prisma.url.create({
    data: {
      shortCode: "test123",
      originalUrl: "https://google.com",
    },
  });

  console.log("DB working ✅");
}

testDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
