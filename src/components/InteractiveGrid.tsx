'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../lib/LanguageContext';

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
  // Using proper mapping: each grid cell represents 2 units on the political compass
  const x = (col * 2) - 9; // Economic axis: -9 to +9 (10 columns)
  const y = 9 - (row * 2); // Social axis: +9 to -9 (10 rows, inverted)
  
  return {
    id: i,
    x: x,
    y: y,
  };
});

// Political Compass Grid Layout (10x10 grid, each cell = 2 units)
// Grid coordinates: x = Economic axis (-9 to +9), y = Social axis (+9 to -9)
// 
// Grid ID mapping:
//    0   1   2   3   4   5   6   7   8   9
// 0 (-9,9) (-7,9) (-5,9) (-3,9) (-1,9) (1,9) (3,9) (5,9) (7,9) (9,9)
// 1 (-9,7) (-7,7) (-5,7) (-3,7) (-1,7) (1,7) (3,7) (5,7) (7,7) (9,7)
// 2 (-9,5) (-7,5) (-5,5) (-3,5) (-1,5) (1,5) (3,5) (5,5) (7,5) (9,5)
// 3 (-9,3) (-7,3) (-5,3) (-3,3) (-1,3) (1,3) (3,3) (5,3) (7,3) (9,3)
// 4 (-9,1) (-7,1) (-5,1) (-3,1) (-1,1) (1,1) (3,1) (5,1) (7,1) (9,1)
// 5 (-9,-1) (-7,-1) (-5,-1) (-3,-1) (-1,-1) (1,-1) (3,-1) (5,-1) (7,-1) (9,-1)
// 6 (-9,-3) (-7,-3) (-5,-3) (-3,-3) (-1,-3) (1,-3) (3,-3) (5,-3) (7,-3) (9,-3)
// 7 (-9,-5) (-7,-5) (-5,-5) (-3,-5) (-1,-5) (1,-5) (3,-5) (5,-5) (7,-5) (9,-5)
// 8 (-9,-7) (-7,-7) (-5,-7) (-3,-7) (-1,-7) (1,-7) (3,-7) (5,-7) (7,-7) (9,-7)
// 9 (-9,-9) (-7,-9) (-5,-9) (-3,-9) (-1,-9) (1,-9) (3,-9) (5,-9) (7,-9) (9,-9)

// Political figures data with their approximate positions
const peopleData: { [key: number]: { image: string; name: string } } = {
  // Liberal Left Quadrant (Top Left)
  1: { image: 'anura.jpg', name: 'Anura Kumara Dissanayake' }, // (-7, 9) - Far left, very liberal
  3: { image: 'mahinda.jpg', name: 'Mahinda Rajapaksa' }, // (-3, 9) - Center-left, liberal
  12: { image: 'chandrika.jpg', name: 'Chandrika Bandaranaike' }, // (-5, 7) - Left, liberal
  
  // Liberal Right Quadrant (Top Right)
  5: { image: 'ranil.jpg', name: 'Ranil Wickremesinghe' }, // (1, 9) - Center-right, very liberal
  7: { image: 'sajith.jpg', name: 'Sajith Premadasa' }, // (5, 9) - Right, liberal
  8: { image: 'karu.jpg', name: 'Karu Jayasuriya' }, // (7, 9) - Far right, liberal
  
  // Conservative Left Quadrant (Bottom Left)
  61: { image: 'swrd.jpg', name: 'S.W.R.D. Bandaranaike' }, // (-7, -1) - Left, slightly conservative
  71: { image: 'sirimavo.jpg', name: 'Sirimavo Bandaranaike' }, // (-7, -5) - Left, conservative
  81: { image: 'dinesh.jpg', name: 'Dinesh Gunawardena' }, // (-7, -7) - Left, very conservative
  
  // Conservative Right Quadrant (Bottom Right)
  55: { image: 'JR.jpg', name: 'J.R. Jayewardene' }, // (1, -1) - Center-right, slightly conservative
  66: { image: 'premadasa.jpg', name: 'Ranasinghe Premadasa' }, // (3, -3) - Right, conservative
  77: { image: 'gotabaya.jpg', name: 'Gotabaya Rajapaksa' }, // (5, -5) - Right, very conservative
  88: { image: 'wimal.jpg', name: 'Wimal Weerawansa' }, // (7, -7) - Far right, very conservative
  
  // Center positions
  44: { image: 'maithripala.jpg', name: 'Maithripala Sirisena' }, // (-1, 1) - Slightly left, slightly liberal
  45: { image: 'ravi.jpg', name: 'Ravi Karunanayake' }, // (1, 1) - Slightly right, slightly liberal
  54: { image: 'patali.jpg', name: 'Patali Champika Ranawaka' }, // (-1, -1) - Slightly left, slightly conservative
  
  // Additional figures
  22: { image: 'sarath.jpg', name: 'Sarath Fonseka' }, // (-5, 5) - Left, liberal
  33: { image: 'mangala.jpg', name: 'Mangala Samaraweera' }, // (-3, 3) - Center-left, liberal
  67: { image: 'basil.jpg', name: 'Basil Rajapaksa' }, // (5, -3) - Right, conservative
  78: { image: 'namal.jpg', name: 'Namal Rajapaksa' }, // (7, -7) - Far right, very conservative
};

