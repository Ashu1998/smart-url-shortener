import Redis, { Redis as RedisType } from 'ioredis';

export default class RedisClient {
  private static instance: RedisType | null = null;
  private static instancePromise: Promise<RedisType> | null = null;

  private constructor() {
    console.log("Initialized once");
  }

  public static getInstance() : Promise<RedisType> {
    try {
      if(RedisClient.instance) {
        return Promise.resolve(RedisClient.instance);
      }

      if(!RedisClient.instancePromise) {
        const client = new Redis({
          host : process.env.REDIS_HOST || "localhost",
          port : Number(process.env.REDIS_PORT) || 6379,
        });

        RedisClient.instancePromise = new Promise((resolve, reject) => {
          client.on("connect", () => {
            RedisClient.instance = client;
            resolve(client);
          })

          client.on("error", (error: Error) => {
            console.error("Redis connection error:", error);
            reject(error);
          })
        })
      }

      return RedisClient.instancePromise;
    } catch(error) {
      console.error("Error initializing Redis:", error);
      throw error;
    }
  }
}