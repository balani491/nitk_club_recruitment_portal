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
exports.convenorMiddleware = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const convenorMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = parseInt(req.id); // Get convenorId from JWT
    try {
        // Fetch the club based on the convenorId
        const club = yield prisma.club.findUnique({
            // @ts-ignore
            where: { convenorId: userId },
        });
        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor.' });
        }
        // Attach clubId to the request object
        req.clubId = club.id;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch club information' });
    }
});
exports.convenorMiddleware = convenorMiddleware;
