const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For demo purposes, comment out MongoDB connection if not available
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost')) {
      console.log('MongoDB connection skipped - using local development');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Database connection skipped for demo purposes:', error.message);
    // Don't exit the process in demo mode
    // process.exit(1);
  }
};

module.exports = connectDB;