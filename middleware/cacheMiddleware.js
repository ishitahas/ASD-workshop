const cache = {};

const CACHE_TIME = 60 * 1000;

function cacheMiddleware(req, res, next) {
    const key = req.originalUrl;
    const cached = cache[key];

    if (cached) {
        const age = Date.now() - cached.createdAt;

        if (age < CACHE_TIME) {
            res.setHeader("X-Cache", "HIT");
            return res.json(cached.data);
        }

        delete cache[key];
    }

    res.setHeader("X-Cache", "MISS");

    const originalJson = res.json.bind(res);

    res.json = (data) => {
        cache[key] = {
            data: data,
            createdAt: Date.now()
        };

        return originalJson(data);
    };

    next();
}

function invalidateCache() {
    Object.keys(cache).forEach((key) => {
        delete cache[key];
    });
}

module.exports = {
    cacheMiddleware,
    invalidateCache
};