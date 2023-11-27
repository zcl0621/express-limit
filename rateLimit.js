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
        const limit = options.max
        const interval = options.windowMs / 1000

        const luaScript = `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local interval = tonumber(ARGV[2])
    local current = redis.call('INCR', key)

    if current > limit then
        return 1
    else
        if current == 1 then
            redis.call('EXPIRE', key, interval)
        end
        return 0
    end
  `
        const result = await redis.eval(luaScript, 1, key, limit, interval)

        if (result === 1) {
            return res.status(options.statusCode).send(options.message);
        }
        next();
    };
}

module.exports = rateLimit;