"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clubController_1 = require("../controllers/clubController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Student can view clubs and announcements
//@ts-ignore
router.get('/clubs', authMiddleware_1.authenticateJWT, (0, roleMiddleware_1.authorizeRole)('STUDENT'), (req, res) => {
    // Implement view clubs logic
});
// Club convenors can register clubs and manage announcements
//@ts-ignore
router.post('/register', authMiddleware_1.authenticateJWT, (0, roleMiddleware_1.authorizeRole)('CONVENOR'), clubController_1.registerClub);
//@ts-ignore
router.post('/:clubId/announcement', authMiddleware_1.authenticateJWT, (0, roleMiddleware_1.authorizeRole)('CONVENOR'), clubController_1.addAnnouncement);
// Add more routes as needed...
exports.default = router;
