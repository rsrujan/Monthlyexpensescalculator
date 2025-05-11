
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}) => {
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <Button variant="outline" size="sm" onClick={onPreviousMonth}>
        <ChevronLeft size={18} />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </Button>
      
      <h2 className="text-2xl font-bold text-center">
        {monthName} {year}
      </h2>
      
      <Button variant="outline" size="sm" onClick={onNextMonth}>
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};
