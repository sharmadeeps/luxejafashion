const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      emailVerificationToken,
      rewardPoints: 500 // Welcome bonus
    });
    
    // Send verification email
    // await sendVerificationEmail(user.email, emailVerificationToken);
    
    const token = signToken(user._id);
    
    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loyaltyTier: user.loyaltyTier,
        rewardPoints: user.rewardPoints
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = signToken(user._id);
    
    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loyaltyTier: user.loyaltyTier,
        rewardPoints: user.rewardPoints,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.rewardPoints += 200; // Bonus for email verification
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};