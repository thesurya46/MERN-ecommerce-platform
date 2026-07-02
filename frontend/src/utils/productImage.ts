export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80&auto=format&fit=crop';

export function getProductImage(images?: string[]): string {
  const validImage = images?.find((img) => typeof img === 'string' && img.trim().length > 0);
  return validImage || DEFAULT_PRODUCT_IMAGE;
}

export function hasProductImage(images?: string[]): boolean {
  return !!images?.some((img) => typeof img === 'string' && img.trim().length > 0);
}
