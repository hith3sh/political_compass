'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../lib/LanguageContext';
import { politicalFigures, getGridIdFromCoordinates as getGridIdFromCoords } from '../lib/politicalFigures';

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
  onGridClick?: (x: number, y: number, gridId: number) => void;
  showOccupiedLabel?: boolean;
  showGridNumbers?: boolean;
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
//    0        1      2      3      4     5     6     7     8     9
// 0 (-9,9)  (-7,9)   (-5,9) (-3,9) (-1,9) (1,9) (3,9) (5,9) (7,9) (9,9)
// 1 (-9,7)  (-7,7)   (-5,7) (-3,7) (-1,7) (1,7) (3,7) (5,7) (7,7) (9,7)
// 2 (-9,5)  (-7,5)   (-5,5) (-3,5) (-1,5) (1,5) (3,5) (5,5) (7,5) (9,5)
// 3 (-9,3)  (-7,3)   (-5,3) (-3,3) (-1,3) (1,3) (3,3) (5,3) (7,3) (9,3)
// 4 (-9,1)  (-7,1)   (-5,1) (-3,1) (-1,1) (1,1) (3,1) (5,1) (7,1) (9,1)
// 5 (-9,-1) (-7,-1) (-5,-1) (-3,-1) (-1,-1) (1,-1) (3,-1) (5,-1) (7,-1) (9,-1)
// 6 (-9,-3) (-7,-3) (-5,-3) (-3,-3) (-1,-3) (1,-3) (3,-3) (5,-3) (7,-3) (9,-3)
// 7 (-9,-5) (-7,-5) (-5,-5) (-3,-5) (-1,-5) (1,-5) (3,-5) (5,-5) (7,-5) (9,-5)
// 8 (-9,-7) (-7,-7) (-5,-7) (-3,-7) (-1,-7) (1,-7) (3,-7) (5,-7) (7,-7) (9,-7)
// 9 (-9,-9) (-7,-9) (-5,-9) (-3,-9) (-1,-9) (1,-9) (3,-9) (5,-9) (7,-9) (9,-9)


// Convert imported political figures data to grid ID-based data for compatibility
const peopleData: { [key: number]: { image: string; name: string } } = {};
politicalFigures.forEach(person => {
  const gridId = getGridIdFromCoords(person.x, person.y);
  peopleData[gridId] = {
    image: person.image,
    name: person.name
  };
});

// Update grid data with people
gridData.forEach(block => {
  if (peopleData[block.id]) {
    block.personImage = peopleData[block.id].image;
    block.personName = peopleData[block.id].name;
  }
});

export function InteractiveGrid({ userPosition, className = '', onGridClick, showOccupiedLabel = false, showGridNumbers = false }: InteractiveGridProps) {
  const { t, language } = useLanguage();
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
    if (x < 0 && y > 0) return 'bg-red-200 hover:bg-red-300 border-red-300'; // Authoritarian Left
    if (x > 0 && y > 0) return 'bg-blue-200 hover:bg-blue-300 border-blue-300'; // Authoritarian Right  
    if (x < 0 && y < 0) return 'bg-green-200 hover:bg-green-300 border-green-300'; // Libertarian Left
    if (x > 0 && y < 0) return 'bg-purple-200 hover:bg-purple-300 border-purple-300'; // Libertarian Right
    return 'bg-gray-100 hover:bg-gray-200 border-gray-300'; // Center
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
      <div className="grid grid-cols-10 gap-2 sm:gap-3 p-4 sm:p-6 bg-white rounded-lg shadow-lg relative">
        {gridData.map((block) => (
          <motion.div
            key={block.id}
            className={`
              aspect-square relative transition-all duration-200 rounded-md border-2 shadow-sm
              ${block.personImage ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:shadow-md'}
              ${getQuadrantColor(block.x, block.y)}
            `}
            onMouseEnter={(e) => handleBlockHover(block, e)}
            onMouseLeave={handleBlockLeave}
            onClick={(e) => {
              // For mobile - show popup on click
              if ('ontouchstart' in window) {
                handleBlockHover(block, e);
              }
              
              // Handle grid click for suggestions (only if block is not occupied)
              if (onGridClick && !block.personImage) {
                onGridClick(block.x, block.y, block.id);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Person icon for people */}
            {block.personImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-5 h-5 sm:w-4 sm:h-4 text-gray-700 drop-shadow-sm" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
            
            {/* Click indicator for empty blocks */}
            {!block.personImage && !showGridNumbers && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
              </div>
            )}
            
            {/* Grid number display for suggest-politicians page */}
            {showGridNumbers && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600 bg-white bg-opacity-80 px-1 py-0.5 rounded">
                  {block.id}
                </span>
              </div>
            )}
            
            {/* Occupied indicator for blocks with people (optional) */}
            {block.personImage && showOccupiedLabel && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                  {language === 'en' ? 'Occupied' : 'අල්ලාගෙන'}
                </div>
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
              className="w-6 h-6 sm:w-5 sm:h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full border-3 border-white shadow-lg relative"
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
        {/* Authoritarian label at top */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-800">
          {t('authoritarian')}
        </div>
        
        {/* Libertarian label at bottom */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-800">
          {t('libertarian')}
        </div>
        
        {/* Left label */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 text-lg font-semibold text-gray-800">
          {t('left')}
        </div>
        
        {/* Right label */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 text-lg font-semibold text-gray-800">
          {t('right')}
        </div>
        
        {/* Economic scale arrow and label */}
        <div className="absolute left-12 top-1/2 transform -translate-y-1/2 -translate-x-6">
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-lg">←</span>
            <span className="transform -rotate-90 whitespace-nowrap text-sm font-medium">{t('economicScale')}</span>
            <span className="text-lg">→</span>
          </div>
        </div>
        
        {/* Social scale arrow and label */}
        <div className="absolute left-1/2 top-12 transform -translate-x-1/2 -translate-y-6">
          <div className="flex flex-col items-center text-sm text-gray-600">
            <span className="text-lg">↑</span>
            <span className="whitespace-nowrap text-sm font-medium">{t('socialScale')}</span>
            <span className="text-lg">↓</span>
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
                <p className="text-xs text-center mt-1 font-medium text-black">
                  {hoveredBlock.personName}
                </p>
              )}
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
              <p className="text-sm font-semibold">
                🎯 {language === 'si' ? 'ඔබේ තැන ' : 'Your Position'}
              </p>
              <p className="text-xs">
                {language === 'si' ? 'ආර්ථික' : 'Economic'}: {userPosition.x.toFixed(1)}
              </p>
              <p className="text-xs">
                {language === 'si' ? 'සමාජ' : 'Social'}: {userPosition.y.toFixed(1)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}