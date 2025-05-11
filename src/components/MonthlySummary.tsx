
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categoryColors, ExpenseCategoryIcon } from './ExpenseCategory';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface MonthlySummaryProps {
  expenses: Expense[];
  month: Date;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ expenses, month }) => {
  const { totalSpent, categoryTotals, highestSpendingDay } = useMemo(() => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate category totals
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Find highest spending day
    const dailyTotals = expenses.reduce((acc, expense) => {
      const day = expense.date.toDateString();
      acc[day] = (acc[day] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let highestSpendingDay = { date: new Date(), total: 0 };
    
    Object.entries(dailyTotals).forEach(([dateStr, total]) => {
      if (total > highestSpendingDay.total) {
        highestSpendingDay = { 
          date: new Date(dateStr), 
          total 
        };
      }
    });
    
    return { totalSpent, categoryTotals, highestSpendingDay };
  }, [expenses]);
  
  const monthName = month.toLocaleString('default', { month: 'long' });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="col-span-1 md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            {monthName} {month.getFullYear()} Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Total Spent</span>
              <span className="text-3xl font-bold text-primary">{formatCurrency(totalSpent)}</span>
            </div>
            
            {highestSpendingDay.total > 0 && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Highest Spending Day</span>
                <span className="text-xl font-bold">
                  {highestSpendingDay.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  <span className="text-primary ml-2">
                    {formatCurrency(highestSpendingDay.total)}
                  </span>
                </span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 items-center">
              {Object.entries(categoryTotals).map(([category, total]) => (
                <div key={category} className="flex items-center gap-2">
                  <ExpenseCategoryIcon category={category as any} size={20} />
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
