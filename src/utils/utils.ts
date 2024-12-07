function calculateDiscount(price: number, discount: number): number {
  return price - (price - discount);
}

export { calculateDiscount };
