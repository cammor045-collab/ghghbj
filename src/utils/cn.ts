type ClassValue = string | number | null | false | undefined;

/**
 * Une clases condicionalmente sin dependencias externas.
 * Filtra valores falsy y colapsa espacios.
 */
export function cn(...values: ClassValue[]): string {
  return values
    .filter((v): v is string | number => Boolean(v))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
