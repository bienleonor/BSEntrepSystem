// controllers/auth-controller.js
import bcrypt from 'bcryptjs';
import { createUser, findUserByUsername } from '../models/user-models.js';
import { generateToken } from '../utils/generate-token.js';
import { findRoleById, findRoleByUserId, assignRoleToUser, findRoleByName } from '../models/sys-role-model.js';
import { getEffectivePermissions } from '../repositories/permissionRepository.js';
import { findBusinessByUserId } from '../models/business/business-model.js';
import { fetchUserDetailsById } from "../models/user-details-model.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Fetch system role
    const roleMapping = await findRoleByUserId(user.user_id);
    const systemRoleId = roleMapping?.system_role_id ?? null;

    const roleData = systemRoleId ? await findRoleById(systemRoleId) : null;
    const systemRole = roleData?.role || "Unknown";

    // User details
    const userDetails = await fetchUserDetailsById(user.user_id);
    const user_details_completed = !!userDetails;

    // Business list + business positions
    const businesses = await findBusinessByUserId(user.user_id);
    // MUST include business_position_id or name
    // Ensure your query returns business_position from business_user_position_table

    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
      system_role: systemRole
    });

    // Determine selected business context for permissions (if any)
    const selectedBusinessId = req.headers['x-business-id'] || null;

    // Compute effective permissions (system ∪ business)
    let permissions = [];
    try {
      permissions = await getEffectivePermissions({
        systemRoleName: systemRole,
        userId: user.user_id,
        businessId: selectedBusinessId
      });
    } catch (permErr) {
      console.warn('Permission computation failed:', permErr?.message || permErr);
    }

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        system_role: systemRole,
        user_details_completed
      },
      businesses,
      permissions
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: 'Username, email and password required' });

  const textRegex = /^[a-zA-Z0-9_.@]+$/;

  if (!textRegex.test(username))
    return res.status(400).json({ error: "Invalid characters in username" });

  if (!textRegex.test(email))
    return res.status(400).json({ error: "Invalid characters in email" });

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!passwordRegex.test(password))
    return res.status(400).json({
      error:
        "Password must be at least 8 chars and include uppercase, lowercase, number, special char"
    });

  try {
    const existing = await findUserByUsername(username);
    if (existing)
      return res.status(409).json({ error: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // 1️⃣ Create the user
    const userId = await createUser({
      username,
      email,
      password: hashed
    });

    // 2️⃣ Find default system role "User"
    const defaultRole = await findRoleByName("User");
    if (!defaultRole) {
      throw new Error("Default system role 'User' not found in DB");
    }

    // 3️⃣ Assign role to user
    await assignRoleToUser(userId, defaultRole.system_role_id);

    return res.status(201).json({
      message: "User registered successfully",
      userId
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: err.message });
  }
};
