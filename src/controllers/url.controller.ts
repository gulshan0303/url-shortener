import { Request, Response } from "express";
import { createShortUrlService } from "../services/url.service";
import { prisma } from "../config/prisma";
import { redisClient } from "../config/redis";

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const shortUrl = await createShortUrlService(url);

    return res.status(201).json({ shortUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const redirectToOriginalUrl = async (
  req: Request<{ shortCode: string }>,
  res: Response,
) => {
  try {
    const { shortCode } = req.params;

    // 1. Redis check
    const cachedUrl = await redisClient.get(shortCode);

    if (cachedUrl) {
      console.log("Cache HIT");

      // Increment click count
      await prisma.url.update({
        where: { shortCode },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });

      return res.redirect(cachedUrl);
    }

    console.log("Cache MISS");

    // 2. DB fallback
    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Increment click count
    await prisma.url.update({
      where: { shortCode },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    // 3. Cache set
    await redisClient.set(shortCode, url.originalUrl, {
      EX: 60 * 60,
    });

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
