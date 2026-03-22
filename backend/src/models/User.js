const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    // Not required for OAuth users
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  oauthId: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
