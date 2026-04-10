import React from 'react';

interface BramSVGProps {
  status: 'yes' | 'almost' | 'no';
  mousePos: { x: number; y: number };
}

const BramSVG: React.FC<BramSVGProps> = ({ status, mousePos }) => {
  // Eye tracking logic
  const pupilOffset = {
    x: mousePos.x * 5,
    y: mousePos.y * 3,
  };

  const isWarm = status === 'yes';
  const isAlmost = status === 'almost';

  return (
    <svg
      width="300"
      height="450"
      viewBox="0 0 300 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-full h-auto drop-shadow-2xl transition-all duration-700"
    >
      {/* The Bun - slightly wobbly */}
      <path 
        d="M135 45 Q 150 25 165 45 Q 170 65 150 70 Q 130 65 135 45" 
        fill="black" 
        stroke="black" 
        strokeWidth="2" 
      />
      
      {/* Head - wobbly oval */}
      <path 
        d="M110 100 Q 110 60 150 60 Q 190 60 190 100 Q 190 145 150 145 Q 110 145 110 100" 
        fill="white" 
        stroke="black" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Facial Features */}
      {/* Eyeballs (White parts) */}
      <ellipse cx="138" cy="100" rx="8" ry="10" fill="white" stroke="black" strokeWidth="1" />
      <ellipse cx="162" cy="100" rx="8" ry="10" fill="white" stroke="black" strokeWidth="1" />
      
      {/* Pupils (Following cursor) */}
      <circle 
        cx={138 + pupilOffset.x} 
        cy={100 + pupilOffset.y} 
        r="3" 
        fill="black" 
        className="transition-transform duration-75"
      />
      <circle 
        cx={162 + pupilOffset.x} 
        cy={100 + pupilOffset.y} 
        r="3" 
        fill="black" 
        className="transition-transform duration-75"
      />

      {/* Under-eye details */}
      <path d="M133 112 Q 138 115 143 112" stroke="black" strokeWidth="1" />
      <path d="M157 112 Q 162 115 167 112" stroke="black" strokeWidth="1" />

      {/* Mouth & Expression */}
      {status === 'yes' ? (
        <path 
          d="M130 115 Q 150 140 170 115" 
          stroke="black" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
          className="transition-all duration-500"
        />
      ) : status === 'almost' ? (
        <path 
          d="M135 125 L 165 125" 
          stroke="black" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
          className="transition-all duration-500"
        />
      ) : (
        <path 
          d="M135 125 Q 145 120 155 125 Q 165 120 170 125" 
          stroke="black" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
          className="transition-all duration-500"
        />
      )}

      {/* Torso - Shirt */}
      <path 
        d="M110 155 L 190 155 L 200 240 L 100 240 Z" 
        fill={status === 'yes' ? "white" : status === 'almost' ? "#f5f5f5" : "#eee"} 
        stroke="black" 
        strokeWidth="4" 
        strokeLinejoin="round" 
        className="transition-all duration-500"
      />
      
      {/* Arms - Simple lines */}
      {/* Long sleeves if status === 'no', otherwise short sleeves */}
      <path d="M110 165 L 80 210" stroke="black" strokeWidth="4" strokeLinecap="round" />
      <path d="M190 165 L 220 210" stroke="black" strokeWidth="4" strokeLinecap="round" />

      {/* Lower Body */}
      {status === 'yes' ? (
        <>
          <path d="M100 240 L 145 240 L 145 290 L 100 290 Z" fill="white" stroke="black" strokeWidth="4" className="transition-all duration-500" />
          <path d="M155 240 L 200 240 L 200 290 L 155 290 Z" fill="white" stroke="black" strokeWidth="4" className="transition-all duration-500" />
          <path d="M115 290 L 115 360" stroke="black" strokeWidth="4" strokeLinecap="round" />
          <path d="M135 290 L 135 360" stroke="black" strokeWidth="4" strokeLinecap="round" />
          <path d="M165 290 L 165 360" stroke="black" strokeWidth="4" strokeLinecap="round" />
          <path d="M185 290 L 185 360" stroke="black" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M100 240 L 145 240 L 145 370 L 100 370 Z" fill="#eee" stroke="black" strokeWidth="4" className="transition-all duration-500" />
          <path d="M155 240 L 200 240 L 200 370 L 155 370 Z" fill="#eee" stroke="black" strokeWidth="4" className="transition-all duration-500" />
        </>
      )}

      {/* Shoes - Simple black blobs */}
      <path d="M100 360 Q 95 385 145 385 L 145 360 Z" fill="black" stroke="black" strokeWidth="2" />
      <path d="M155 360 L 155 385 Q 205 385 200 360 Z" fill="black" stroke="black" strokeWidth="2" />

      {/* Ground Line */}
      <path d="M50 395 Q 150 405 250 395" stroke="black" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
};

export default BramSVG;
