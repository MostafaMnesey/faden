import rateLimit from "express-rate-limit";

// Generic rate limiter for auth routes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: "Too many requests, please try again later.",
      status: options.statusCode
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});

// More strict limiter for OTP requests
export const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 OTP requests per hour
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: "Too many OTP requests, please try again in an hour.",
      status: options.statusCode
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});
