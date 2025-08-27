'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Result } from '../lib/types';
import { formatScore } from '../lib/utils';

interface PoliticalCompassProps {
  result?: Result;
  size?: number;
  showLabels?: boolean;
  showPosition?: boolean;
}

export function PoliticalCompass({ 
  result, 
  size = 400, 
  showLabels = true, 
  showPosition = true 
}: PoliticalCompassProps) {
  const center = size / 2;
  const gridSize = size * 0.8;
  const gridOffset = size * 0.1;

  // Convert political coordinates (-10 to +10) to pixel coordinates
  const getPixelPosition = (economic: number, social: number) => {
    const x = center + (economic / 10) * (gridSize / 2);
    const y = center - (social / 10) * (gridSize / 2); // Negative because SVG y increases downward
    return { x, y };
  };

  const position = result ? getPixelPosition(result.economic, result.social) : null;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="border border-gray-300 rounded-lg">
        {/* Background quadrants */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        
        {/* Grid background */}
        <rect width={size} height={size} fill="url(#grid)" />
        
        {/* Quadrant colors (subtle) */}
        <rect x={0} y={0} width={center} height={center} fill="#fef3c7" opacity={0.3} />
        <rect x={center} y={0} width={center} height={center} fill="#ddd6fe" opacity={0.3} />
        <rect x={0} y={center} width={center} height={center} fill="#fecaca" opacity={0.3} />
        <rect x={center} y={center} width={center} height={center} fill="#bbf7d0" opacity={0.3} />
        
        {/* Main axes */}
        <line x1={0} y1={center} x2={size} y2={center} stroke="#374151" strokeWidth="2" />
        <line x1={center} y1={0} x2={center} y2={size} stroke="#374151" strokeWidth="2" />
        
        {/* Quadrant labels */}
        {showLabels && (
          <>
            <text x={center/2} y={center/2} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-700 text-sm font-medium">
              Liberal
            </text>
            <text x={center + center/2} y={center/2} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-700 text-sm font-medium">
              Liberal
            </text>
            <text x={center/2} y={center + center/2} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-700 text-sm font-medium">
              Conservative
            </text>
            <text x={center + center/2} y={center + center/2} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-700 text-sm font-medium">
              Conservative
            </text>
            
            {/* Smaller quadrant labels */}
            <text x={center/2} y={center/2 + 15} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-600 text-xs">
              Socialist
            </text>
            <text x={center + center/2} y={center/2 + 15} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-600 text-xs">
              Capitalist
            </text>
            <text x={center/2} y={center + center/2 + 15} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-600 text-xs">
              Socialist
            </text>
            <text x={center + center/2} y={center + center/2 + 15} textAnchor="middle" dominantBaseline="middle" 
                  className="fill-gray-600 text-xs">
              Capitalist
            </text>
          </>
        )}
        
        {/* Axis labels */}
        {showLabels && (
          <>
            <text x={20} y={center - 10} className="fill-gray-600 text-xs font-medium">Left</text>
            <text x={size - 30} y={center - 10} className="fill-gray-600 text-xs font-medium">Right</text>
            <text x={center + 10} y={20} className="fill-gray-600 text-xs font-medium">Libertarian</text>
            <text x={center + 10} y={size - 10} className="fill-gray-600 text-xs font-medium">Authoritarian</text>
          </>
        )}
        
        {/* User position */}
        {showPosition && position && (
          <motion.circle
            cx={position.x}
            cy={position.y}
            r="8"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          />
        )}
      </svg>
      
      {/* Score display */}
      {result && showPosition && (
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-sm text-gray-600 mb-2">
            Economic: <span className="font-semibold">{formatScore(result.economic)}</span> | 
            Social: <span className="font-semibold">{formatScore(result.social)}</span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {result.quadrant.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
        </motion.div>
      )}
    </div>
  );
}