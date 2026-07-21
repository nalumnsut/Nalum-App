import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional NativeWind class names without duplicated Tailwind rules. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
