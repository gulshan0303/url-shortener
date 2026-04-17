import { prisma } from "../config/prisma";

// simple generator (abhi ke liye)
function generateShortCode(length = 6): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export const createShortUrlService = async (originalUrl: string) => {
  let shortCode = generateShortCode();

  // ensure uniqueness
  let existing = await prisma.url.findUnique({
    where: { shortCode },
  });

  while (existing) {
    shortCode = generateShortCode();
    existing = await prisma.url.findUnique({
      where: { shortCode },
    });
  }

  await prisma.url.create({
    data: {
      shortCode,
      originalUrl,
    },
  });

  return `http://localhost:3000/api/${shortCode}`;
};
