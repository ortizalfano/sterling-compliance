import React from 'react';

interface SterlingLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SterlingLogo({ className = '', size = 'md' }: SterlingLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Yellow pinwheel/logo design */}
        <g>
          {/* Top-left triangle */}
          <path
            d="M16 4L28 16L16 16L4 4L16 4Z"
            fill="#FFD700"
            className="drop-shadow-sm"
          />
          
          {/* Top-right trapezoid */}
          <path
            d="M16 4L28 16L28 28L20 20L16 4Z"
            fill="#FFA500"
            className="drop-shadow-sm"
          />
          
          {/* Bottom-left trapezoid */}
          <path
            d="M4 4L16 16L12 20L4 28L4 4Z"
            fill="#FFA500"
            className="drop-shadow-sm"
          />
          
          {/* Bottom-right triangle */}
          <path
            d="M16 16L28 16L20 20L12 20L16 16Z"
            fill="#FFD700"
            className="drop-shadow-sm"
          />
          
          {/* Central black square */}
          <rect
            x="14"
            y="14"
            width="4"
            height="4"
            fill="#1a1a1a"
            className="drop-shadow-sm"
          />
        </g>
      </svg>
    </div>
  );
}




