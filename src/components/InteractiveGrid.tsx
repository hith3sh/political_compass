'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GridBlock {
  id: number;
  x: number; // -10 to 10 (economic axis)
  y: number; // -10 to 10 (social axis)
  personImage?: string;
  personName?: string;
}

interface InteractiveGridProps {
  userPosition?: { x: number; y: number };
  className?: string;
}

// Sample data - you can expand this with actual person data
const gridData: GridBlock[] = Array.from({ length: 100 }, (_, i) => {
  const row = Math.floor(i / 10);
  const col = i % 10;
  
  // Convert grid position (0-9) to political compass coordinates (-10 to 10)
  const x = (col * 2.22) - 10; // Economic axis
  const y = 10 - (row * 2.22); // Social axis (inverted)
  
  return {
    id: i,
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
});

// Add some sample people data (you can expand this)
const peopleData: { [key: number]: { image: string; name: string } } = {
  15: { image: 'anura.jpg', name: 'Anura Kumara Dissanayake' },
  25: { image: 'ranil.jpg', name: 'Ranil Wickremesinghe' },
  35: { image: 'sajith premadasa.jpg', name: 'Sajith Premadasa' },
  45: { image: 'wimal weerawansa.jpg', name: 'Wimal Weerawansa' },
  55: { image: 'JR.jpg', name: 'J.R. Jayewardene' },
  65: { image: 'swrd.jpg', name: 'S.W.R.D. Bandaranaike' },
};

// Update grid data with people
gridData.forEach(block => {
  if (peopleData[block.id]) {
    block.personImage = peopleData[block.id].image;
    block.personName = peopleData[block.id].name;
  }
});

export function InteractiveGrid({ userPosition, className = '' }: InteractiveGridProps) {
  const [hoveredBlock, setHoveredBlock] = useState<GridBlock | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const handleBlockHover = (block: GridBlock, event: React.MouseEvent) => {
    if (!block.personImage) return;
    
    const rect = gridRef.current?.getBoundingClientRect();
    if (rect) {
      setPopupPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    setHoveredBlock(block);
  };

  const handleBlockLeave = () => {
    setHoveredBlock(null);
  };

  const getQuadrantColor = (x: number, y: number) => {
    if (x < 0 && y > 0) return 'bg-red-100 hover:bg-red-200'; // Liberal Left
    if (x > 0 && y > 0) return 'bg-blue-100 hover:bg-blue-200'; // Liberal Right  
    if (x < 0 && y < 0) return 'bg-green-100 hover:bg-green-200'; // Conservative Left
    if (x > 0 && y < 0) return 'bg-yellow-100 hover:bg-yellow-200'; // Conservative Right
    return 'bg-gray-100 hover:bg-gray-200'; // Center
  };

  const isUserPosition = (block: GridBlock) => {
    if (!userPosition) return false;
    return Math.abs(block.x - userPosition.x) < 1.1 && Math.abs(block.y - userPosition.y) < 1.1;
  };

  return (
    <div className={`relative ${className}`} ref={gridRef}>
      <div className="grid grid-cols-10 gap-1 p-4 bg-white rounded-lg shadow-lg">
        {gridData.map((block) => (
          <motion.div
            key={block.id}
            className={`
              aspect-square relative cursor-pointer transition-all duration-200 rounded-sm
              ${getQuadrantColor(block.x, block.y)}
              ${block.personImage ? 'ring-2 ring-offset-1 ring-gray-300' : ''}
              ${isUserPosition(block) ? 'ring-4 ring-offset-2 ring-purple-500 bg-purple-200' : ''}
            `}
            onMouseEnter={(e) => handleBlockHover(block, e)}
            onMouseLeave={handleBlockLeave}
            onClick={(e) => {
              // For mobile - show popup on click
              if ('ontouchstart' in window) {
                handleBlockHover(block, e);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Dot indicator for people */}
            {block.personImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
              </div>
            )}
            
            {/* User position indicator */}
            {isUserPosition(block) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow-lg"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Axis Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Economic Axis Labels */}
        <div className="absolute -bottom-8 left-4 text-xs text-gray-500">Left</div>
        <div className="absolute -bottom-8 right-4 text-xs text-gray-500">Right</div>
        
        {/* Social Axis Labels */}
        <div className="absolute -left-12 top-4 text-xs text-gray-500 transform -rotate-90 origin-center">
          Liberal
        </div>
        <div className="absolute -left-16 bottom-4 text-xs text-gray-500 transform -rotate-90 origin-center">
          Conservative
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {hoveredBlock && hoveredBlock.personImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: popupPosition.x + 10,
              top: popupPosition.y - 80,
            }}
          >
            <div className="bg-white rounded-lg shadow-xl border p-2 max-w-32">
              <div className="relative w-24 h-24 rounded overflow-hidden">
                <Image
                  src={`/people/${hoveredBlock.personImage}`}
                  alt={hoveredBlock.personName || 'Person'}
                  fill
                  className="object-cover"
                />
              </div>
              {hoveredBlock.personName && (
                <p className="text-xs text-center mt-1 font-medium">
                  {hoveredBlock.personName}
                </p>
              )}
              <p className="text-xs text-center text-gray-500">
                ({hoveredBlock.x}, {hoveredBlock.y})
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}