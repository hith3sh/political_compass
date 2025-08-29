'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface QuadrantPieChartProps {
  distribution: Record<string, number>;
  language: 'en' | 'si';
  className?: string;
}

interface ChartSegment {
  quadrant: string;
  count: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
  color: string;
  label: string;
}

const getQuadrantColor = (quadrant: string) => {
  switch (quadrant) {
    case 'libertarian-left':
      return '#EF4444'; // Red
    case 'libertarian-right':
      return '#3B82F6'; // Blue
    case 'authoritarian-left':
      return '#F59E0B'; // Yellow/Orange
    case 'authoritarian-right':
      return '#10B981'; // Green
    case 'centrist':
      return '#8B5CF6'; // Purple
    default:
      return '#6B7280'; // Gray
  }
};

const getQuadrantLabel = (quadrant: string, language: 'en' | 'si') => {
  const labels = {
    'libertarian-left': {
      en: 'Libertarian Left',
      si: 'NPP ජෙප්පෙක්'
    },
    'libertarian-right': {
      en: 'Libertarian Right', 
      si: 'ටොයියෙක්'
    },
    'authoritarian-left': {
      en: 'Authoritarian Left',
      si: 'පරණ ජෙප්පෙක්'
    },
    'authoritarian-right': {
      en: 'Authoritarian Right',
      si: 'බයියෙක්'
    },
    'centrist': {
      en: 'Centrist',
      si: 'මධ්‍යස්ථවාදී'
    }
  };
  
  return labels[quadrant as keyof typeof labels]?.[language] || quadrant;
};

const createPath = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", cx, cy, 
    "L", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

export const QuadrantPieChart: React.FC<QuadrantPieChartProps> = ({ 
  distribution, 
  language,
  className = ''
}) => {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div className={`flex items-center justify-center p-8 text-gray-500 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p>{language === 'en' ? 'No data available' : 'දත්ත නැත'}</p>
        </div>
      </div>
    );
  }

  let currentAngle = 0;
  const segments: ChartSegment[] = Object.entries(distribution)
    .map(([quadrant, count]) => {
      const percentage = (count / total) * 100;
      const angle = (count / total) * 360;
      
      const segment: ChartSegment = {
        quadrant,
        count,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: getQuadrantColor(quadrant),
        label: getQuadrantLabel(quadrant, language)
      };
      
      currentAngle += angle;
      return segment;
    })
    .filter(segment => segment.count > 0); // Only show segments with data

  const cx = 150;
  const cy = 150;
  const radius = 120;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* SVG Pie Chart */}
        <div className="flex-shrink-0">
          <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-sm">
            {segments.map((segment, index) => (
              <g key={segment.quadrant}>
                <title>{`${segment.label}: ${segment.count} (${segment.percentage.toFixed(1)}%)`}</title>
                <motion.path
                  d={createPath(cx, cy, radius, segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              </g>
            ))}
            
            {/* Center circle */}
            <circle
              cx={cx}
              cy={cy}
              r="45"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            
            {/* Center text */}
            <text
              x={cx}
              y={cy - 5}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-700"
            >
              {language === 'en' ? 'Total' : 'මුළු'}
            </text>
            <text
              x={cx}
              y={cy + 15}
              textAnchor="middle"
              className="text-lg font-bold fill-gray-900"
            >
              {total}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {language === 'en' ? 'Political Distribution' : 'දේශපාලන ව්‍යාප්තිය'}
          </h3>
          
          {segments
            .sort((a, b) => b.percentage - a.percentage) // Sort by percentage descending
            .map((segment, index) => (
              <motion.div
                key={segment.quadrant}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="font-medium text-gray-700 text-sm lg:text-base">
                    {segment.label}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {segment.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {segment.count} {language === 'en' ? 'people' : 'දෙනා'}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};