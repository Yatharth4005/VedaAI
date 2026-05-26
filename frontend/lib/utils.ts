import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDisplayDate(iso: string): string {
  return format(new Date(iso), "dd-MM-yyyy");
}

export function toISODate(dmy: string): string {
  const d = parse(dmy, "dd-MM-yyyy", new Date());
  return d.toISOString();
}
