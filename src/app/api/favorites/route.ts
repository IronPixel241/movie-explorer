import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Get user's favorites
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
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
    
    try {
      const user = await User.findOne({ email: session.user.email });
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ favorites: user.favorites || [] });
    } catch (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { message: 'Error retrieving favorites from database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { message: 'Error fetching favorites' },
      { status: 500 }
    );
  }
}

// Add a movie to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { movieId } = await request.json();
    
    if (!movieId) {
      return NextResponse.json(
        { message: 'Movie ID is required' },
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
    
    try {
      const user = await User.findOne({ email: session.user.email });
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      // Check if movie is already in favorites
      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        await user.save();
      }

      return NextResponse.json({ message: 'Movie added to favorites', favorites: user.favorites });
    } catch (error) {
      console.error('Database operation error:', error);
      return NextResponse.json(
        { message: 'Error updating favorites in database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { message: 'Error adding to favorites' },
      { status: 500 }
    );
  }
}

// Remove a movie from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const movieId = Number(url.searchParams.get('movieId'));
    
    if (!movieId) {
      return NextResponse.json(
        { message: 'Movie ID is required' },
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
    
    try {
      const user = await User.findOne({ email: session.user.email });
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      // Remove movie from favorites
      user.favorites = user.favorites.filter((id: number) => id !== movieId);
      await user.save();

      return NextResponse.json({ message: 'Movie removed from favorites', favorites: user.favorites });
    } catch (error) {
      console.error('Database operation error:', error);
      return NextResponse.json(
        { message: 'Error updating favorites in database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { message: 'Error removing from favorites' },
      { status: 500 }
    );
  }
} 