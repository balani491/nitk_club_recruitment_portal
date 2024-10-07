import { Router } from 'express';
import { signUp, signIn } from '../controllers/authController';

const router = Router();

// Define routes for signup and signin


//@ts-ignore
router.post('/signup', signUp);
//@ts-ignore
router.post('/signin', signIn);

export default router;
