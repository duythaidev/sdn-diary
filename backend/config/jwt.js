import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m', // 15 minutes
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d', // 7 days
  },
};


export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: process.env.ACCESS_TOKEN_COOKIE_MAX_AGE ? Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE) : 15 * 60 * 1000, // 15 minutes
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: process.env.REFRESH_TOKEN_COOKIE_MAX_AGE ? Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE) : 7 * 24 * 60 * 60 * 1000, // 7 days
};