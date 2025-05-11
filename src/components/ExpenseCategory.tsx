
import React from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart, Home, Plane, Utensils, CircleDollarSign } from 'lucide-react';

export type ExpenseCategory = 'food' | 'rent' | 'travel' | 'shopping' | 'others';

interface ExpenseCategoryProps {
  category: ExpenseCategory;
  className?: string;
  size?: number;
}

export const categoryIcons = {
  food: Utensils,
  rent: Home,
  travel: Plane,
  shopping: ShoppingCart,
  others: CircleDollarSign,
};

export const categoryColors = {
  food: 'bg-expense-food text-white',
  rent: 'bg-expense-rent text-white',
  travel: 'bg-expense-travel text-black',
  shopping: 'bg-expense-shopping text-white',
  others: 'bg-expense-others text-white',
};

export const ExpenseCategoryIcon: React.FC<ExpenseCategoryProps> = ({
  category,
  className,
  size = 16,
}) => {
  const Icon = categoryIcons[category];
  
  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full p-1.5',
        categoryColors[category],
        className
      )}
    >
      <Icon size={size} />
    </div>
  );
};
