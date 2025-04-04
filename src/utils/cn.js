import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges class names using clsx and tailwind-merge
 * This allows for conditional class names while also handling Tailwind CSS class conflicts
 * 
 * @param  {...any} inputs - Class names or conditional class objects
 * @returns {string} - The merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 