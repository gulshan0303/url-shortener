import { prisma } from "../config/prisma";
import { encodeBase62 } from "../utils/base62";

export const createShortUrlService = async (
  originalUrl: string,
  customCode?: string,
  expiresIn?: number,
) => {
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

  if (customCode) {
    const existing = await prisma.url.findUnique({
      where: { shortCode: customCode },
    });

    if (existing) {
      throw new Error("CUSTOM_CODE_TAKEN");
    }

    const newUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortCode: customCode,
        expiresAt,
      },
    });

    return `http://localhost:3000/api/${newUrl.shortCode}`;
  }

  const newUrl = await prisma.url.create({
    data: {
      originalUrl,
      shortCode: "temp_" + Date.now(),
      expiresAt,
    },
  });

  const shortCode = encodeBase62(newUrl.id);

  const updated = await prisma.url.update({
    where: { id: newUrl.id },
    data: { shortCode },
  });

  return `http://localhost:3000/api/${updated.shortCode}`;
};
