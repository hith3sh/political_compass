export interface PoliticalFigure {
  x: number;
  y: number;
  image: string;
  name: string;
}

export interface PoliticalFigureMatch {
  figure: PoliticalFigure;
  matchType: 'exact' | 'close';
  distance: number;
}

// Political figures data using simple x, y coordinates (-10 to +10 range)
// Economic axis (x): -10 = Far Left, 0 = Center, +10 = Far Right
// Social axis (y): +10 = Very Authoritarian, 0 = Center, -10 = Very Libertarian
export const politicalFigures: PoliticalFigure[] = [
  // Authoritarian Left Quadrant (Top Left: x < 0, y > 0)
  { x: -9, y: 6, image: 'tilvin.jpg', name: 'Tilvin Silva' },
  { x: -7, y: 8, image: 'mathini.jpg', name: 'Sirimawo Bandaranyake' },
  { x: -5, y: 8, image: 'dayan.jpg', name: 'Dayan Jayatilaka' },
  
  // Authoritarian Right Quadrant (Top Right: x > 0, y > 0)
  { x: 1, y: 7, image: 'mahinda.jpeg', name: 'Mahinda Rajapaksa' },
  { x: 7, y: 7, image: 'nalin.jpeg', name: 'Nalin De Silva' },
  { x: 7, y: 5, image: 'thamalu.jpg', name: 'Thamalu Piyadigama' },
  { x: 1, y: 4, image: 'upali_kohomban.jpg', name: 'Upali Kohomban' },
  { x: 9, y: 9, image: 'JR.jpg', name: 'JR Jayawardena' },
  { x: 5, y: 4, image: 'swrd.jpg', name: 'S.W.R.D. Bandaranaike' },
  { x: 8, y: 6, image: 'eranda.jpg', name: 'Eranda Ginige' },
  { x: 5, y: 3, image: 'anurudda.jpeg', name: 'Anuruddha Pradeep' },
  { x: 4, y: 2, image: 'samila.jpeg', name: 'Samila Muthumini' },

  // Libertarian Left Quadrant (Bottom Left: x < 0, y < 0)
  { x: -2, y: -1, image: 'bruno.jpeg', name: 'Bruno Diwakara' },
  { x: -4, y: -5, image: 'wangeesa.jpeg', name: 'Vangeesa Sumanasekara' },
  { x: -9, y: -2, image: 'pubudu_jagoda.jpg', name: 'Pubudu Jagoda' },
  { x: -9, y: -8, image: 'melani.jpeg', name: 'Melani Gunathilake' },
  { x: -4, y: -4, image: 'harini.jpg', name: 'Harini Amarasooriya' },
  { x: -9, y: -7, image: 'sandakath.jpg', name: 'Sandakath Mahagamaarachchi' },
  { x: -2, y: -5, image: 'nirmal_dewasiri.jpg', name: 'Nirmal Dewasiri' },
  { x: -7, y: -6, image: 'deepthi.jpg', name: 'Deepthi Kumara' },
  { x: -5, y: -5, image: 'anton.jpeg', name: 'Anton Fernando' },

  // Libertarian Right Quadrant (Bottom Right: x > 0, y < 0)
  { x: 4, y: -3, image: 'sajithpremadasa.jpg', name: 'Sajith Premdasa' },
  { x: 7, y: -4, image: 'ranil.jpg', name: 'Ranil Wickremesinghe' },
  { x: 7, y: -1, image: 'iraj.jpg', name: 'Iraj' },
  { x: 7, y: -8, image: 'chinthana.jpg', name: 'Chinthana Darmadasa' },
];

// Helper function to convert x, y coordinates to grid ID (same logic as InteractiveGrid)
export const getGridIdFromCoordinates = (x: number, y: number): number => {
  const col = Math.round((x + 9) / 2);
  const row = Math.round((9 - y) / 2);
  
  const clampedCol = Math.max(0, Math.min(9, col));
  const clampedRow = Math.max(0, Math.min(9, row));
  
  return clampedRow * 10 + clampedCol;
};

// Find matching political figure for given coordinates
export const findMatchingFigure = (userX: number, userY: number): PoliticalFigureMatch | null => {
  const userGridId = getGridIdFromCoordinates(userX, userY);
  
  // Find exact match (same grid cell)
  const exactMatch = politicalFigures.find(figure => {
    const figureGridId = getGridIdFromCoordinates(figure.x, figure.y);
    return figureGridId === userGridId;
  });
  
  if (exactMatch) {
    return {
      figure: exactMatch,
      matchType: 'exact',
      distance: 0
    };
  }
  
  // Find closest match within 1 grid cell distance
  let closestMatch: PoliticalFigure | null = null;
  let minDistance = Infinity;
  
  politicalFigures.forEach(figure => {
    const distance = Math.sqrt(
      Math.pow(figure.x - userX, 2) + Math.pow(figure.y - userY, 2)
    );
    
    // Only consider close matches (within ~3 units distance)
    if (distance <= 3 && distance < minDistance) {
      minDistance = distance;
      closestMatch = figure;
    }
  });
  
  if (closestMatch && minDistance <= 3) {
    return {
      figure: closestMatch,
      matchType: 'close',
      distance: minDistance
    };
  }
  
  return null;
};