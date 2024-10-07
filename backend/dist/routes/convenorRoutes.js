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
const express_1 = require("express");
const clubController_1 = require("../controllers/clubController");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const client_1 = require("@prisma/client");
const convenorMiddleware_1 = require("../middlewares/convenorMiddleware");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Use JWT authentication middleware for all routes
//@ts-ignore
router.use(authMiddleware_1.authenticateJWT);
// Route to register a club (only accessible to convenors)
//@ts-ignore
router.post('/register', (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.registerClub);
// Route to add an announcement with recruitment rounds (only accessible to convenors)
//@ts-ignore
router.post('/addAnnouncement', convenorMiddleware_1.convenorMiddleware, (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.addAnnouncementWithRounds);
//@ts-ignore
router.get("/getRegistrations", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.getRegistrations);
//@ts-ignore
router.post("/updateRoundStatus", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.updateRoundStatus);
//@ts-ignore
router.get("/exportPdf", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.exportPdf);
//@ts-ignore
router.get("/getClubInfo", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.getClubInfo);
//@ts-ignore
router.post("/updateClubInfo", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.updateClubInfo);
//@ts-ignore
router.get("/getAnnouncement", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.getAnnouncements);
//@ts-ignore
router.post("updateAnnouncement", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), clubController_1.updateAnnouncement);
//@ts-ignore
//to check if RBAC is working
router.get("/", (0, roleMiddleware_1.authorizeRole)(['CONVENOR']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        "data": "good"
    });
}));
exports.default = router;
