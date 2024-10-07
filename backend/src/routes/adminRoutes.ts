import { Router } from "express";
import { viewClubs,manageUsers, getAllUsers } from "../controllers/adminController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRole } from "../middlewares/roleMiddleware";

const router = Router();
//@ts-ignore
router.use(authenticateJWT);
//@ts-ignore
router.get('/viewClubs', authorizeRole(['ADMIN']),viewClubs);
//@ts-ignore
router.post('/manageUsers', authorizeRole(['ADMIN']),manageUsers);

//@ts-ignore
router.get("/getAllUsers",authorizeRole(['ADMIN']),getAllUsers);

export default router;