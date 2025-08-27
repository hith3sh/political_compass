import { NextResponse } from 'next/server';
import { initializeDatabase, getTotalUserCount } from '../../../lib/database';

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      // Continue with mock data if database fails
    }
  }
}

export async function GET() {
  try {
    await ensureDbInitialized();
    
    if (dbInitialized) {
      const totalUsers = await getTotalUserCount();
      return NextResponse.json({ totalUsers });
    } else {
      // Return mock data if database is not available
      return NextResponse.json({ totalUsers: 0 });
    }
  } catch (error) {
    console.error('GET /api/stats error:', error);
    
    // Return mock data on error
    return NextResponse.json({ totalUsers: 0 });
  }
}