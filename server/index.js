import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';


const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Set up the port
// Use environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// Use environment variable for MongoDB URI
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// home route
app.get('/', (req, res) => {
  res.send('Welcome to the Farm Pal API');
});
// Import routes
import authRoutes from './routes/authRoute.js';
import aiRoutes from './routes/aiRoute.js';
import weatherRoutes from './routes/weatherRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import expertRoutes from './routes/expertRoute.js';
import contact from './routes/contactRoutes.js';

// use routes
app.use(authRoutes);
app.use(aiRoutes);
app.use(weatherRoutes);
app.use(inventoryRoutes);
app.use(expertRoutes);
app.use(contact);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});