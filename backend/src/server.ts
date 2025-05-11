// Import Express and its type definitions
import express, { Express, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
dotenv.config();

// Create an Express application
const app: Express = express();
const prisma = new PrismaClient();
// Define the port we'll run on
const PORT = process.env.PORT || 5000;

// CORS middleware to allow requests from frontend
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// const prisma = new PrismaClient();

// Basic route to test our server
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Cursed Compass API!' });
});

app.get('/locations', async (req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Add endpoint to get a single location by ID
app.get('/locations/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const location = await prisma.location.findFirst({
      where: { id: id },
    });
      

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 