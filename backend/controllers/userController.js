const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'recipehub_jwt_secret_key_2026_supersecure';

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Password validation & hashing
    let hashedPassword = '';
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      // Default password if registered via admin/user manager table
      hashedPassword = await bcrypt.hash('password123', 10);
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'User'
    });

    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt
    };

    res.status(201).json({
      ...userObj,
      user: userObj,
      token,
      message: 'Registration successful! Welcome to RecipeHub.'
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    let isMatch = false;
    if (user.password) {
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        // Handle existing unhashed passwords from initial seeds
        if (user.password === password) {
          isMatch = true;
          // Automatically upgrade to bcrypt hash
          user.password = await bcrypt.hash(password, 10);
          await user.save();
        }
      }
    } else {
      // Fallback for legacy seeds without password
      if (password === 'password123' || password === 'admin123') {
        isMatch = true;
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(200).json({
      ...userObj,
      user: userObj,
      token,
      message: 'Login successful!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error during login' });
  }
};

// Get All Users (excluding password)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers
};
