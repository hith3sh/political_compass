import { NextResponse } from 'next/server';
import { initializeDatabase, getTotalUserCount, getQuadrantDistribution } from '../../../lib/database';

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
      const [totalUsers, quadrantDistribution] = await Promise.all([
        getTotalUserCount(),
        getQuadrantDistribution()
      ]);
      
      return NextResponse.json({ 
        totalUsers, 
        quadrantDistribution 
      });
    } else {
      // Return mock data if database is not available
      return NextResponse.json({ 
        totalUsers: 0,
        quadrantDistribution: {
          'libertarian-left': 0,
          'libertarian-right': 0,
          'authoritarian-left': 0,
          'authoritarian-right': 0,
          'centrist': 0
        }
      });
    }
  } catch (error) {
    console.error('GET /api/stats error:', error);
    
    // Return mock data on error
    return NextResponse.json({ 
      totalUsers: 0,
      quadrantDistribution: {
        'libertarian-left': 0,
        'libertarian-right': 0,
        'authoritarian-left': 0,
        'authoritarian-right': 0,
        'centrist': 0
      }
    });
  }
}