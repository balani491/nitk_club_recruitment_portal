import { Router } from "express";
import { authorizeRole } from "../middlewares/roleMiddleware";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";
import { convenorMiddleware } from "../middlewares/convenorMiddleware";
import { deRegisterFromRecruitment, getAnnouncements,  registerForRecruitment, registrationStatus } from "../controllers/studentController";
import { register } from "module";

const prisma=new PrismaClient();
const router = Router();

// Use JWT authentication middleware for all routes
//@ts-ignore


router.use(authenticateJWT);

//@ts-ignore
router.get("/registrationStatus",authorizeRole(['STUDENT']),registrationStatus);

//@ts-ignore
router.get("/getAnnouncements",authorizeRole(['STUDENT']),getAnnouncements);
//@ts-ignore
router.post("/registerForRecruitment",authorizeRole(['STUDENT']),registerForRecruitment)

//@ts-ignore
router.post("/handleDeRegister",authorizeRole(['STUDENT']),deRegisterFromRecruitment);



export default router;
