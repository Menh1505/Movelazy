// Importing 'ClassValue' type and 'clsx' function from the 'clsx' library
import { type ClassValue, clsx } from "clsx"
// Importing 'twMerge' function from the 'tailwind-merge' library
import { twMerge } from "tailwind-merge"

// Defining a utility function 'cn' that combines and merges class names
export function cn(...inputs: ClassValue[]) {
    // Using 'clsx' to combine class names and 'twMerge' to merge Tailwind CSS classes
    return twMerge(clsx(inputs))
}
