import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



// View all Clubs
export const viewClubs = async (req: Request, res: Response) => {
    try {
        const clubs = await prisma.club.findMany();
        return res.status(200).json(clubs);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving clubs', error });
    }
};

// Manage Users (Create, Read, Update, Delete)
export const manageUsers = async (req: Request, res: Response) => {
    const { action, userId, userData } = req.body; // Assuming action, userId and userData are sent in the body

    try {
        let user;
        switch (action) {
            case 'create':
                user = await prisma.user.create({
                    data: { ...userData }
                });
                return res.status(201).json({ message: 'User created', user });
            

            case 'read':
                user = await prisma.user.findUnique({ where: { id: userId } });
                return res.status(200).json(user);

            case 'update':
                user = await prisma.user.update({
                    where: { id: userId },
                    data: { ...userData }
                });
                return res.status(200).json({ message: 'User updated', user });

            case 'delete':
                await prisma.user.delete({ where: { id: userId } });
                return res.status(204).send(); // No content to send back

            default:
                return res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error managing users', error });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
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
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving users', error });
    }
  };
  