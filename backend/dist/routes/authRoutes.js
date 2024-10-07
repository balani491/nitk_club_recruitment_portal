"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Define routes for signup and signin
//@ts-ignore
router.post('/signup', authController_1.signUp);
//@ts-ignore
router.post('/signin', authController_1.signIn);
exports.default = router;
