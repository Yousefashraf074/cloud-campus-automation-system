const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, location, bio, companyName } = req.body;
  user.name = name || user.name;
  user.location = location || user.location;
  user.bio = bio || user.bio;
  if (user.role === 'company') {
    user.companyName = companyName || user.companyName;
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    location: updatedUser.location,
    bio: updatedUser.bio,
    companyName: updatedUser.companyName,
    resumeUrl: updatedUser.resumeUrl
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = { getProfile, updateProfile, getAllUsers };
