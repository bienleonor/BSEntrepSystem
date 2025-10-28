import bcrypt from 'bcryptjs';
import { createUser, findUserByUsername } from '../models/user-models.js';
import { generateToken } from '../utils/generate-token.js';
import { findRoleById } from '../models/role-model.js';
import { findRoleByUserId } from '../models/role-model.js';
import { findBusinessByUserId } from '../models/business-model.js'; 
import { findRoleByName } from '../models/role-model.js';
import pool from '../config/pool.js';


export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 🔐 Find user by username
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 🔐 Validate password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 🔍 Get system_role_id from user_sys_role_table
    let roleMapping = await findRoleByUserId(user.user_id);
    let systemRoleId;

    if (roleMapping && roleMapping.system_role_id) {
      systemRoleId = roleMapping.system_role_id;
    } else {
      // 🛠️ Assign default "user" role
      const defaultRole = await findRoleByName('user');
      if (!defaultRole || !defaultRole.system_role_id) {
        return res.status(500).json({ error: 'Default role not found' });
      }

      systemRoleId = defaultRole.system_role_id;

      // 🧱 Insert default role mapping
      const [insertResult] = await pool.query(
        'INSERT INTO user_sys_role_table (user_id, system_role_id) VALUES (?, ?)',
        [user.user_id, systemRoleId]
      );

      if (!insertResult.affectedRows) {
        return res.status(500).json({ error: 'Failed to assign default role' });
      }
    }

    // 🔍 Get role name from system_role_table
    const roleData = await findRoleById(systemRoleId);
    const roleName = roleData?.role || 'unknown';

    // 🏢 Get business_id if applicable
    const businessMapping = await findBusinessByUserId(user.user_id);
    const businessId = businessMapping?.business_id || null;

    // 🎟️ Generate JWT token
    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
      role: roleName,
      business_id: businessId
    });

    // ✅ Send response
    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: roleName,
        business_id: businessId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const register = async (req, res) => {
  console.log('Received registration data:', req.body);
  const { username, email, password } = req.body;
  try {
    // Check if username already exists
    const existing = await findUserByUsername(username);
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await createUser({
      username,
      email,
      password: hashedPassword,
     
    });

    // Optionally, generate token on registration
    const token = generateToken({ user_id: userId, username});


    

    res.status(201).json({ message: 'User registered', userId,  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};