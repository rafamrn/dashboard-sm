
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CircularGaugeProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  size?: "sm" | "md" | "lg";
  thresholds?: {
    warning: number;
    critical: number;
  };
  showAnimation?: boolean;
}

const CircularGauge = ({
  value,
  maxValue,
  label,
  unit,
  size = "md",
  thresholds = { warning: 70, critical: 90 },
  showAnimation = true
}: CircularGaugeProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percent = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  // For animation effect
  useEffect(() => {
    if (!showAnimation) {
      setAnimatedValue(percent);
      return;
    }
    
    const timeout = setTimeout(() => {
      setAnimatedValue(0);
      
      // Start animation after a small delay
      const startAnimation = () => {
        let start = 0;
        const animationDuration = 1000; // 1 second
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / animationDuration, 1);
          setAnimatedValue(progress * percent);
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        
        window.requestAnimationFrame(step);
      };
      
      setTimeout(startAnimation, 100);
    }, 0);
    
    return () => clearTimeout(timeout);
  }, [percent, showAnimation]);
  
  // Calculate size based on prop
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-40 h-40",
    lg: "w-48 h-48"
  };
  
  // Calculate stroke thickness based on size
  const strokeWidth = {
    sm: 8,
    md: 10,
    lg: 12
  };
  
  // Get color based on value and thresholds
  const getColor = () => {
    if (percent >= thresholds.critical) return "stroke-red-500";
    if (percent >= thresholds.warning) return "stroke-yellow-500"; 
    return "stroke-green-500";
  };
  
  // Calculate SVG parameters
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;
  const trackRadius = radius;
  
  return (
    <div className={cn("relative flex flex-col items-center", sizeClasses[size])}>
      <svg 
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 100 100"
      >
        {/* Background track */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700 fill-transparent transition-all"
          cx="50"
          cy="50"
          r={trackRadius}
          strokeWidth={strokeWidth[size]}
        />
        
        {/* Progress arc */}
        <circle
          className={cn("fill-transparent transition-all duration-300", getColor())}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth[size]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
        
        {/* Tick marks */}
        {[...Array(10)].map((_, i) => {
          const angle = (i * 36) * (Math.PI / 180);
          const x1 = 50 + (radius - 5) * Math.cos(angle);
          const y1 = 50 + (radius - 5) * Math.sin(angle);
          const x2 = 50 + (radius + 5) * Math.cos(angle);
          const y2 = 50 + (radius + 5) * Math.sin(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="stroke-gray-300 dark:stroke-gray-600"
              strokeWidth={1}
              transform={`rotate(90 50 50)`}
            />
          );
        })}
      </svg>
      
      {/* Center content */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <div className={cn(
          "flex flex-col items-center",
          size === "sm" ? "space-y-1" : "space-y-2"
        )}>
          <p className={cn(
            "font-bold text-foreground",
            size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl"
          )}>
            {value.toFixed(1)}<span className="text-sm ml-0.5">{unit}</span>
          </p>
          <p className={cn(
            "text-muted-foreground text-center",
            size === "sm" ? "text-xs" : "text-sm"
          )}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CircularGauge;
