"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Sign-up Controller
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        // Password hashing
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Save the new user in the database
        const newUser = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.status(201).json({ message: 'User created successfully', token, role });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find the user in the database
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the provided password matches the stored hashed password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // JWT token generation
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.status(200).json({ message: 'Sign-in successful', token, role: user.role });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error signing in', error });
    }
});
exports.signIn = signIn;
