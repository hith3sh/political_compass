import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('politician_suggestions')
      .select('id, name, quadrant, x_coordinate, y_coordinate, grid_id, votes, suggested_by, created_at')
      .order('votes', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch suggestions' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const suggestions = data.map(row => ({
      id: row.id,
      name: row.name,
      quadrant: row.quadrant,
      x: row.x_coordinate,
      y: row.y_coordinate,
      gridId: row.grid_id,
      votes: row.votes,
      suggestedBy: row.suggested_by,
      createdAt: row.created_at
    }));

    return NextResponse.json({
      suggestions
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, quadrant, x, y, gridId } = await request.json();

    if (!name || !quadrant || x === undefined || y === undefined || gridId === undefined) {
      return NextResponse.json(
        { error: 'Name, quadrant, x, y, and gridId are required' },
        { status: 400 }
      );
    }

    // Get user identifier from request headers (sent from frontend)
    const userIdentifier = request.headers.get('x-user-identifier');
    
    if (!userIdentifier) {
      return NextResponse.json(
        { error: 'User identifier is required' },
        { status: 400 }
      );
    }

    // Generate a simple user identifier for the suggested_by field
    const suggestedBy = `User_${Math.random().toString(36).substr(2, 9)}`;

    // Insert the suggestion with 1 vote by default
    const { data, error } = await supabase
      .from('politician_suggestions')
      .insert({
        name,
        quadrant,
        x_coordinate: x,
        y_coordinate: y,
        grid_id: gridId,
        votes: 1, // Start with 1 vote (the suggester's vote)
        suggested_by: suggestedBy
      })
      .select('id, name, quadrant, x_coordinate, y_coordinate, grid_id, votes, suggested_by, created_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create suggestion' },
        { status: 500 }
      );
    }

    // Record the automatic vote for the suggester
    const { error: voteError } = await supabase
      .from('suggestion_votes')
      .insert({
        suggestion_id: data.id,
        user_identifier: userIdentifier
      });

    if (voteError) {
      console.error('Supabase error recording automatic vote:', voteError);
      // Don't fail the entire request if vote recording fails
      // The suggestion was created successfully
    }

    // Transform the data to match the expected format
    const suggestion = {
      id: data.id,
      name: data.name,
      quadrant: data.quadrant,
      x: data.x_coordinate,
      y: data.y_coordinate,
      gridId: data.grid_id,
      votes: data.votes,
      suggestedBy: data.suggested_by,
      createdAt: data.created_at
    };

    return NextResponse.json({
      suggestion,
      message: 'Suggestion created successfully with your automatic vote!'
    });
  } catch (error) {
    console.error('Error creating suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to create suggestion' },
      { status: 500 }
    );
  }
}
