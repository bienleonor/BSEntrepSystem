/**
 * PERMISSION KEYS REFERENCE
 * =========================
 * These are the ACTUAL permission keys from the database (feature_action_table).
 * Format: feature:action
 * 
 * USAGE:
 * - System Roles (superadmin, admin, user) get permissions from system_permissions_table
 * - Business Positions (Manager, Cashier) get permissions from business_permission_table
 * - Individual users can have overrides via business_permission_override_table
 * - Superadmin bypasses all permission checks automatically
 */

// ============================================
// ACTUAL DATABASE PERMISSION KEYS
// ============================================
export const PERMISSIONS = Object.freeze({
  // Audit Logs
  AUDIT_LOGS_ARCHIVE: 'audit_logs:archive',
  AUDIT_LOGS_EXPORT: 'audit_logs:export',
  AUDIT_LOGS_READ: 'audit_logs:read',
  
  // Business Settings
  BUSINESS_SETTINGS_EXPORT: 'business_settings:export',
  BUSINESS_SETTINGS_READ: 'business_settings:read',
  BUSINESS_SETTINGS_UPDATE: 'business_settings:update',
  
  // Category
  CATEGORY_ARCHIVE: 'category:archive',
  CATEGORY_CREATE: 'category:create',
  CATEGORY_DELETE: 'category:delete',
  CATEGORY_EXPORT: 'category:export',
  CATEGORY_READ: 'category:read',
  CATEGORY_UPDATE: 'category:update',
  
  // Combo
  COMBO_ARCHIVE: 'combo:archive',
  COMBO_CREATE: 'combo:create',
  COMBO_DELETE: 'combo:delete',
  COMBO_EXPORT: 'combo:export',
  COMBO_READ: 'combo:read',
  COMBO_UPDATE: 'combo:update',
  
  // Dashboard
  DASHBOARD_EXPORT: 'dashboard:export',
  DASHBOARD_READ: 'dashboard:read',
  
  // Order
  ORDER_ARCHIVE: 'order:archive',
  ORDER_CANCEL: 'order:cancel',
  ORDER_CREATE: 'order:create',
  ORDER_DELETE: 'order:delete',
  ORDER_EXPORT: 'order:export',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  
  // Product
  PRODUCT_ARCHIVE: 'product:archive',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_EXPORT: 'product:export',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  
  // Production
  PRODUCTION_ARCHIVE: 'production:archive',
  PRODUCTION_CANCEL: 'production:cancel',
  PRODUCTION_CREATE: 'production:create',
  PRODUCTION_DELETE: 'production:delete',
  PRODUCTION_EXPORT: 'production:export',
  PRODUCTION_READ: 'production:read',
  PRODUCTION_UPDATE: 'production:update',
  
  // Recipe
  RECIPE_ARCHIVE: 'recipe:archive',
  RECIPE_CREATE: 'recipe:create',
  RECIPE_DELETE: 'recipe:delete',
  RECIPE_EXPORT: 'recipe:export',
  RECIPE_READ: 'recipe:read',
  RECIPE_UPDATE: 'recipe:update',
  
  // Report
  REPORT_EXPORT: 'report:export',
  REPORT_READ: 'report:read',
  
  // Role Permission
  ROLE_PERMISSION_CREATE: 'role_permission:create',
  ROLE_PERMISSION_DELETE: 'role_permission:delete',
  ROLE_PERMISSION_EXPORT: 'role_permission:export',
  ROLE_PERMISSION_READ: 'role_permission:read',
  ROLE_PERMISSION_UPDATE: 'role_permission:update',
  
  // Sales
  SALES_ARCHIVE: 'sales:archive',
  SALES_CANCEL: 'sales:cancel',
  SALES_CREATE: 'sales:create',
  SALES_DELETE: 'sales:delete',
  SALES_EXPORT: 'sales:export',
  SALES_READ: 'sales:read',
  SALES_UPDATE: 'sales:update',
  
  // Stock-in
  STOCKIN_ARCHIVE: 'stockin:archive',
  STOCKIN_CANCEL: 'stockin:cancel',
  STOCKIN_CREATE: 'stockin:create',
  STOCKIN_DELETE: 'stockin:delete',
  STOCKIN_EXPORT: 'stockin:export',
  STOCKIN_READ: 'stockin:read',
  STOCKIN_UPDATE: 'stockin:update',
  
  // Stock Adjustment
  STOCK_ADJUSTMENT_ARCHIVE: 'stock_adjustment:archive',
  STOCK_ADJUSTMENT_CANCEL: 'stock_adjustment:cancel',
  STOCK_ADJUSTMENT_CREATE: 'stock_adjustment:create',
  STOCK_ADJUSTMENT_DELETE: 'stock_adjustment:delete',
  STOCK_ADJUSTMENT_EXPORT: 'stock_adjustment:export',
  STOCK_ADJUSTMENT_READ: 'stock_adjustment:read',
  STOCK_ADJUSTMENT_UPDATE: 'stock_adjustment:update',
  
  // Supplier
  SUPPLIER_ARCHIVE: 'supplier:archive',
  SUPPLIER_CREATE: 'supplier:create',
  SUPPLIER_DELETE: 'supplier:delete',
  SUPPLIER_EXPORT: 'supplier:export',
  SUPPLIER_READ: 'supplier:read',
  SUPPLIER_UPDATE: 'supplier:update',
  
  // Unit
  UNIT_CREATE: 'unit:create',
  UNIT_DELETE: 'unit:delete',
  UNIT_READ: 'unit:read',
  UNIT_UPDATE: 'unit:update',
  
  // User Management
  USER_MANAGEMENT_ARCHIVE: 'user_management:archive',
  USER_MANAGEMENT_CREATE: 'user_management:create',
  USER_MANAGEMENT_DELETE: 'user_management:delete',
  USER_MANAGEMENT_EXPORT: 'user_management:export',
  USER_MANAGEMENT_READ: 'user_management:read',
  USER_MANAGEMENT_UPDATE: 'user_management:update',
});

// ============================================
// ALL PERMISSION KEYS (flat array for iteration)
// ============================================
export const ALL_PERMISSION_KEYS = Object.values(PERMISSIONS);

export default {
  PERMISSIONS,
  ALL_PERMISSION_KEYS,
};
