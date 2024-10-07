import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
    id?: string;
    clubId?: number;
}

export const convenorMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    //@ts-ignore
    const userId = parseInt(req.id); // Get convenorId from JWT

    try {
        // Fetch the club based on the convenorId
        const club = await prisma.club.findUnique({
            // @ts-ignore
            where: { convenorId: userId },
        });

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor.' });
        }

        // Attach clubId to the request object
        req.clubId = club.id;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch club information' });
    }
};
