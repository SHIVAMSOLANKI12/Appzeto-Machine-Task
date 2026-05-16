import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Successfully made ${email} an admin!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Usage: node make-admin.js <email>
const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address.');
  process.exit(1);
}

makeAdmin(email);
