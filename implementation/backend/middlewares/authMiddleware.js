// Middleware to check whether the logged in user is admin or not
const adminCheck = (req, res, next) => {
  if (req.session.userId && req.session.role === 'admin') {
    return next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
};

module.exports = { adminCheck };
