"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
//@ts-ignore
router.use(authMiddleware_1.authenticateJWT);
//@ts-ignore
router.get('/viewClubs', (0, roleMiddleware_1.authorizeRole)(['ADMIN']), adminController_1.viewClubs);
//@ts-ignore
router.post('/manageUsers', (0, roleMiddleware_1.authorizeRole)(['ADMIN']), adminController_1.manageUsers);
//@ts-ignore
router.get("/getAllUsers", (0, roleMiddleware_1.authorizeRole)(['ADMIN']), adminController_1.getAllUsers);
exports.default = router;
