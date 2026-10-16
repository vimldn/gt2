import { Sandwich, Soup, Pizza, Candy, Milk, Cookie, Wheat, CakeSlice, Popcorn, Croissant, Beer, Drumstick, Utensils } from "lucide-react";

const MAP = { Sandwich, Soup, Pizza, Candy, Milk, Cookie, Wheat, CakeSlice, Popcorn, Croissant, Beer, Drumstick } as const;

export function CategoryIcon({ name, size = 24 }: { name: string; size?: number }) {
  const I = (MAP as Record<string, typeof Utensils>)[name] ?? Utensils;
  return <I size={size} aria-hidden strokeWidth={2.2} />;
}
