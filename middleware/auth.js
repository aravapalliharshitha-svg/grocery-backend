const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if no token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user ID from the token to the request object
    req.user = decoded.userId;
    
    // Move on to the actual route (add/delete grocery)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};