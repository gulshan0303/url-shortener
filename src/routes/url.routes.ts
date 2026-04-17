import { Router } from "express";
import {
  createShortUrl,
  redirectToOriginalUrl,
} from "../controllers/url.controller";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/shorten", createShortUrl);
router.get("/:shortCode", rateLimiter, redirectToOriginalUrl);
export default router;
