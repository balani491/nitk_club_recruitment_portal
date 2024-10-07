import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface CustomRequest extends Request {
    id?: string;
    role?: string;
}

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log("here")
        return res.status(401).json({"message": "Invalid token"});
    }
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.id = (decoded as { id: string }).id; // Type assertion
        req.role = (decoded as { role: string }).role; // Type assertion
        console.log(decoded);
        next();
    } catch (err) {
        // console.log("here 2")
        return res.status(401).json({ message: "Invalid token" });
    }
};
