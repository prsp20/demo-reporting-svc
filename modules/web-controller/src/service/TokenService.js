import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.SIGNIN_KEY);
};