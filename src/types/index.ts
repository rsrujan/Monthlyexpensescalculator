
export type ExpenseCategory = 'food' | 'rent' | 'travel' | 'shopping' | 'others';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes: string;
}

export interface ExpenseFormData {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes: string;
}
