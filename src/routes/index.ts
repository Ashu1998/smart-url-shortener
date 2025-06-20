import { Router } from "express";
import { UrlController } from "../controllers/url.controller";
import { rateLimiter } from "../middleware/rateLimiter";
const router = Router();

router.post("/shorten", rateLimiter, UrlController.createShortUrl);
router.get("/:shortId", UrlController.redirectToOriginalUrl);
router.get("/analytics/:shortId", UrlController.getAnalytics);

export default router;