import { NextResponse } from "next/server";
import { browseGlutenFree } from "@/lib/service";
import { categoryBySlug, GF_CATEGORIES } from "@/lib/categories";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) return NextResponse.json({ error: "Unknown category", categories: GF_CATEGORIES.map((c) => c.slug) }, { status: 404 });
  const uk = new URL(req.url).searchParams.get("market") !== "all";
  const res = await browseGlutenFree(cat, uk);
  return NextResponse.json(res, {
    status: res.error ? 503 : 200,
    headers: res.error ? {} : { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=21600" },
  });
}
