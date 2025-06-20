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

}