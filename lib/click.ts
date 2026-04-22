import crypto from 'crypto'

export const CLICK_SERVICE_ID = process.env.CLICK_SERVICE_ID!
export const CLICK_MERCHANT_ID = process.env.CLICK_MERCHANT_ID!
export const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY!

// Generate Click checkout URL
export function clickCheckoutUrl(paymentId: string, amountInSum: number): string {
  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/orders`
  const params = new URLSearchParams({
    service_id: CLICK_SERVICE_ID,
    merchant_id: CLICK_MERCHANT_ID,
    amount: String(amountInSum),
    transaction_param: paymentId,
    return_url: returnUrl,
  })
  return `https://my.click.uz/services/pay?${params}`
}

// Verify Click webhook signature
export function verifyClickSign(params: {
  click_trans_id: string
  service_id: string
  merchant_trans_id: string
  amount: string
  action: string
  sign_time: string
  sign_string: string
}): boolean {
  const raw = [
    params.click_trans_id,
    params.service_id,
    CLICK_SECRET_KEY,
    params.merchant_trans_id,
    params.amount,
    params.action,
    params.sign_time,
  ].join('')
  const expected = crypto.createHash('md5').update(raw).digest('hex')
  return expected === params.sign_string
}
