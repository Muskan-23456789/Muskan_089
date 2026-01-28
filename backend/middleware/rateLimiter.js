// Simple in-memory rate limiter
const rateLimit = (options = {}) => {
    const {
        windowMs = 60 * 1000, // 1 minute default
        max = 100, // 100 requests per window default
        message = 'Too many requests, please try again later.',
        statusCode = 429,
        keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown'
    } = options;

    const requests = new Map();

    // Cleanup old entries every minute
    setInterval(() => {
        const now = Date.now();
        for (const [key, data] of requests.entries()) {
            if (now - data.startTime > windowMs) {
                requests.delete(key);
            }
        }
    }, windowMs);

    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();

        if (!requests.has(key)) {
            requests.set(key, {
                count: 1,
                startTime: now
            });
            return next();
        }

        const data = requests.get(key);

        // Reset if window has passed
        if (now - data.startTime > windowMs) {
            requests.set(key, {
                count: 1,
                startTime: now
            });
            return next();
        }

        // Check if limit exceeded
        if (data.count >= max) {
            const retryAfter = Math.ceil((data.startTime + windowMs - now) / 1000);
            res.set('Retry-After', retryAfter);
            res.set('X-RateLimit-Limit', max);
            res.set('X-RateLimit-Remaining', 0);
            res.set('X-RateLimit-Reset', new Date(data.startTime + windowMs).toISOString());

            return res.status(statusCode).json({
                success: false,
                message: message,
                retryAfter: retryAfter
            });
        }

        // Increment count
        data.count++;
        res.set('X-RateLimit-Limit', max);
        res.set('X-RateLimit-Remaining', max - data.count);
        res.set('X-RateLimit-Reset', new Date(data.startTime + windowMs).toISOString());

        next();
    };
};

// Preset configurations
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many API requests, please try again after 15 minutes.'
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: 'Too many authentication attempts, please try again after an hour.'
});

const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: 'Rate limit exceeded. Please slow down.'
});

module.exports = {
    rateLimit,
    apiLimiter,
    authLimiter,
    strictLimiter
};
