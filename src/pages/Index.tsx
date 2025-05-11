
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDay } from '@/components/CalendarDay';
import { MonthlySummary } from '@/components/MonthlySummary';
import { MonthNavigation } from '@/components/MonthNavigation';
import { ExpenseDialog } from '@/components/ExpenseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { generateCalendarDays } from '@/lib/date-utils';
import { Expense, ExpenseFormData } from '@/types';
import * as expenseService from '@/services/expenseService';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  // Queries
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses', currentMonth.getFullYear(), currentMonth.getMonth()],
    queryFn: () => expenseService.getExpensesByMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    ),
  });
  
  // Mutations
  const addMutation = useMutation({
    mutationFn: expenseService.addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['expenses', currentMonth.getFullYear(), currentMonth.getMonth()] 
      });
      toast({ title: "Expense added successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to add expense", 
        description: error instanceof Error ? error.message : "An error occurred", 
        variant: "destructive" 
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: expenseService.updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['expenses', currentMonth.getFullYear(), currentMonth.getMonth()] 
      });
      toast({ title: "Expense updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update expense", 
        description: error instanceof Error ? error.message : "An error occurred", 
        variant: "destructive" 
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: expenseService.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['expenses', currentMonth.getFullYear(), currentMonth.getMonth()] 
      });
      toast({ title: "Expense deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to delete expense", 
        description: error instanceof Error ? error.message : "An error occurred", 
        variant: "destructive" 
      });
    },
  });
  
  // Handlers
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };
  
  const handleAddExpense = (date?: Date) => {
    setSelectedExpense(undefined);
    setSelectedDate(date || new Date());
    setDialogOpen(true);
  };
  
  const handleEditExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setDialogOpen(true);
    }
  };
  
  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleSaveExpense = (formData: ExpenseFormData) => {
    if (formData.id) {
      updateMutation.mutate(formData);
    } else {
      addMutation.mutate(formData);
    }
    setDialogOpen(false);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedExpense(undefined);
  };
  
  // Calendar generation
  const calendarDays = generateCalendarDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );
  
  // Group expenses by day
  const expensesByDay = calendarDays.map(day => {
    const dayExpenses = expenses.filter(expense => 
      expense.date.getDate() === day.getDate() &&
      expense.date.getMonth() === day.getMonth() &&
      expense.date.getFullYear() === day.getFullYear()
    );
    
    return {
      date: day,
      expenses: dayExpenses
    };
  });
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8 text-red-500">
          Error loading expenses. Please try again later.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Monthly Expenses Tracker</h1>
        <ThemeToggle />
      </div>
      
      {/* Month navigation */}
      <MonthNavigation
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      
      {/* Monthly summary */}
      <MonthlySummary expenses={expenses} month={currentMonth} />
      
      {/* Quick add expense button */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => handleAddExpense()} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Plus size={18} className="mr-1" /> Add New Expense
        </Button>
      </div>
      
      {/* Calendar grid */}
      {isLoading ? (
        <div className="text-center p-8">Loading expenses...</div>
      ) : (
        <div className="calendar-grid">
          {expensesByDay.map(({ date, expenses }) => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          ))}
        </div>
      )}
      
      {/* Expense dialog */}
      <ExpenseDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveExpense}
        expense={selectedExpense}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Index;
