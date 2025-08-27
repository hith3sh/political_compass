import { NextResponse } from 'next/server';
import { getTotalUserCount, initializeDatabase } from '../../../lib/database';

// Initialize database on first API call
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// GET - Fetch statistics
export async function GET() {
  try {
    await ensureDbInitialized();
    
    const totalUsers = await getTotalUserCount();

    return NextResponse.json({
      totalUsers,
      success: true
    });

  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}