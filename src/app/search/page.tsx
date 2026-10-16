import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { searchProducts } from "@/lib/service";
import { SearchBox } from "@/components/SearchBox";
import { ProductCard } from "@/components/ProductCard";
import { ProviderErrors } from "@/components/ProviderErrors";
import { cleanBarcode, isPlausibleBarcode } from "@/lib/barcode";
import { fmtDateTime } from "@/lib/present";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string; gf?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `“${q}” gluten check` : "Search", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", gf } = await searchParams;
  const gfOnly = gf === "1";
  const query = q.trim();
  if (/^[\d\s-]+$/.test(query) && isPlausibleBarcode(cleanBarcode(query))) redirect(`/product/${cleanBarcode(query)}`);

  const res = query ? await searchProducts(query) : null;
  const isGf = (s: string) => s === "VERIFIED_GLUTEN_FREE" || s === "LABELLED_GLUTEN_FREE";
  const gfCount = res ? res.results.filter((r) => isGf(r.classification.status)).length : 0;
  const shown = res ? (gfOnly ? res.results.filter((r) => isGf(r.classification.status)) : res.results) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <SearchBox initial={query} size="md" />
      {res && (
        <div className="mt-6 space-y-4">
          <ProviderErrors errors={res.providerErrors} />
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-black tracking-tight">
              {res.results.length ? `${res.results.length} product${res.results.length === 1 ? "" : "s"} for “${query}”` : `No products found for “${query}”`}
            </h1>
            <p className="text-xs text-muted">Gluten-free first, then UK · fetched {fmtDateTime(res.fetchedAt)}</p>
          </div>
          {res.results.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm font-semibold" role="group" aria-label="Filter">
              <Link href={`/search?q=${encodeURIComponent(query)}`} aria-current={!gfOnly ? "page" : undefined} className={`rounded-full px-4 py-2 border-2 ${!gfOnly ? "bg-ink text-white border-ink" : "border-line hover:border-ink"}`}>
                All ({res.results.length})
              </Link>
              <Link href={`/search?q=${encodeURIComponent(query)}&gf=1`} aria-current={gfOnly ? "page" : undefined} className={`rounded-full px-4 py-2 border-2 ${gfOnly ? "bg-ink text-white border-ink" : "border-line hover:border-ink"}`}>
                Gluten-free only ({gfCount})
              </Link>
            </div>
          )}
          {shown.length > 0 ? (
            <ul className="grid sm:grid-cols-2 gap-3">
              {shown.map((r) => (
                <ProductCard key={`${r.observation.provider}:${r.barcode}`} item={r} />
              ))}
            </ul>
          ) : (
            <div className="rounded-3xl border-2 border-line p-6">
              <p className="font-semibold">{gfOnly && res.results.length ? "None of these results passed our gluten-free checks." : "Try a brand name, a shorter search, or scan the barcode."}</p>
              <p className="text-sm text-muted mt-1">We only show real records from our data sources and never substitute similar products.</p>
            </div>
          )}
          <p className="text-xs text-muted">
            Each card is a separate source record. Different sizes, recipes and countries are listed separately. Tap a product to see the evidence.
          </p>
        </div>
      )}
    </div>
  );
}
