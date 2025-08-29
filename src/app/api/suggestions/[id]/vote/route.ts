import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Suggestion ID is required' },
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

    // Check if user has already voted on this suggestion
    const { data: existingVote, error: checkError } = await supabase
      .from('suggestion_votes')
      .select('id')
      .eq('suggestion_id', id)
      .eq('user_identifier', userIdentifier)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Supabase error checking existing vote:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing vote' },
        { status: 500 }
      );
    }

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this suggestion' },
        { status: 400 }
      );
    }

    // Record the vote
    const { error: voteError } = await supabase
      .from('suggestion_votes')
      .insert({
        suggestion_id: id,
        user_identifier: userIdentifier
      });

    if (voteError) {
      console.error('Supabase error recording vote:', voteError);
      return NextResponse.json(
        { error: 'Failed to record vote' },
        { status: 500 }
      );
    }

    // Increment the vote count for the suggestion
    const { data: currentData, error: fetchError } = await supabase
      .from('politician_suggestions')
      .select('votes')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Supabase error fetching current votes:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch suggestion' },
        { status: 500 }
      );
    }

    if (!currentData) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    // Update the vote count
    const { data, error } = await supabase
      .from('politician_suggestions')
      .update({ votes: currentData.votes + 1 })
      .eq('id', id)
      .select('id, name, quadrant, x_coordinate, y_coordinate, grid_id, votes, suggested_by, created_at')
      .single();

    if (error) {
      console.error('Supabase error updating votes:', error);
      return NextResponse.json(
        { error: 'Failed to update vote count' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
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
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Error voting on suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to vote on suggestion' },
      { status: 500 }
    );
  }
}
