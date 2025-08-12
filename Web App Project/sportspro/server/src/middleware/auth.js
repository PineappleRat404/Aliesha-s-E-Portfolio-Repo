const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verifyAsync = promisify(jwt.verify);

const authenticate = async (req, res, next) => {
  if (
    req.path === '/login' ||
    req.path === '/api/v1/login' ||
    req.path === '/api/login' ||
    req.path.startsWith('/api-docs') ||       
    req.path.startsWith('/swagger-ui') ||     
    req.path.endsWith('.js') || req.path.endsWith('.css') 
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorised' });

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyAsync(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorised' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };

