
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
