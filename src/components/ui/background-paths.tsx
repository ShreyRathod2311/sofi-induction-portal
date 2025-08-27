import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundPathsProps {
  className?: string;
  pathColor?: string;
  pathOpacity?: number;
  animated?: boolean;
}

export const BackgroundPaths: React.FC<BackgroundPathsProps> = ({
  className,
  pathColor = "currentColor",
  pathOpacity = 0.3,
  animated = true
}) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pathColor} stopOpacity={pathOpacity * 0.5} />
            <stop offset="50%" stopColor={pathColor} stopOpacity={pathOpacity} />
            <stop offset="100%" stopColor={pathColor} stopOpacity={pathOpacity * 0.3} />
          </linearGradient>
        </defs>
        
        {/* Animated flowing paths */}
        <path
          d="M-100,200 Q200,100 400,200 T800,150 Q1000,100 1300,200"
          stroke="url(#pathGradient)"
          strokeWidth="2"
          fill="none"
          className={animated ? "animate-pulse" : ""}
          style={{
            animationDuration: "4s",
            animationDelay: "0s"
          }}
        />
        
        <path
          d="M-50,400 Q300,300 600,400 T1200,350"
          stroke="url(#pathGradient)"
          strokeWidth="1.5"
          fill="none"
          className={animated ? "animate-pulse" : ""}
          style={{
            animationDuration: "6s",
            animationDelay: "1s"
          }}
        />
        
        <path
          d="M100,600 Q400,500 700,600 T1100,550"
          stroke="url(#pathGradient)"
          strokeWidth="1"
          fill="none"
          className={animated ? "animate-pulse" : ""}
          style={{
            animationDuration: "5s",
            animationDelay: "2s"
          }}
        />
        
        {/* Geometric patterns */}
        <circle
          cx="200"
          cy="150"
          r="3"
          fill={pathColor}
          fillOpacity={pathOpacity}
          className={animated ? "animate-ping" : ""}
          style={{
            animationDuration: "3s",
            animationDelay: "0.5s"
          }}
        />
        
        <circle
          cx="800"
          cy="300"
          r="2"
          fill={pathColor}
          fillOpacity={pathOpacity}
          className={animated ? "animate-ping" : ""}
          style={{
            animationDuration: "4s",
            animationDelay: "1.5s"
          }}
        />
        
        <circle
          cx="600"
          cy="500"
          r="2.5"
          fill={pathColor}
          fillOpacity={pathOpacity}
          className={animated ? "animate-ping" : ""}
          style={{
            animationDuration: "3.5s",
            animationDelay: "2.5s"
          }}
        />
      </svg>
    </div>
  );
};
