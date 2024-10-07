"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Import the authRoutes
const convenorRoutes_1 = __importDefault(require("./routes/convenorRoutes")); // Import the convenorRoutes
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes")); // Import the adminRoutes
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes")); // Import the studentRoutes 
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Parse incoming JSON data
// Use the auth routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/convenor', convenorRoutes_1.default); // Use the convenor routes
app.use('/api/v1/admin', adminRoutes_1.default); // Use the admin routes
app.use('/api/v1/student', studentRoutes_1.default); // Use the student routes
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
