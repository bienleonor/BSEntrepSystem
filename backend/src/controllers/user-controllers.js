import {
  getAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  findUserByUsername,

} from '../models/user-models.js';

import {
  getUserDetails,
  fetchUserDetailsById
} from '../models/user-details-model.js'

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new user
export const addUser = async (req, res) => {
  try {
    // Optionally check if username/email already exists
    const existing = await findUserByUsername(req.body.username);
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const userId = await createUser(req.body);
    res.status(201).json({ message: 'User created', userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
export const editUser = async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
export const removeUser = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
