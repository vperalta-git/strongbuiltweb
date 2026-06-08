export const QUOTE_CONTEXT_STORAGE_KEY = "tracmac.quote.context"
export const QUOTE_CONTEXT_EVENT = "tracmac:quote-context"

export type QuoteContext = {
  type: "category" | "product" | "general"
  value: string
}

export function createQuoteMessage(context: QuoteContext) {
  const label =
    context.type === "product"
      ? `Product inquiry: ${context.value}`
      : context.type === "category"
        ? `Category inquiry: ${context.value}`
        : "General PPE inquiry"

  return `${label}\n\nQuantity needed:\nDelivery location:\nOther requirements:`
}
