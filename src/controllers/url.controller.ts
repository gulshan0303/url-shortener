import { Request, Response } from "express";
import { createShortUrlService } from "../services/url.service";
import { prisma } from "../config/prisma";
import { redisClient } from "../config/redis";

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { url, customCode, expiresIn } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const shortUrl = await createShortUrlService(url, customCode, expiresIn);

    return res.status(201).json({ shortUrl });
  } catch (error: any) {
    if (error.message === "CUSTOM_CODE_TAKEN") {
      return res.status(400).json({
        message: "Custom short URL already taken",
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const redirectToOriginalUrl = async (
  req: Request<{ shortCode: string }>,
  res: Response,
) => {
  try {
    const { shortCode } = req.params;

    // Redis check
    const cachedData = await redisClient.get(shortCode);

    if (cachedData) {
      const parsed = JSON.parse(cachedData);

      // 🔥 Expiry check (VERY IMPORTANT)
      if (parsed.expiresAt && new Date() > new Date(parsed.expiresAt)) {
        return res.status(410).json({
          message: "This link has expired",
        });
      }

      return res.redirect(parsed.originalUrl);
    }

    console.log("Cache MISS");

    // 🔥 DB fallback
    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // 🔥 Expiry check
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({
        message: "This link has expired",
      });
    }

    // 🔥 Cache FULL object (not just URL)
    await redisClient.set(
      shortCode,
      JSON.stringify({
        originalUrl: url.originalUrl,
        expiresAt: url.expiresAt,
      }),
      {
        EX: 60 * 60,
      },
    );

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
