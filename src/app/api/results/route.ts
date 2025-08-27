import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, saveUserResult, getRecentResults, getResultsWithPagination } from '../../../lib/database';
import { SaveResultRequest } from '../../../lib/types';

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

// POST - Save a new result
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    if (!dbInitialized) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const body: SaveResultRequest = await request.json();
    
    // Validate input
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (typeof body.economicScore !== 'number' || typeof body.socialScore !== 'number') {
      return NextResponse.json(
        { error: 'Economic and social scores are required' },
        { status: 400 }
      );
    }

    if (!body.quadrant || !['liberal-left', 'liberal-right', 'conservative-left', 'conservative-right'].includes(body.quadrant)) {
      return NextResponse.json(
        { error: 'Valid quadrant is required' },
        { status: 400 }
      );
    }

    const resultId = await saveUserResult(
      body.name.trim(),
      body.economicScore,
      body.socialScore,
      body.quadrant
    );

    return NextResponse.json({
      id: resultId,
      success: true
    });

  } catch (error) {
    console.error('POST /api/results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch results with optional pagination and search
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    if (!dbInitialized) {
      // Return mock data if database is not available
      return NextResponse.json({
        results: [],
        total: 0,
        totalPages: 0
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;

    // If no search and no page specified, return recent results
    if (!search && page === 1 && limit <= 50) {
      const results = await getRecentResults(limit);
      return NextResponse.json({
        results,
        total: results.length,
        totalPages: 1
      });
    }

    // Otherwise, return paginated results
    const { results, total, totalPages } = await getResultsWithPagination(page, limit, search);

    return NextResponse.json({
      results,
      total,
      totalPages
    });

  } catch (error) {
    console.error('GET /api/results error:', error);
    
    // Return mock data on error
    return NextResponse.json({
      results: [],
      total: 0,
      totalPages: 0
    });
  }
}