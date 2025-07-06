import Redis from "ioredis";
const redisclient = new Redis(process.env.REDIS_STRING);

redisclient.on("connect", () => {
  console.log("Connected to Redis");
});
redisclient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

export default redisclient;