import { format, parseISO, isValid } from "date-fns";

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "-";
    return format(dateObj, "dd-MMM-yyyy");
  } catch {
    return "-";
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "-";
    return format(dateObj, "dd-MMM-yyyy HH:mm");
  } catch {
    return "-";
  }
}
