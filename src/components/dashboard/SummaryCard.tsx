
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const SummaryCard = ({ title, value, icon, description, trend }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <motion.div 
          className="h-4 w-4 text-muted-foreground"
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="text-2xl font-bold"
          initial={{ opacity: 0.9, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {value}
        </motion.div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <motion.div 
            className={`flex items-center mt-1 text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
