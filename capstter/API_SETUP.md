# API Configuration Cleanup & Best Practices

## ✅ What I've Done

### 1. **Unified axiosInstance.jsx** 
   - ✅ Supports environment-based API URLs (`VITE_API_URL`)
   - ✅ Handles Authorization token injection
   - ✅ Handles X-Business-ID header (for multi-tenancy)
   - ✅ Distinguishes 401 (logout) vs 403 (permission denied)
   - ✅ Clears all user data on token expiration
   - ✅ Shows toast notifications for all errors

### 2. **Modernized api.js**
   - ✅ Now uses axiosInstance instead of raw fetch
   - ✅ Removed hardcoded localhost URLs
   - ✅ Simplified function signatures (no need to pass token manually)
   - ✅ Better error handling

### 3. **Environment Configuration**
   - ✅ `.env.local` - Local development (already set to localhost)
   - ✅ `.env.example` - Production template (update VITE_API_URL when deploying)

## 🗑️ Cleanup - Delete These Files

You now have a **duplicate** `axiosInstance.js` file. Since `axiosInstance.jsx` is the unified version with all features:

**Delete**: `src/utils/axiosInstance.js`

This file is no longer needed and will cause confusion.

## 📝 How to Update Your Components

### ❌ OLD WAY (Don't do this anymore)

```javascript
import api from "./utils/api.js";

const getInventory = async () => {
  const token = localStorage.getItem("token");
  const data = await api.getInventory(businessId, token);
};
```

### ✅ NEW WAY (Recommended)

```javascript
import axiosInstance from "./utils/axiosInstance.jsx";

const getInventory = async () => {
  // axiosInstance automatically handles token & businessId
  const { data } = await axiosInstance.get(
    `/inventory/products/active/inventory-details/${businessId}`
  );
};
```

Or use the helper from api.js (even simpler):

```javascript
import { getInventory } from "./utils/api.js";

const inventory = await getInventory(businessId);
// No token needed - automatically handled!
```

## 🔍 Where to Search & Update

Search your codebase for these patterns and update to use axiosInstance:

1. **Raw fetch calls with hardcoded URLs**
   ```bash
   grep -r "http://localhost:5000" src/
   ```
   Update these to use `axiosInstance` or helper functions

2. **Manual token passing**
   ```bash
   grep -r "localStorage.getItem.*token" src/ | grep -v axiosInstance
   ```
   These should use `axiosInstance` which handles tokens automatically

3. **Manual X-Business-ID headers**
   ```bash
   grep -r "X-Business-ID" src/
   ```
   `axiosInstance` injects this automatically

## 🚀 Deployment Checklist

### For Local Development:
- ✅ `.env.local` → `VITE_API_URL=http://localhost:5000/api`

### For Vercel (Frontend):
- Update `.env` in Vercel Dashboard:
  ```
  VITE_API_URL=https://your-railway-backend-url/api
  ```

### For Railway (Backend):
- Update `FRONTEND_URL` to your Vercel frontend URL for CORS

## 📚 API Usage Examples

```javascript
import axiosInstance from "@/utils/axiosInstance";

// GET Request
const getUser = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data;
};

// POST Request
const createBusiness = async (businessData) => {
  const { data } = await axiosInstance.post("/business/create", businessData);
  return data;
};

// PUT Request
const updateBusiness = async (id, updates) => {
  const { data } = await axiosInstance.put(`/business/${id}`, updates);
  return data;
};

// DELETE Request
const deleteBusiness = async (id) => {
  const { data } = await axiosInstance.delete(`/business/${id}`);
  return data;
};

// With query params
const getBusinesses = async (limit = 10, offset = 0) => {
  const { data } = await axiosInstance.get("/businesses", {
    params: { limit, offset }
  });
  return data;
};
```

## ✨ Benefits of This Setup

| Feature | Before | After |
|---------|--------|-------|
| Hardcoded URLs | ❌ Yes (localhost) | ✅ Environment-based |
| Manual token injection | ❌ Always | ✅ Automatic |
| Business ID header | ❌ Manual | ✅ Automatic |
| Token expiration handling | ⚠️ Partial | ✅ Complete |
| Error toast notifications | ❌ Inconsistent | ✅ Standardized |
| Code duplication | ❌ High | ✅ DRY |
| Deployment friction | ❌ High | ✅ Low |

## 📞 Support

If you find any hardcoded URLs or manual token passing patterns in your components, update them to use `axiosInstance` for consistency.

Next: Delete `src/utils/axiosInstance.js` to avoid confusion!
