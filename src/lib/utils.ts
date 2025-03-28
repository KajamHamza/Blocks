
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shortens a blockchain address for display purposes
 * @param address The full address to shorten
 * @param chars The number of characters to show at the beginning and end (default 4)
 * @returns The shortened address
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Formats a date to a readable string
 * @param date The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date | number): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a number with proper thousands separators
 * @param num The number to format
 * @returns A formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}
