import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    role?: string;
}

export const authorizeRole = (allowedRoles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        // Role is extracted from the JWT in the authenticateJWT middleware
        const userRole = req.role;

        console.log("in authorizeRole");
        if (allowedRoles.includes(userRole!)) {
            return next();
        }

        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    };
};
