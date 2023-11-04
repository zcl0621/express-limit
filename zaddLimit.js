const express = require('express');
const Redis = require('ioredis');
const redis = new Redis({host: 'redis.orb.local'}); // Configure this with your Redis connection details
const RateLimitOptions = {
    windowMs: 0,
    max: 0,
    statusCode: 0,
    message: "xxx",
    headers: true,
}
function rateLimit(options) {
    return async (req, res, next) => {
        console.log("bbbb")
        const key = `rateLimit:${req.query.userId}`;  // Use client IP as key
        const currentTime = Date.now();
        const windowStart = currentTime - options.windowMs;
        // Remove timestamps outside of the sliding window
        await redis.zremrangebyscore(key, '-inf', windowStart);
        // Get the number of requests in the current window
        const requestCount = await redis.zcard(key);
        // Set headers in any case
        if (options.headers) {
            res.setHeader('X-RateLimit-Limit', String(options.max));
            res.setHeader('X-RateLimit-Remaining', String(Math.max(0, options.max - requestCount)));
        }
        if (requestCount >= options.max) {
            // Send the rate limit exceeded response
            return res.status(options.statusCode).send(options.message);
        } else {
            // Add the current request timestamp to the sorted set
            await redis.zadd(key, currentTime, currentTime);
            // Set the expiration of the key if this is the first request
            if (requestCount === 0) {
                await redis.expire(key, options.windowMs / 1000);
            }
            next();
        }
    };
}
module.exports = rateLimit;