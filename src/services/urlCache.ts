import RedisClient from "../utils/redis";
export async function isUrlMaliciousCached(url: string): Promise<boolean | null> {
  const redis = await RedisClient.getInstance();
  const cached = await redis.get(`url-scan:${url}`);
  if (cached !== null) return cached === "true";
  return null;
}

export async function cacheUrlScanResult(url: string, isMalicious: boolean) {
  const redis = await RedisClient.getInstance();
  await redis.set(`url-scan:${url}`, isMalicious ? "true" : "false", "EX", 86400); // cache for 1 day
}

