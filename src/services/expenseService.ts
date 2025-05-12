
import { Expense, ExpenseFormData } from '@/types';
import { supabase } from '@/lib/supabase';

// Convert the Supabase response to an Expense object
const mapToExpense = (expense: any): Expense => {
  return {
    ...expense,
    date: new Date(expense.date),
  };
};

export const getExpensesByMonth = async (year: number, month: number): Promise<Expense[]> => {
  try {
    // Calculate the start and end dates for the month
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
    
    // Map the data to our Expense type
    return (data || []).map(mapToExpense);
  } catch (error) {
    console.error('Failed to get expenses by month', error);
    
    // Fall back to localStorage if Supabase fails or during development
    const storedData = localStorage.getItem('expense-tracker-data');
    if (storedData) {
      try {
        const expenses = JSON.parse(storedData).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
        
        return expenses.filter(expense => {
          const expenseDate = expense.date;
          return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
        });
      } catch (err) {
        console.error('Failed to parse stored expenses', err);
      }
    }
    return [];
  }
};

export const addExpense = async (expenseData: ExpenseFormData): Promise<Expense> => {
  try {
    const newExpense = {
      ...expenseData,
      id: expenseData.id || crypto.randomUUID(),
      date: expenseData.date.toISOString().split('T')[0],
    };
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([newExpense])
      .select()
      .single();
      
    if (error) throw error;
    
    return mapToExpense(data);
  } catch (error) {
    console.error('Failed to add expense', error);
    
    // Fall back to localStorage
    const storedData = localStorage.getItem('expense-tracker-data');
    const expenses = storedData ? JSON.parse(storedData) : [];
    
    const newExpense = {
      ...expenseData,
      id: expenseData.id || Date.now().toString(),
    };
    
    expenses.push(newExpense);
    localStorage.setItem('expense-tracker-data', JSON.stringify(expenses));
    
    return newExpense as Expense;
  }
};

export const updateExpense = async (expenseData: ExpenseFormData): Promise<Expense> => {
  try {
    const updatedExpense = {
      ...expenseData,
      date: expenseData.date.toISOString().split('T')[0],
    };
    
    const { data, error } = await supabase
      .from('expenses')
      .update(updatedExpense)
      .eq('id', expenseData.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapToExpense(data);
  } catch (error) {
    console.error('Failed to update expense', error);
    
    // Fall back to localStorage
    const storedData = localStorage.getItem('expense-tracker-data');
    if (!storedData) return expenseData as Expense;
    
    const expenses = JSON.parse(storedData);
    const updatedExpenses = expenses.map((expense: any) => 
      expense.id === expenseData.id ? { ...expenseData } : expense
    );
    
    localStorage.setItem('expense-tracker-data', JSON.stringify(updatedExpenses));
    
    return expenseData as Expense;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete expense', error);
    
    // Fall back to localStorage
    const storedData = localStorage.getItem('expense-tracker-data');
    if (!storedData) return;
    
    const expenses = JSON.parse(storedData);
    const filteredExpenses = expenses.filter((expense: any) => expense.id !== id);
    
    localStorage.setItem('expense-tracker-data', JSON.stringify(filteredExpenses));
  }
};
