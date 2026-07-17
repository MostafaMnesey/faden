import axios from "axios";
import { redis, redisConnection } from "./Radis/Connection.js";

/**
 * Get Geo-location data for a given IP with caching
 * @param {string} ip 
 * @returns {Promise<object>}
 */
export const getGeoLocation = async (ip) => {
  const cacheKey = `geo_${ip}`;
  
  // Ensure Redis is connected
  await redisConnection();

  // 1. Try to get from cache
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // 2. Fetch from external API
  try {
    const { data } = await axios.get(`https://api.ipgeolocation.io/ipgeo`, {
      params: {
        apiKey: process.env.IPGEO_API_KEY,
        ip,
      },
      timeout: 3000, // 3 seconds timeout
    });

    // 3. Cache the result for 24 hours
    await redis.set(cacheKey, JSON.stringify(data), { EX: 60 * 60 * 24 });

    return data;
  } catch (error) {
    console.error(`GeoLocation Error for IP ${ip}:`, error.message);
    // Fallback or return empty object
    return { ip, error: "Failed to fetch geolocation" };
  }
};
