const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role = 'student') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'interviewmate_jwt_secret_key_2026_dev',
    { expiresIn: '30d' }
  );
};

// @desc Register a new student
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, college, degree, graduationYear, targetRole, skills } = req.body;

    if (!name || !email || !password || !college || !degree || !graduationYear || !targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, college, degree, graduation year, target role).'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      college: college.trim(),
      degree: degree.trim(),
      graduationYear: Number(graduationYear),
      targetRole: targetRole.trim(),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      role: 'student'
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        skills: user.skills,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration: ' + error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        skills: user.skills,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login: ' + error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        skills: user.skills || [],
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, college, degree, graduationYear, targetRole, skills, profilePhoto } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (college) updates.college = college.trim();
    if (degree) updates.degree = degree.trim();
    if (graduationYear) updates.graduationYear = Number(graduationYear);
    if (targetRole) updates.targetRole = targetRole.trim();
    if (skills) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (profilePhoto) updates.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        skills: user.skills,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc 1-Click Demo Login
// @route POST /api/auth/demo-login
const demoLogin = async (req, res) => {
  try {
    const { role = 'student' } = req.body;
    const email = role === 'admin' ? 'admin@interviewmate.ai' : 'demo.student@interviewmate.ai';
    
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      if (role === 'admin') {
        user = await User.create({
          name: 'Campus Placement Admin',
          email: 'admin@interviewmate.ai',
          password: hashedPassword,
          college: 'IIT Madras / Platform HQ',
          degree: 'Faculty / Placement Lead',
          graduationYear: 2024,
          targetRole: 'Placement Coordinator',
          skills: ['Mentorship', 'Curriculum Design', 'Evaluation'],
          role: 'admin'
        });
      } else {
        user = await User.create({
          name: 'Alex Johnson',
          email: 'demo.student@interviewmate.ai',
          password: hashedPassword,
          college: 'National Institute of Technology',
          degree: 'B.Tech in Computer Science',
          graduationYear: 2026,
          targetRole: 'Full Stack Software Engineer',
          skills: ['Java', 'React', 'Node.js', 'SQL', 'Data Structures'],
          role: 'student'
        });
      }
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      message: `Welcome to Demo ${role === 'admin' ? 'Admin' : 'Student'} account!`,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        skills: user.skills,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  demoLogin
};
