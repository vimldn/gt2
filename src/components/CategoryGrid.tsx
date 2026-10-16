import Link from "next/link";
import { GF_CATEGORIES } from "@/lib/categories";
import { CategoryIcon } from "./CategoryIcon";

export function CategoryGrid({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-2 ${compact ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
      {GF_CATEGORIES.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/gluten-free/${c.slug}`}
            className={`flex ${compact ? "flex-col text-center gap-1.5 p-3" : "items-center gap-3 p-4"} h-full rounded-2xl border-2 border-line hover:border-ink hover:bg-lime/25 transition-colors`}
          >
            <span className={`grid place-items-center rounded-xl bg-lime ${compact ? "h-10 w-10 mx-auto" : "h-11 w-11 shrink-0"}`}>
              <CategoryIcon name={c.icon} size={compact ? 20 : 22} />
            </span>
            <span className={`font-bold leading-tight ${compact ? "text-xs" : ""}`}>{c.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
