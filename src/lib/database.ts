import { createClient } from '@supabase/supabase-js';

export interface UserResult {
  id: string;
  name: string;
  economic_score: number;
  social_score: number;
  quadrant: string;
  created_at: string;
}

export interface DatabaseStats {
  total_users: number;
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are not set');
    }

    // Create the results table if it doesn't exist using Supabase SQL
    // const { error } = await supabase.rpc('create_user_results_table');
    // console.log('Supabase environment variables are set. Table creation skipped (already exists).');

    // console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Save a user result to the database
export async function saveUserResult(
  name: string,
  economicScore: number,
  socialScore: number,
  quadrant: string
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('user_results')
      .insert({
        name,
        economic_score: economicScore,
        social_score: socialScore,
        quadrant
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Failed to save user result:', error);
    throw error;
  }
}

// Get recent user results
export async function getRecentResults(limit: number = 10, offset: number = 0): Promise<UserResult[]> {
  try {
    const { data, error } = await supabase
      .from('user_results')
      .select('id, name, economic_score, social_score, quadrant, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      economic_score: parseFloat(row.economic_score),
      social_score: parseFloat(row.social_score),
      quadrant: row.quadrant,
      created_at: row.created_at
    }));
  } catch (error) {
    console.error('Failed to get recent results:', error);
    throw error;
  }
}

// Get total number of users who completed the test
export async function getTotalUserCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('user_results')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Failed to get user count:', error);
    throw error;
  }
}

// Get results with search and pagination
export async function getResultsWithPagination(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{ results: UserResult[], total: number, totalPages: number }> {
  try {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('user_results')
      .select('id, name, economic_score, social_score, quadrant, created_at')
      .order('created_at', { ascending: false });

    let countQuery = supabase
      .from('user_results')
      .select('*', { count: 'exact', head: true });

    if (search && search.trim()) {
      const searchTerm = search.trim();
      query = query.ilike('name', `%${searchTerm}%`);
      countQuery = countQuery.ilike('name', `%${searchTerm}%`);
    }

    const [{ data: results, error: resultsError }, { count, error: countError }] = await Promise.all([
      query.range(offset, offset + limit - 1),
      countQuery
    ]);

    if (resultsError) throw resultsError;
    if (countError) throw countError;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      results: results.map(row => ({
        id: row.id,
        name: row.name,
        economic_score: parseFloat(row.economic_score),
        social_score: parseFloat(row.social_score),
        quadrant: row.quadrant,
        created_at: row.created_at
      })),
      total,
      totalPages
    };
  } catch (error) {
    console.error('Failed to get paginated results:', error);
    throw error;
  }
}