import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/auth-route.js';
import userRoutes from './routes/user-route.js';
import salesRoutes from './routes/sales-route.js';
import cors from 'cors';
import { authenticateToken } from './middlewares/auth-middleware.js';
import  registerBusiness  from './routes/business/business-routes.js';
import  productroutes  from './routes/inventory/product-route.js';

const app = express();

app.use(express.json());
app.use(cors());


// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use(authenticateToken);
app.use('/api/business', registerBusiness);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', productroutes);

// Optionally: error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;