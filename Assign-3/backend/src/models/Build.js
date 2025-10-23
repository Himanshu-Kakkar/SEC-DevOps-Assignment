const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  repoUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  dockerfile: {
    type: String,
    required: function() {
      return this.status === 'success';
    }
  },
  buildLogs: {
    type: String,
    required: function() {
      return this.status === 'failed';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Build', buildSchema);
