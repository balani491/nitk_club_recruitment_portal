"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const client_1 = require("@prisma/client");
const studentController_1 = require("../controllers/studentController");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Use JWT authentication middleware for all routes
//@ts-ignore
router.use(authMiddleware_1.authenticateJWT);
//@ts-ignore
router.get("/registrationStatus", (0, roleMiddleware_1.authorizeRole)(['STUDENT']), studentController_1.registrationStatus);
//@ts-ignore
router.get("/getAnnouncements", (0, roleMiddleware_1.authorizeRole)(['STUDENT']), studentController_1.getAnnouncements);
//@ts-ignore
router.post("/registerForRecruitment", (0, roleMiddleware_1.authorizeRole)(['STUDENT']), studentController_1.registerForRecruitment);
//@ts-ignore
router.post("/handleDeRegister", (0, roleMiddleware_1.authorizeRole)(['STUDENT']), studentController_1.deRegisterFromRecruitment);
exports.default = router;
