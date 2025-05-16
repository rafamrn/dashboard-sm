
import React from "react";

interface StatusGaugeProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
}

const StatusGauge = ({ value, maxValue, label, unit }: StatusGaugeProps) => {
  // Calculate percentage for the gauge
  const percentage = (value / maxValue) * 100;
  const angle = (percentage / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium text-center mb-2">{label}</div>
      <div className="relative w-32 h-16 overflow-hidden">
        {/* Gauge background */}
        <div className="absolute w-32 h-32 -bottom-0 rounded-full border-8 border-gray-200"></div>
        
        {/* Gauge fill */}
        <div
          className="absolute w-32 h-32 -bottom-0 rounded-full border-8 border-primary"
          style={{
            clipPath: `polygon(50% 50%, 0 50%, ${angle <= 90 ? `${angle}% ${100 - angle}%` : '100% 0'}, ${angle > 90 ? `${100 - (angle - 90)}% 0` : ''}, 50% 50%)`,
          }}
        ></div>
        
        {/* Center point */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
        
        {/* Value */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold">
          {value} {unit}
        </div>
      </div>
    </div>
  );
};

export default StatusGauge;
