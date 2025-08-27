import { sql } from '@vercel/postgres';

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

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Create the results table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS user_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        economic_score DECIMAL(3,1) NOT NULL,
        social_score DECIMAL(3,1) NOT NULL,
        quadrant VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT check_economic_score CHECK (economic_score >= -10.0 AND economic_score <= 10.0),
        CONSTRAINT check_social_score CHECK (social_score >= -10.0 AND social_score <= 10.0),
        CONSTRAINT check_quadrant CHECK (quadrant IN ('liberal-left', 'liberal-right', 'conservative-left', 'conservative-right'))
      );
    `;

    // Create an index on created_at for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_results_created_at 
      ON user_results(created_at DESC);
    `;

    console.log('Database initialized successfully');
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
    const result = await sql`
      INSERT INTO user_results (name, economic_score, social_score, quadrant)
      VALUES (${name}, ${economicScore}, ${socialScore}, ${quadrant})
      RETURNING id;
    `;

    return result.rows[0].id;
  } catch (error) {
    console.error('Failed to save user result:', error);
    throw error;
  }
}

// Get recent user results
export async function getRecentResults(limit: number = 10, offset: number = 0): Promise<UserResult[]> {
  try {
    const result = await sql`
      SELECT id, name, economic_score, social_score, quadrant, created_at
      FROM user_results
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result.rows.map(row => ({
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
    const result = await sql`
      SELECT COUNT(*) as total_users
      FROM user_results;
    `;

    return parseInt(result.rows[0].total_users);
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
    
    let searchParam = null;
    
    if (search && search.trim()) {
      searchParam = `%${search.trim()}%`;
    }

    const countQuery = searchParam 
      ? sql`SELECT COUNT(*) as total FROM user_results WHERE LOWER(name) LIKE LOWER(${searchParam})`
      : sql`SELECT COUNT(*) as total FROM user_results`;

    const totalResult = await countQuery;
    const total = parseInt(totalResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    const resultsQuery = searchParam
      ? sql`
          SELECT id, name, economic_score, social_score, quadrant, created_at
          FROM user_results
          WHERE LOWER(name) LIKE LOWER(${searchParam})
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      : sql`
          SELECT id, name, economic_score, social_score, quadrant, created_at
          FROM user_results
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

    const results = await resultsQuery;

    return {
      results: results.rows.map(row => ({
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