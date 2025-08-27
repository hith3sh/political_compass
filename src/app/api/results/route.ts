import { NextRequest, NextResponse } from 'next/server';
import { 
  saveUserResult, 
  getRecentResults, 
  getResultsWithPagination,
  initializeDatabase 
} from '../../../lib/database';

// Initialize database on first API call
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// POST - Save a new result
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const body = await request.json();
    const { name, economicScore, socialScore, quadrant } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be 50 characters or less' },
        { status: 400 }
      );
    }

    if (typeof economicScore !== 'number' || economicScore < -10 || economicScore > 10) {
      return NextResponse.json(
        { error: 'Economic score must be a number between -10 and 10' },
        { status: 400 }
      );
    }

    if (typeof socialScore !== 'number' || socialScore < -10 || socialScore > 10) {
      return NextResponse.json(
        { error: 'Social score must be a number between -10 and 10' },
        { status: 400 }
      );
    }

    const validQuadrants = ['liberal-left', 'liberal-right', 'conservative-left', 'conservative-right'];
    if (!validQuadrants.includes(quadrant)) {
      return NextResponse.json(
        { error: 'Invalid quadrant' },
        { status: 400 }
      );
    }

    const resultId = await saveUserResult(
      name.trim(),
      economicScore,
      socialScore,
      quadrant
    );

    return NextResponse.json(
      { 
        success: true, 
        id: resultId,
        message: 'Result saved successfully' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch results with pagination or recent results
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const mode = searchParams.get('mode') || 'recent'; // 'recent' or 'paginated'

    if (mode === 'paginated') {
      // Return paginated results with metadata
      const results = await getResultsWithPagination(page, limit, search);
      return NextResponse.json(results);
    } else {
      // Return recent results only
      const results = await getRecentResults(limit);
      return NextResponse.json({ results });
    }

  } catch (error) {
    console.error('GET /api/results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}