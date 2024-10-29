// src/lib/redis.ts
import Redis from 'ioredis';

// Create a Redis client instance
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379'); // Change this for cloud-based Redis

export default redis;
