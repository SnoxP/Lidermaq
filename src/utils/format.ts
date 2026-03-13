export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const calculateInstallments = (price: number, count: number = 12) => {
  if (!price || price <= 0) return 'Consulte condições';
  const installmentPrice = price / count;
  return `até ${count}x de ${formatCurrency(installmentPrice)}`;
};
