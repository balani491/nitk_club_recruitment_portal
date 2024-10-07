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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.manageUsers = exports.viewClubs = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// View all Clubs
const viewClubs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubs = yield prisma.club.findMany();
        return res.status(200).json(clubs);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving clubs', error });
    }
});
exports.viewClubs = viewClubs;
// Manage Users (Create, Read, Update, Delete)
const manageUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, userId, userData } = req.body; // Assuming action, userId and userData are sent in the body
    try {
        let user;
        switch (action) {
            case 'create':
                user = yield prisma.user.create({
                    data: Object.assign({}, userData)
                });
                return res.status(201).json({ message: 'User created', user });
            case 'read':
                user = yield prisma.user.findUnique({ where: { id: userId } });
                return res.status(200).json(user);
            case 'update':
                user = yield prisma.user.update({
                    where: { id: userId },
                    data: Object.assign({}, userData)
                });
                return res.status(200).json({ message: 'User updated', user });
            case 'delete':
                yield prisma.user.delete({ where: { id: userId } });
                return res.status(204).send(); // No content to send back
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Error managing users', error });
    }
});
exports.manageUsers = manageUsers;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            where: {
                role: {
                    not: 'ADMIN', // Exclude users with the role 'AD' (admin)
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // Add any other fields you want to include, excluding password
            },
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving users', error });
    }
});
exports.getAllUsers = getAllUsers;
