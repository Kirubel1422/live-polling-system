import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string) {
  if (!name) return 'U';
  const cleanName = name.trim();
  if (!cleanName) return 'U';
  const parts = cleanName.split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'U';
  return ((parts[0][0] || '') + (parts[parts.length - 1][0] || '')).toUpperCase() || 'U';
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-success text-success-foreground";
    case "draft":
      return "!bg-muted !text-muted-foreground";
    case "archived":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};
