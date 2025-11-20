import express from 'express';
import 'dotenv/config';
import cors from 'cors';

//ROUTES IMPORT
import authRoutes from './routes/auth-route.js';
import userRoutes from './routes/user-route.js';
import salesRoutes from './routes/sales-route.js';
import { authenticateToken } from './middlewares/auth-middleware.js';
import  registerBusiness  from './routes/business/business-routes.js';
import  productroutes  from './routes/inventory/product-route.js';
import accessCodeRoute from "./routes/access-code-route.js";

import salesAnalysisRoutes from './routes/analysis/sales.js';
import profitAnalysisRoutes from './routes/analysis/profit.js';
import inventoryAnalysisRoutes from './routes/analysis/inventory.js';
import summaryAnalysisRoutes from './routes/analysis/summary.js';

const app = express();

app.use(express.json());
app.use(cors());


// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/business', registerBusiness);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', productroutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/access-code", accessCodeRoute);

// KPI routes
app.use('/api/sales', salesAnalysisRoutes);
app.use('/api/profit', profitAnalysisRoutes);
app.use('/api/inventory', inventoryAnalysisRoutes);
app.use('/api/summary', summaryAnalysisRoutes);


// Optionally: error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;