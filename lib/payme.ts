// Payme (paycom.uz) integration helpers

export const PAYME_MERCHANT_ID = process.env.PAYME_MERCHANT_ID!
export const PAYME_SECRET_KEY = process.env.PAYME_SECRET_KEY!

// Amount is in UZS sum → convert to tiyins (×100)
export function sumToTiyin(sum: number): number {
  return Math.round(sum * 100)
}

// Generate Payme checkout URL
export function paymeCheckoutUrl(paymentId: string, amountInSum: number): string {
  const params = `m=${PAYME_MERCHANT_ID};ac.payment_id=${paymentId};a=${sumToTiyin(amountInSum)}`
  const encoded = Buffer.from(params).toString('base64')
  return `https://checkout.paycom.uz/${encoded}`
}

// Verify Payme webhook Authorization header
export function verifyPaymeAuth(authHeader: string | null): boolean {
  if (!authHeader) return false
  const expected = Buffer.from(`Paycom:${PAYME_SECRET_KEY}`).toString('base64')
  return authHeader === `Basic ${expected}`
}

export const PaymeError = {
  TRANSACTION_NOT_FOUND:   { code: -31003, message: { ru: 'Транзакция не найдена' } },
  WRONG_AMOUNT:            { code: -31001, message: { ru: 'Неверная сумма' } },
  ORDER_NOT_FOUND:         { code: -31050, message: { ru: 'Заказ не найден' } },
  CANT_PERFORM:            { code: -31008, message: { ru: 'Нельзя выполнить операцию' } },
  CANT_CANCEL:             { code: -31007, message: { ru: 'Нельзя отменить' } },
}
