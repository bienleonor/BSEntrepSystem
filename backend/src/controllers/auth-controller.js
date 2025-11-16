import bcrypt from 'bcryptjs';
import { createUser, findUserByUsername } from '../models/user-models.js';
import { generateToken } from '../utils/generate-token.js';
import { findRoleById } from '../models/role-model.js';
import { findRoleByUserId } from '../models/role-model.js';
import { findBusinessByUserId } from '../models/business/business-model.js'; 
import { findRoleByName } from '../models/role-model.js';
import pool from '../config/pool.js';


export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Get role
    let roleMapping = await findRoleByUserId(user.user_id);
    let systemRoleId = roleMapping?.system_role_id ?? (await assignDefaultRole(user.user_id));
    const roleData = await findRoleById(systemRoleId);
    const roleName = roleData?.role || 'unknown';

    // Get businesses
    const businesses = await findBusinessByUserId(user.user_id);

    // Generate token WITHOUT business_id
    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
      role: roleName
    });

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: roleName
      },
      businesses // array of businesses for selection
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};




export const register = async (req, res) => {
  console.log('Received registration data:', req.body);
  const { username, email, password } = req.body;

  // 🛡️ Required field check
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  // 🚫 Restrict special characters in username and email
  const textRegex = /^[a-zA-Z0-9_.@]+$/;
  if (!textRegex.test(username)) {
    return res.status(400).json({ error: 'Username contains invalid characters' });
  }
  if (!textRegex.test(email)) {
    return res.status(400).json({ error: 'Email contains invalid characters' });
  }

  // 🔐 Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character'
    });
  }

  try {
    const existing = await findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      username,
      email,
      password: hashedPassword
    });

    const token = generateToken({ user_id: userId, username });

    res.status(201).json({ message: 'User registered', userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
