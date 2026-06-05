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

export function getContrastColor(color: string | undefined | null): string {
  if (!color) return "#ffffff";
  
  const c = color.toLowerCase().trim();
  
  // Handle named colors
  const namedColors: Record<string, string> = {
    white: "ffffff", black: "000000", red: "ff0000", green: "008000", blue: "0000ff",
    yellow: "ffff00", cyan: "00ffff", magenta: "ff00ff", gray: "808080", grey: "808080",
    transparent: "ffffff"
  };
  
  let hex = c;
  if (namedColors[c]) {
    hex = namedColors[c];
  } else if (c.startsWith("rgb")) {
    const match = c.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#000000" : "#ffffff";
    }
  } else if (c.startsWith("hsl")) {
    const match = c.match(/\d+/g);
    if (match && match.length >= 3) {
      const l = parseInt(match[2], 10);
      return l >= 50 ? "#000000" : "#ffffff";
    }
    return "#ffffff";
  } else {
    hex = c.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map((char) => char + char).join("");
    }
    if (hex.length === 8) {
      hex = hex.substring(0, 6);
    }
  }

  if (hex.length !== 6 || !/^[0-9a-f]{6}$/i.test(hex)) {
    return "#ffffff";
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}
