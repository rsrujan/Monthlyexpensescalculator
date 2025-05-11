
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
