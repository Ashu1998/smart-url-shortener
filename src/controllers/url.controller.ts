import { Request, Response } from "express";
import Helper from "../utils/helper";
import crypto from "crypto";
import RedisClient from "../utils/redis";
import {nanoid} from "nanoid";

export class UrlController {
  static async createShortUrl(req: Request, res: Response) : Promise<void> {
    if(!req.body) {
      res.status(400).json({
        error: "No request body"
      });
      return;
    }
    
    const { originalUrl } = req.body;
    const redis = await RedisClient.getInstance();

    if(!originalUrl || !Helper.validateUrl(originalUrl)) {
      res.status(400).json({
        error: "Invalid URL provided"
      });
      return;
    }

    const normalizedUrl = Helper.normalizeUrl(originalUrl);
    const hash = crypto.createHash("sha256").update(normalizedUrl).digest("hex");

    const existingShortId = await redis.get(`hash:${hash}`);

    if(existingShortId) {
      res.status(200).json({
        "shortUrl" : `${process.env.BASE_URL}/${existingShortId}`
      });
      return;
    }

    const shortId = nanoid(7);
    await redis.set(shortId, normalizedUrl);
    await redis.set(`hash:${hash}`, shortId);

    res.status(200).json({
      "shortUrl" : `${process.env.BASE_URL}/${shortId}`
    });
  }

  static async redirectToOriginalUrl(req: Request, res: Response) : Promise<void> {
    const redis = await RedisClient.getInstance();
    const { shortId } = req.params;
    if(!shortId) {
      res.status(400).json({
        error: "Short ID is required"
      });
      return;
    }

    const originalUrl = await redis.get(shortId);
    if(!originalUrl) {
      res.status(404).json({
        error: "URL not found"
      });
      return;
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || "";

    await redis.incr(`clicks:${shortId}`);
    await redis.rpush(`analytics:${shortId}`, JSON.stringify({ ip, userAgent, referrer, ts: Date.now() }));

    return res.redirect(originalUrl);    
  }

  static async getAnalytics(req: Request, res: Response) : Promise<void> {
    const redis = await RedisClient.getInstance();
    const { shortId } = req.params;
    if(!shortId) {
      res.status(400).json({
        error: "Short ID is required"
      });
      return;
    }

    const clicks = await redis.get(`clicks:${shortId}`);
    const logs = await redis.lrange(`analytics:${shortId}`, 0, -1);

    res.status(200).json({
      "shortUrl" : `${process.env.BASE_URL}/${shortId}`,
      "totalClicks" : clicks,
      "visits" : logs
    });    
  }

}