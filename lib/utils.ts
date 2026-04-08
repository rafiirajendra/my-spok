import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeSentence(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function scoreToLabel(score: number) {
  if (score >= 90) return "Hebat";
  if (score >= 75) return "Bagus";
  if (score >= 60) return "Terus Semangat";
  return "Ayo Latihan Lagi";
}
