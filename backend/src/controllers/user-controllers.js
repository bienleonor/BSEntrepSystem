import {
  getAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  findUserByUsername,
  getUserDetails
} from '../models/user-models.js';

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

//get user details
export const insertUserDetailsController = async (req, res) => {
  const requiredFields = [
    'first_name',
    'middle_name',
    'last_name',
    'contact_no',
    'birthdate',
    
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // 📞 Require exactly 11 digits starting with 09
  const contactRegex = /^09\d{9}$/;
  if (!contactRegex.test(req.body.contact_no)) {
    return res.status(400).json({
      error: 'contact_no must be exactly 11 digits and start with "09"'
    });
  }

  try {
    const result = await getUserDetails(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Insert or update failed' });
    }

    res.json({ message: 'User details saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
