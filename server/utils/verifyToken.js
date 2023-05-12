import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(401).json({ message: 'Token expired' });
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default verifyToken;
