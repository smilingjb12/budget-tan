import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEUR(amount: number): string {
  const isWholeNumber = amount % 1 === 0;
  return `€${amount.toLocaleString("en-US", {
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCurrency(amount: number): string {
  return formatEUR(amount);
}

/**
 * Normalizes an item name by trimming whitespace, converting to lowercase,
 * and replacing Polish diacritics with their Latin equivalents.
 */
export function normalizeItemName(value: string): string {
  const polishMap: Record<string, string> = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  };
  return value
    .trim()
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => polishMap[char] || char);
}
