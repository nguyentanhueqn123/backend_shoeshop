const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Access token not found' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.type !== 'access') {
      return res
        .status(403)
        .json({ success: false, message: 'Invalid token type' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = verifyToken;
