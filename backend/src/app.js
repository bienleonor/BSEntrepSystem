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
import accessCodeRoute from "./routes/access-codes-route.js";
import UserDetailsRoutes from './routes/user-details-route.js';
import productionRoutes from './routes/inventory/production-route.js';

import salesAnalysisRoutes from './routes/analysis/sales.js';
import profitAnalysisRoutes from './routes/analysis/profit.js';
import inventoryAnalysisRoutes from './routes/analysis/inventory.js';
import summaryAnalysisRoutes from './routes/analysis/summary.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // or '*' if you want to allow all
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Business-Id'],
  credentials: true
}));



// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users-details', UserDetailsRoutes);
app.use("/api/access-code", accessCodeRoute);
app.use('/api/business', registerBusiness);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', productroutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/inventory/production', productionRoutes);

// KPI routes
app.use('/api/analysis/sales', salesAnalysisRoutes);
app.use('/api/analysis/profit', profitAnalysisRoutes);
app.use('/api/analysis/inventory', inventoryAnalysisRoutes);
app.use('/api/analysis/summary', summaryAnalysisRoutes);


// ✅ Debug middleware to see all incoming requests
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url, req.body);
  next();
});

export default app;