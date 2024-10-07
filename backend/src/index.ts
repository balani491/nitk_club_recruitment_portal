import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Import the authRoutes
import convenorRoutes from './routes/convenorRoutes'; // Import the convenorRoutes
import adminRoutes from './routes/adminRoutes'; // Import the adminRoutes
import studentRoutes from './routes/studentRoutes'; // Import the studentRoutes 

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON data


// Use the auth routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/convenor', convenorRoutes); // Use the convenor routes
app.use('/api/v1/admin', adminRoutes); // Use the admin routes
app.use('/api/v1/student', studentRoutes); // Use the student routes



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
