import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = {
  title: "Gluten-free food in the UK by category",
  description: "Browse UK packaged foods labelled gluten-free: bread, pasta, pizza, chocolate, dairy and more — every product checked against its ingredient list.",
};

export default function GlutenFreeHub() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10">
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Gluten-free food</h1>
      <p className="mt-3 text-lg text-muted max-w-2xl">
        UK products whose packs carry a gluten-free label, with every ingredient list checked by our rules. Pick a category.
      </p>
      <div className="mt-6"><SearchBox size="md" /></div>
      <div className="mt-8"><CategoryGrid /></div>
    </div>
  );
}
