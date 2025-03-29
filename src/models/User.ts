import mongoose from 'mongoose';

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  image: {
    type: String,
    default: '',
  },
  favorites: {
    type: [Number],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Only compile the model if it hasn't been compiled before
// This is important in Next.js since the models might be compiled multiple times
export default mongoose.models.User || mongoose.model('User', UserSchema); 