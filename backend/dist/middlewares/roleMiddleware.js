"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // Role is extracted from the JWT in the authenticateJWT middleware
        const userRole = req.role;
        console.log("in authorizeRole");
        if (allowedRoles.includes(userRole)) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    };
};
exports.authorizeRole = authorizeRole;
