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
        const key = `rateLimit:${req.query.userId || req.ip}`;
        let current = await redis.incr(key);
        // Set headers in any case
        if (options.headers) {
            res.setHeader('X-RateLimit-Limit', String(options.max));
            res.setHeader('X-RateLimit-Remaining', String(Math.max(0, options.max - current)));
        }
        // If the current count is greater than max, then the rate limit is exceeded.
        if (current > options.max) {
            // Correct the count since this request is not being allowed
            // Send the rate limit exceeded response
            return res.status(options.statusCode).send(options.message);
        } else {
            // Otherwise, set the expiration of the key if this is the first request
            if (current === 1) {
                await redis.expire(key, options.windowMs / 1000);
            }
            // Decrement the counter once the response is finished
            // Call the next middleware in the stack
            next();
        }
    };
}

module.exports = rateLimit;