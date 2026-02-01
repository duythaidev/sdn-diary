import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
export const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, jwtConfig.access.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', expired: true });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
  });
};
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.refresh.secret, {
    expiresIn: jwtConfig.refresh.expiresIn,
  });
};
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refresh.secret);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};