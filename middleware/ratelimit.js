const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  handler: (req, res, next) => {
    res.status(429).json({ error: "Too Many Requests" });
  },
});

module.exports = limiter;
