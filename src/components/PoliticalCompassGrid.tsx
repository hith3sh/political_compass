'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GridResult, getBlockInfo, getGridPositionDescription } from '../lib/gridScoring';

interface PoliticalCompassGridProps {
  result?: GridResult;
  size?: number;
  showLabels?: boolean;
  showPosition?: boolean;
  showGrid?: boolean;
}

export function PoliticalCompassGrid({ 
  result, 
  size = 500, 
  showLabels = true, 
  showPosition = true,
  showGrid = true
}: PoliticalCompassGridProps) {
  const blockSize = size / 10; // Each block is 1/10th of the total size
  const center = size / 2;

  // Generate the 100 blocks
  const renderBlocks = () => {
    const blocks = [];
    
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const blockNumber = y * 10 + x;
        const blockInfo = getBlockInfo(blockNumber);
        
        // Determine block color based on quadrant
        let fillColor = '#ffffff';
        let opacity = 0.1;
        
        if (showGrid) {
          switch (blockInfo.quadrant) {
            case 'authoritarian-left':
              fillColor = '#fef3c7'; // Yellow/Socialist
              break;
            case 'authoritarian-right':
              fillColor = '#bbf7d0'; // Green/Authoritarian Capitalist
              break;
            case 'libertarian-left':
              fillColor = '#fecaca'; // Red/Liberal Socialist
              break;
            case 'libertarian-right':
              fillColor = '#ddd6fe'; // Purple/Liberal Capitalist
              break;
          }
        }

        // Highlight user's block
        const isUserBlock = result && 
          result.gridPosition.x === x && 
          result.gridPosition.y === y;
        
        if (isUserBlock) {
          opacity = 0.8;
        }

        blocks.push(
          <rect
            key={blockNumber}
            x={x * blockSize}
            y={y * blockSize}
            width={blockSize}
            height={blockSize}
            fill={fillColor}
            opacity={opacity}
            stroke={showGrid ? '#e5e7eb' : 'none'}
            strokeWidth={showGrid ? 0.5 : 0}
            className={isUserBlock ? 'animate-pulse' : ''}
          />
        );
      }
    }
    
    return blocks;
  };

  return (
    <div className="flex flex-col items-center">
      <svg 
        width={size} 
        height={size} 
        className="border-2 border-gray-300 rounded-lg shadow-lg"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Render the 100 blocks */}
        {renderBlocks()}
        
        {/* Main axes - thicker lines */}
        <line 
          x1={0} 
          y1={center} 
          x2={size} 
          y2={center} 
          stroke="#374151" 
          strokeWidth="3" 
        />
        <line 
          x1={center} 
          y1={0} 
          x2={center} 
          y2={size} 
          stroke="#374151" 
          strokeWidth="3" 
        />
        
        {/* Quadrant dividers - medium lines */}
        <line 
          x1={center} 
          y1={0} 
          x2={center} 
          y2={size} 
          stroke="#6b7280" 
          strokeWidth="2" 
        />
        <line 
          x1={0} 
          y1={center} 
          x2={size} 
          y2={center} 
          stroke="#6b7280" 
          strokeWidth="2" 
        />
        
        {/* Quadrant labels */}
        {showLabels && (
          <>
            {/* Top-Left: Authoritarian Left */}
            <text 
              x={center / 2} 
              y={center / 2 - 20} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-700 text-sm font-bold"
            >
              Authoritarian
            </text>
            <text 
              x={center / 2} 
              y={center / 2} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-600 text-xs"
            >
              Socialist
            </text>
            
            {/* Top-Right: Authoritarian Right */}
            <text 
              x={center + center / 2} 
              y={center / 2 - 20} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-700 text-sm font-bold"
            >
              Authoritarian
            </text>
            <text 
              x={center + center / 2} 
              y={center / 2} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-600 text-xs"
            >
              Capitalist
            </text>
            
            {/* Bottom-Left: Libertarian Left */}
            <text 
              x={center / 2} 
              y={center + center / 2 - 20} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-700 text-sm font-bold"
            >
              Liberal
            </text>
            <text 
              x={center / 2} 
              y={center + center / 2} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-600 text-xs"
            >
              Socialist
            </text>
            
            {/* Bottom-Right: Libertarian Right */}
            <text 
              x={center + center / 2} 
              y={center + center / 2 - 20} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-700 text-sm font-bold"
            >
              Liberal
            </text>
            <text 
              x={center + center / 2} 
              y={center + center / 2} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-600 text-xs"
            >
              Capitalist
            </text>
          </>
        )}
        
        {/* Axis labels */}
        {showLabels && (
          <>
            <text x={15} y={center - 10} className="fill-gray-600 text-xs font-medium">
              Left
            </text>
            <text x={size - 35} y={center - 10} className="fill-gray-600 text-xs font-medium">
              Right
            </text>
            <text x={center + 10} y={20} className="fill-gray-600 text-xs font-medium">
              Libertarian
            </text>
            <text x={center + 10} y={size - 10} className="fill-gray-600 text-xs font-medium">
              Authoritarian
            </text>
          </>
        )}
        
        {/* User position - enhanced marker */}
        {showPosition && result && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            {/* Outer ring */}
            <circle
              cx={result.gridPosition.x * blockSize + blockSize / 2}
              cy={result.gridPosition.y * blockSize + blockSize / 2}
              r="15"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              opacity={0.7}
            />
            {/* Inner dot */}
            <circle
              cx={result.gridPosition.x * blockSize + blockSize / 2}
              cy={result.gridPosition.y * blockSize + blockSize / 2}
              r="8"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </motion.g>
        )}
      </svg>
      
      {/* Enhanced score display */}
      {result && showPosition && (
        <motion.div 
          className="mt-6 text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Grid position info */}
          <div className="bg-white rounded-lg p-4 shadow-md border">
            <div className="text-xs text-gray-500 mb-1">Grid Position</div>
            <div className="text-lg font-bold text-blue-600">
              Block {result.gridPosition.block} 
              <span className="text-sm text-gray-600 ml-2">
                ({result.gridPosition.x}, {result.gridPosition.y})
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Quadrant Block: {result.gridPosition.quadrantBlock}/24
            </div>
          </div>

          {/* Traditional scores */}
          <div className="bg-white rounded-lg p-4 shadow-md border">
            <div className="text-sm text-gray-600 mb-2">Traditional Scores</div>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-xs text-gray-500">Economic</div>
                <div className="text-lg font-semibold text-blue-600">
                  {result.economic > 0 ? '+' : ''}{result.economic}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Social</div>
                <div className="text-lg font-semibold text-purple-600">
                  {result.social > 0 ? '+' : ''}{result.social}
                </div>
              </div>
            </div>
          </div>

          {/* Political description */}
          <div className="bg-white rounded-lg p-4 shadow-md border">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {result.quadrant.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
            <div className="text-sm text-gray-600">
              {getGridPositionDescription(result.gridPosition)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}