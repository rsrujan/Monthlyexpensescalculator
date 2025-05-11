
import { Expense, ExpenseFormData } from '@/types';

// This is a mock service that would be replaced with actual API calls
// when backend is implemented

const STORAGE_KEY = 'expense-tracker-data';

const getStoredExpenses = (): Expense[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    const parsed = JSON.parse(storedData);
    return parsed.map((expense: any) => ({
      ...expense,
      date: new Date(expense.date)
    }));
  } catch (error) {
    console.error('Failed to parse stored expenses', error);
    return [];
  }
};

const storeExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

export const getExpensesByMonth = async (year: number, month: number): Promise<Expense[]> => {
  const expenses = getStoredExpenses();
  
  return expenses.filter(expense => {
    const expenseDate = expense.date;
    return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
  });
};

export const addExpense = async (expenseData: ExpenseFormData): Promise<Expense> => {
  const expenses = getStoredExpenses();
  
  const newExpense: Expense = {
    ...expenseData,
    id: expenseData.id || Date.now().toString(),
  };
  
  expenses.push(newExpense);
  storeExpenses(expenses);
  
  return newExpense;
};

export const updateExpense = async (expenseData: ExpenseFormData): Promise<Expense> => {
  const expenses = getStoredExpenses();
  
  const updatedExpenses = expenses.map(expense => 
    expense.id === expenseData.id ? { ...expenseData } : expense
  );
  
  storeExpenses(updatedExpenses);
  
  return expenseData as Expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const expenses = getStoredExpenses();
  
  const filteredExpenses = expenses.filter(expense => expense.id !== id);
  
  storeExpenses(filteredExpenses);
};
