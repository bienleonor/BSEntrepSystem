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
import recipeRoutes from './routes/inventory/recipe-route.js';
import comboRoutes from './routes/inventory/combo-route.js';
import accessCodeRoute from "./routes/access-codes-route.js";
import UserDetailsRoutes from './routes/user-details-route.js';
import stockadjustment from './routes/inventory/stock-adjustment-route.js';
import Categoryroutes from './routes/inventory/product-category-route.js';

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
app.use('/api/inventory', recipeRoutes);
app.use('/api/inventory/combo', comboRoutes);
app.use('/api/inventory/adjust', stockadjustment);
// Mount inventory category routes directly under /api/inventory
app.use('/api/inventory', Categoryroutes);
app.use('/uploads', express.static('uploads'));


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