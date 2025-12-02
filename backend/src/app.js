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
import adminMetricsRoute from './routes/admin-metrics-route.js';

import rbacRoute from './routes/rbac-route.js';
import businessLogsRoute from './routes/business/business-logs-route.js';
import businessPositionsRoute from './routes/business/business-positions-route.js';
import auditLogsRoute from './routes/admin/audit-logs-route.js';
import auditRequestMiddleware from './middlewares/audit-request-middleware.js';





const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // or '*' if you want to allow all
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  // include common capitalizations for custom header to avoid preflight issues
  allowedHeaders: ['Content-Type','Authorization','X-Business-Id','X-Business-ID','x-business-id'],
  credentials: true
}));



// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users-details', UserDetailsRoutes);
app.use("/api/access-code", accessCodeRoute);

app.use('/api/business', registerBusiness);
app.use('/api/business', businessLogsRoute);
app.use('/api/business/positions', businessPositionsRoute);

app.use('/api/admin', auditLogsRoute);
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
app.use('/api/admin/metrics', adminMetricsRoute);
app.use('/api/rbac', rbacRoute);

app.use('/api', rbacRoute);


// ✅ Debug middleware to see incoming requests (avoid 'undefined' body for GET)
app.use((req, res, next) => {
  const businessId = req.headers['x-business-id'] || null;
  const payload = {
    businessId,
    query: req.query,
  };
  if (req.method !== 'GET') payload.body = req.body;
  console.log(`Incoming ${req.method} ${req.url}`, payload);
  next();
});

export default app;