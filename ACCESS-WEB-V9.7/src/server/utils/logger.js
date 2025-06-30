// Enhanced logging utility
export const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    // Production logging: `[${timestamp}] [INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    // console.error(`[${timestamp}] [ERROR] ${message}`);
    if (error) {
      // console.error(`[${timestamp}] [ERROR] Stack:`, error.stack || error);
      // console.error(`[${timestamp}] [ERROR] Details:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    // console.warn(`[${timestamp}] [WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      // Production logging: `[${timestamp}] [DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
};

// Request logging middleware factory
export const logRequest = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode
    });
    
    if (res.statusCode >= 400) {
      logger.error(`Request failed: ${req.method} ${req.url}`, {
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    }
    
    return originalEnd.apply(this, args);
  };
  
  next();
};

export default logger;