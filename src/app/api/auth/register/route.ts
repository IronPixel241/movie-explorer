import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    try {
      await dbConnect();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json(
        { message: 'Database connection error. Please try again later.' },
        { status: 500 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return NextResponse.json(
          { message: 'User already exists' },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();

      // Remove password from response
      const userObj = user.toObject();
      delete userObj.password;

      return NextResponse.json(
        { message: 'User created successfully', user: userObj },
        { status: 201 }
      );
    } catch (error) {
      console.error('Database operation error:', error);
      return NextResponse.json(
        { message: 'Error performing database operation' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
} 