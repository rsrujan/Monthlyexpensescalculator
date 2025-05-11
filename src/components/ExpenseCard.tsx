
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseCategoryIcon, ExpenseCategory } from './ExpenseCategory';
import { formatCurrency } from '@/lib/formatters';

interface ExpenseCardProps {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  id,
  amount,
  category,
  notes,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ExpenseCategoryIcon category={category} size={20} />
          <div>
            <p className="font-medium">{formatCurrency(amount)}</p>
            {notes && <p className="text-sm text-muted-foreground truncate max-w-[180px]">{notes}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(id)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
