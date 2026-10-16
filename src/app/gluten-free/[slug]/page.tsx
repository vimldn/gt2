import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { browseGlutenFree } from "@/lib/service";
import { categoryBySlug } from "@/lib/categories";
import { ProductCard } from "@/components/ProductCard";
import { ProviderErrors } from "@/components/ProviderErrors";
import { CategoryGrid } from "@/components/CategoryGrid";
import { fmtDateTime } from "@/lib/present";

// Data is cached for 6h via unstable_cache in the service layer.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ market?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) return {};
  return {
    title: `Gluten-free ${c.name.toLowerCase()} (UK)`,
    description: `${c.blurb} Each product checked against its ingredient list, with sources shown.`,
  };
}


export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { market } = await searchParams;
  const cat = categoryBySlug(slug);
  if (!cat) notFound();
  const uk = market !== "all";
  const res = await browseGlutenFree(cat, uk);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <Link href="/gluten-free" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
        <ArrowLeft size={16} aria-hidden /> All categories
      </Link>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Gluten-free {cat.name.toLowerCase()}</h1>
      <p className="mt-2 text-muted max-w-2xl">{cat.blurb}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold" role="group" aria-label="Market">
        <Link href={`/gluten-free/${slug}`} aria-current={uk ? "page" : undefined} className={`rounded-full px-4 py-2 border-2 ${uk ? "bg-ink text-white border-ink" : "border-line hover:border-ink"}`}>
          Sold in the UK
        </Link>
        <Link href={`/gluten-free/${slug}?market=all`} aria-current={!uk ? "page" : undefined} className={`rounded-full px-4 py-2 border-2 ${!uk ? "bg-ink text-white border-ink" : "border-line hover:border-ink"}`}>
          All countries
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {res.error && <ProviderErrors errors={[res.error]} />}

        {!res.error && (
          <p className="text-sm text-muted">
            {res.glutenFree.length} labelled gluten-free{res.notConfirmed.length ? ` · ${res.notConfirmed.length} more tagged gluten-free that our rules couldn’t confirm` : ""}
            {res.fetchedAt ? ` · updated ${fmtDateTime(res.fetchedAt)}` : ""}
          </p>
        )}

        {res.glutenFree.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-3">
            {res.glutenFree.map((r) => <ProductCard key={r.barcode} item={r} />)}
          </ul>
        )}

        {!res.error && res.glutenFree.length === 0 && (
          <div className="rounded-3xl border-2 border-line p-6">
            <p className="font-semibold">No products in this category passed our checks yet.</p>
            {uk && <p className="text-sm text-muted mt-1">Try <Link className="underline" href={`/gluten-free/${slug}?market=all`}>all countries</Link> — many UK products are only tagged with other markets.</p>}
          </div>
        )}

        {res.notConfirmed.length > 0 && (
          <details className="rounded-3xl border-2 border-line p-4">
            <summary className="font-bold cursor-pointer">Tagged gluten-free but not confirmed ({res.notConfirmed.length})</summary>
            <p className="text-sm text-muted mt-2">
              The source tags these as gluten-free, but the ingredient list is missing, not in English, incomplete, out of date, or conflicts with the label. Check the pack.
            </p>
            <ul className="mt-3 grid sm:grid-cols-2 gap-3">
              {res.notConfirmed.map((r) => <ProductCard key={r.barcode} item={r} />)}
            </ul>
          </details>
        )}

        <p className="text-xs text-muted">
          Products come from Open Food Facts records tagged gluten-free, ordered by popularity. “Labelled gluten-free” is reported by contributors and is not independent verification — always check the pack.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-black">Other categories</h2>
        <div className="mt-3"><CategoryGrid compact /></div>
      </section>
    </div>
  );
}
