import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMilliseconds(seconds: number) {
  const minutes = Math.floor(seconds / 60); // Convert seconds to minutes
  const remainingSeconds = seconds % 60; // Get remaining seconds
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds.toFixed(0)).padStart(2, "0")}`;
}
