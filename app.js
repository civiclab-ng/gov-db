import express from 'express';
import dotenv from 'dotenv';
import federalRoutes from './routes/federalRoutes.js';
import stateOfficialRoutes from './routes/stateOfficialRoutes.js';
import localOfficialRoutes from './routes/localOfficialRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic route for API health check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Government Officials API' });
});

// Mount all routes
app.use('/api/federal', federalRoutes);
app.use('/api/state-officials', stateOfficialRoutes);
app.use('/api/local-officials', localOfficialRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
