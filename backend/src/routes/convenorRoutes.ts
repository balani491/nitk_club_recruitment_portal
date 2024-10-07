import { Router } from "express";
import {
  registerClub,
  addAnnouncementWithRounds,
  getRegistrations,
  updateRoundStatus,
  exportPdf,
  getClubInfo,
  updateClubInfo,
  getAnnouncements,
  updateAnnouncement
} from "../controllers/clubController";
import { authorizeRole } from "../middlewares/roleMiddleware";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";
import { convenorMiddleware } from "../middlewares/convenorMiddleware";
import { get } from "http";

const prisma=new PrismaClient();
const router = Router();

// Use JWT authentication middleware for all routes
//@ts-ignore


router.use(authenticateJWT);

// Route to register a club (only accessible to convenors)
//@ts-ignore
router.post('/register', authorizeRole(['CONVENOR']), registerClub);

// Route to add an announcement with recruitment rounds (only accessible to convenors)
//@ts-ignore
router.post('/addAnnouncement',convenorMiddleware,authorizeRole(['CONVENOR']), addAnnouncementWithRounds);


//@ts-ignore
router.get("/getRegistrations",authorizeRole(['CONVENOR']),getRegistrations);

//@ts-ignore
router.post("/updateRoundStatus",authorizeRole(['CONVENOR']),updateRoundStatus);

//@ts-ignore
router.get("/exportPdf",authorizeRole(['CONVENOR']),exportPdf);

//@ts-ignore
router.get("/getClubInfo",authorizeRole(['CONVENOR']),getClubInfo);

//@ts-ignore
router.post("/updateClubInfo",authorizeRole(['CONVENOR']),updateClubInfo);

//@ts-ignore
router.get("/getAnnouncement",authorizeRole(['CONVENOR']),getAnnouncements);

//@ts-ignore
router.post("updateAnnouncement",authorizeRole(['CONVENOR']),updateAnnouncement);

//@ts-ignore
//to check if RBAC is working
router.get("/",authorizeRole(['CONVENOR']),async(req,res)=>{
    return res.json({
        "data":"good"
    })
})

export default router;
