
import React from 'react';

interface EdgeProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

const Edge: React.FC<EdgeProps> = ({ sourceX, sourceY, targetX, targetY }) => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  
  const pathData = `M ${sourceX},${sourceY} C ${sourceX + dx / 2},${sourceY} ${sourceX + dx / 2},${targetY} ${targetX},${targetY}`;

  return (
    <g>
      <path d={pathData} stroke="#9CA3AF" strokeWidth="2" fill="none" />
      <circle cx={targetX} cy={targetY} r="4" fill="#9CA3AF" />
    </g>
  );
};

export default Edge;
