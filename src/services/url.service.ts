import { prisma } from "../config/prisma";
import { encodeBase62 } from "../utils/base62";

export const createShortUrlService = async (originalUrl: string) => {
  // 1. Create with temporary unique value
  const newUrl = await prisma.url.create({
    data: {
      originalUrl,
      shortCode: "temp_" + Date.now(), // temporary unique
    },
  });

  // 2. Generate Base62
  const shortCode = encodeBase62(Number(newUrl.id));

  // 3. Update safely
  const updated = await prisma.url.update({
    where: { id: newUrl.id },
    data: { shortCode },
  });

  return `http://localhost:3000/api/${updated.shortCode}`;
};
