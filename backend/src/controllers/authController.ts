import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sign-up Controller
export const signUp = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password, role } = req.body;

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });


    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return res.status(201).json({ message: 'User created successfully', token,role });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error });
  }
};


export const signIn = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // JWT token generation
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'Sign-in successful', token,role:user.role });
  } catch (error) {
    return res.status(500).json({ message: 'Error signing in', error });
  }
};
