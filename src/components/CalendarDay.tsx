
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ExpenseCard } from './ExpenseCard';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CalendarDayProps {
  date: Date;
  expenses: Expense[];
  onAddExpense: (date: Date) => void;
  onEditExpense: (id: string) => void;
  onDeleteExpense: (id: string) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) => {
  const isToday = new Date().toDateString() === date.toDateString();
  const totalForDay = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <Card className={`h-full flex flex-col ${isToday ? 'border-primary border-2' : ''}`}>
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-medium">{date.getDate()}</span>
            <span className="text-sm text-muted-foreground ml-2">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
          </div>
          {totalForDay > 0 && (
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(totalForDay)}</p>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow py-2 px-4">
        <div className="space-y-2">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              id={expense.id}
              amount={expense.amount}
              category={expense.category}
              date={expense.date}
              notes={expense.notes}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="py-2 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-primary hover:text-primary hover:bg-primary/10"
          onClick={() => onAddExpense(date)}
        >
          <Plus size={16} className="mr-1" /> Add Expense
        </Button>
      </CardFooter>
    </Card>
  );
};
