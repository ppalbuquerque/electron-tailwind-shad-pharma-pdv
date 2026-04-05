function formatMoney(amount: number): string {
  const formatted = new Intl.NumberFormat('pt-Br', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)

  return formatted
}

function formatMoneyFromCents(cents: number): string {
  return formatMoney(cents / 100)
}

export { formatMoney, formatMoneyFromCents }
