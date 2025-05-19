
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PowerGaugeProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  color?: string;
}

const PowerGauge = ({ value, maxValue, label, unit, color = "#3b82f6" }: PowerGaugeProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    // Animate from current value to new value
    setCurrentValue(value);
  }, [value]);
  
  // Calculate percentage and angle
  const percentage = (currentValue / maxValue) * 100;
  const angle = (percentage / 100) * 180;
  
  // Calculate arc path
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (angle / 180) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium text-center mb-2">{label}</div>
      <div className="relative flex items-center justify-center">
        <svg width="170" height="170" viewBox="0 0 170 170">
          {/* Background arc */}
          <path
            d="M 85,135 m -80,0 a 80,80 0 1,1 160,0"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Colored arc */}
          <motion.path
            d="M 85,135 m -80,0 a 80,80 0 1,1 160,0"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          
          {/* Needle */}
          <motion.line
            x1="85"
            y1="135"
            x2="85"
            y2="65"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ transform: "rotate(-90deg)", transformOrigin: "85px 135px" }}
            animate={{ transform: `rotate(${angle - 90}deg)` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          
          {/* Needle center */}
          <circle cx="85" cy="135" r="4" fill="#374151" />
        </svg>
        
        {/* Value display */}
        <motion.div
          className="absolute font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={value}
        >
          {Math.round(currentValue)}{unit}
        </motion.div>
        
        {/* Percentage markers */}
        <div className="absolute top-10 left-10 text-xs text-gray-500">0%</div>
        <div className="absolute top-10 right-10 text-xs text-gray-500">100%</div>
      </div>
    </div>
  );
};

export default PowerGauge;