// Update grid data with people
gridData.forEach(block => {
  if (peopleData[block.id]) {
    block.personImage = peopleData[block.id].image;
    block.personName = peopleData[block.id].name;
  }
});

export function InteractiveGrid({ userPosition, className = '' }: InteractiveGridProps) {
  const { t } = useLanguage();
  const [hoveredBlock, setHoveredBlock] = useState<GridBlock | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const handleBlockHover = (block: GridBlock, event: React.MouseEvent) => {
    // Show popup for people or user position
    if (!block.personImage && !isUserPosition(block)) return;
    
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
    if (x < 0 && y > 0) return 'bg-red-200 hover:bg-red-300'; // conservative Left
    if (x > 0 && y > 0) return 'bg-blue-200 hover:bg-blue-300'; // conservative Right  
    if (x < 0 && y < 0) return 'bg-green-200 hover:bg-green-300'; // Libertarian Left
    if (x > 0 && y < 0) return 'bg-purple-200 hover:bg-purple-300'; // Libertarian Right
    return 'bg-gray-100 hover:bg-gray-200'; // Center
  };

  const isUserPosition = (block: GridBlock) => {
    if (!userPosition) return false;
    // Find the closest grid cell to the user's position
    // Each grid cell represents a 2x2 area, so we check if the user falls within this cell
    return Math.abs(block.x - userPosition.x) <= 1 && Math.abs(block.y - userPosition.y) <= 1;
  };

  // Calculate user position as percentage within the grid
  const getUserPositionPercent = () => {
    if (!userPosition) return null;
    
    // Convert user position (-10 to +10) to percentage (0% to 100%)
    const xPercent = ((userPosition.x + 10) / 20) * 100;
    const yPercent = ((10 - userPosition.y) / 20) * 100; // Inverted Y axis
    
    return { x: xPercent, y: yPercent };
  };

  const userPercent = getUserPositionPercent();

  return (
    <div className={`relative ${className}`} ref={gridRef}>
      <div className="grid grid-cols-10 gap-1 p-4 bg-white rounded-lg shadow-lg relative">
        {gridData.map((block) => (
          <motion.div
            key={block.id}
            className={`
              aspect-square relative cursor-pointer transition-all duration-200 rounded-sm
              ${getQuadrantColor(block.x, block.y)}
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
          </motion.div>
        ))}
        
        {/* Floating user position indicator */}
        {userPercent && (
          <div 
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${userPercent.x}%`,
              top: `${userPercent.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={(e) => {
              // Create a mock block for the user position
              const userBlock = {
                id: -1,
                x: userPosition!.x,
                y: userPosition!.y
              };
              setHoveredBlock(userBlock);
              const rect = gridRef.current?.getBoundingClientRect();
              if (rect) {
                setPopupPosition({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }
            }}
            onMouseLeave={handleBlockLeave}
          >
            <motion.div 
              className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full border-3 border-white shadow-lg relative"
              animate={{ 
                scale: [1, 1.3, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {/* Pulsing ring around user position */}
              <div className="absolute inset-0 w-7 h-7 border-2 border-purple-400 rounded-full animate-ping opacity-75 -top-1 -left-1"></div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Axis Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* conservative label at top */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">
          {t('conservative')}
        </div>
        
        {/* Libertarian label at bottom */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">
          {t('libertarian')}
        </div>
        
        {/* Left label */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 text-sm font-medium text-gray-700">
          {t('left')}
        </div>
        
        {/* Right label */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 text-sm font-medium text-gray-700">
          {t('right')}
        </div>
        
        {/* Economic scale arrow and label */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 -translate-x-4">
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">←</span>
            <span className="transform -rotate-90 whitespace-nowrap">{t('economicScale')}</span>
            <span className="ml-1">→</span>
          </div>
        </div>
        
        {/* Social scale arrow and label */}
        <div className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-4">
          <div className="flex flex-col items-center text-xs text-gray-500">
            <span>↑</span>
            <span className="whitespace-nowrap">{t('socialScale')}</span>
            <span>↓</span>
          </div>
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
                  sizes="96px"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli5Lj5uFLb3bSZMH3v0CgWm7Kqux1BmhqAxkv8I8Aot8C4wbhkkBuLvPvjM4jZM8r3/dN5fWvjIGmOsGUHbKZT7MN9X3s9HFxCkLnwz4xwsyRKrYKt5J/sFWpXkgJR3TIjJHAd1HBZb8EF6N6xBY6f0hWy7nw/kgYgaFWgD+6H1BZW1KgAAAAEf//2Q=="
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

      {/* User Position Tooltip on Hover */}
      <AnimatePresence>
        {hoveredBlock && hoveredBlock.id === -1 && userPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: popupPosition.x + 10,
              top: popupPosition.y - 60,
            }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-xl p-3">
              <p className="text-sm font-semibold">🎯 Your Position</p>
              <p className="text-xs">
                Economic: {userPosition.x.toFixed(1)}
              </p>
              <p className="text-xs">
                Social: {userPosition.y.toFixed(1)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}