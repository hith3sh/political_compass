import { initializeDatabase } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { error: 'Database initialization failed' },
      { status: 500 }
    );
  }
}