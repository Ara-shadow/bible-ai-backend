import { Router } from 'express';
import { UserModel, AdminModel } from '../models/index.js';
import { comparePassword } from '../utils/bcrypt.js';

const router = Router();

// Member Registration
router.post('/member/register', async (req, res) => {
  try {
    const { fullName, email, password, language } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await UserModel.create({
      fullName,
      email,
      password,
      language: language || 'ENGLISH',
    });

    req.session.userId = user.id;

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        language: user.language,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Unable to create account' });
  }
});

// Member Login
router.post('/member/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.userId = user.id;

    res.json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        language: user.language,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Unable to sign in' });
  }
});

// Member Logout
router.post('/member/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to sign out' });
    }
    res.json({ message: 'Signed out successfully' });
  });
});

// Get current member
router.get('/member/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await UserModel.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ member: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Unable to load user data' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await AdminModel.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = await comparePassword(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.adminId = admin.id;

    res.json({ message: 'Admin signed in successfully' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Unable to sign in' });
  }
});

// Admin Logout
router.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to sign out' });
    }
    res.json({ message: 'Signed out successfully' });
  });
});

// Check admin auth
router.get('/admin/me', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const admin = await AdminModel.findById(req.session.adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const { password, ...adminWithoutPassword } = admin;
    res.json({ admin: adminWithoutPassword });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Unable to load admin data' });
  }
});

export default router;
