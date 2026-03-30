function formatMoney(amount: number): string {
  const formatted = new Intl.NumberFormat('pt-Br', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)

  return formatted
}

export { formatMoney }
