"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log("here")
        return res.status(401).json({ "message": "Invalid token" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.id = decoded.id; // Type assertion
        req.role = decoded.role; // Type assertion
        console.log(decoded);
        next();
    }
    catch (err) {
        // console.log("here 2")
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticateJWT = authenticateJWT;
