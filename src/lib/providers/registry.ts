/**
 * Provider registry and the interface future data providers must implement.
 *
 * Future providers are listed with status "not_integrated". They are NOT
 * called, and the app never claims to have data from them. Adding one means
 * implementing ProductProvider with a documented, licensed API — no scraping.
 */
import type { ProviderId, SourceObservation, SourceType } from "../types";
import type { Result } from "../http";

export interface ProductProvider {
  id: ProviderId;
  name: string;
  sourceType: SourceType;
  /** Look up a single GTIN. Must only return exact-GTIN matches. */
  getByBarcode(barcode: string): Promise<Result<SourceObservation[]>>;
  /** Optional name search. */
  search?(query: string): Promise<Result<SourceObservation[]>>;
}

export interface ProviderInfo {
  id: string;
  name: string;
  status: "live" | "optional" | "not_integrated";
  sourceType?: SourceType;
  role: string;
  docs: string;
  licence: string;
  notes?: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: "open_food_facts",
    name: "Open Food Facts",
    status: "live",
    sourceType: "community_database",
    role: "Barcode lookup and product search: ingredients, allergens, traces, labels, countries, images.",
    docs: "https://openfoodfacts.github.io/openfoodfacts-server/api/",
    licence: "ODbL 1.0 (database), DbCL (contents), CC BY-SA 3.0 (images)",
    notes: "Community-maintained. Gluten-free labels are treated as community-reported, never as verified manufacturer claims.",
  },
  {
    id: "fsa_alerts",
    name: "UK Food Standards Agency — Food Alerts",
    status: "live",
    sourceType: "government_database",
    role: "Allergy alerts and product recalls, matched as confirmed (exact barcode) or possible (brand + name).",
    docs: "https://data.food.gov.uk/food-alerts/ui/reference",
    licence: "Open Government Licence v3.0",
  },
  {
    id: "usda_fdc",
    name: "USDA FoodData Central (Branded Foods)",
    status: "optional",
    sourceType: "government_database",
    role: "US branded product ingredient declarations, exact GTIN matches only. Enabled when USDA_FDC_API_KEY is set.",
    docs: "https://fdc.nal.usda.gov/api-guide/",
    licence: "CC0 1.0",
  },
  {
    id: "open_prices",
    name: "Open Prices",
    status: "optional",
    sourceType: "community_database",
    role: "Crowd-sourced price observations with date and shop.",
    docs: "https://prices.openfoodfacts.org/api/docs",
    licence: "ODbL 1.0",
  },
  {
    id: "off_search_a_licious",
    name: "Open Food Facts Search-a-licious",
    status: "live",
    sourceType: "community_database",
    role: "Faster full-text search over Open Food Facts. Used first for name search; classic search is the fallback.",
    docs: "https://github.com/openfoodfacts/search-a-licious",
    licence: "ODbL 1.0",
  },
  // ---- Routes to VERIFIED (manufacturer / certification evidence). Each needs an agreement.
  {
    id: "coeliac_uk",
    name: "Coeliac UK — Crossed Grain licensing",
    status: "not_integrated",
    sourceType: "authorised_certification",
    role: "Licensee and licensed-product data for the Crossed Grain symbol. The strongest UK certification signal; would power VERIFIED (certification).",
    docs: "https://www.coeliac.org.uk/food-industry-professionals/the-crossed-grain-symbol",
    licence: "Partnership / data licence with Coeliac UK required",
  },
  {
    id: "brandbank",
    name: "NIQ Brandbank (content licensing)",
    status: "not_integrated",
    sourceType: "manufacturer",
    role: "Brand-supplied pack content (ingredients, allergens, claims, images) used by most UK supermarkets. Best single route to manufacturer-level data for UK packaged food.",
    docs: "https://nielseniq.com/global/en/solutions/brandbank-content-licensing/",
    licence: "Commercial content licence",
  },
  {
    id: "erudus",
    name: "Erudus",
    status: "not_integrated",
    sourceType: "manufacturer",
    role: "Manufacturer-entered product specifications incl. allergens for UK foodservice/wholesale. Has an API.",
    docs: "https://api.erudus.com/",
    licence: "Erudus API terms / commercial",
  },
  {
    id: "gs1",
    name: "GS1 UK — GTIN Check API / Verified by GS1",
    status: "not_integrated",
    role: "Confirms who owns a barcode and its core attributes (brand, description). Useful to detect wrong products in community data; no allergen or gluten data.",
    docs: "https://gs1uk.org/standards-services/data-services/gtin-check-api",
    licence: "GS1 UK partner key required",
  },
  {
    id: "manufacturer_feed",
    name: "Direct manufacturer feeds (Schär, Genius, BFree, Warburtons, Promise, Nairn's…)",
    status: "not_integrated",
    sourceType: "manufacturer",
    role: "Structured gluten-free product lists supplied by the brands themselves — the fastest route to VERIFIED for core gluten-free ranges.",
    docs: "—",
    licence: "Per-manufacturer agreement",
  },
  // ---- Additional alerts
  {
    id: "openfda_enforcement",
    name: "US FDA — openFDA food enforcement (recalls)",
    status: "not_integrated",
    sourceType: "government_database",
    role: "US food recalls incl. undeclared wheat/gluten. Free, documented API; ready to add for US expansion.",
    docs: "https://open.fda.gov/apis/food/enforcement/",
    licence: "Public domain (CC0)",
  },
  {
    id: "fsai_alerts",
    name: "Food Safety Authority of Ireland — food & allergen alerts",
    status: "not_integrated",
    sourceType: "government_database",
    role: "Irish alerts (relevant to Northern Ireland and shared supply chains). No documented API found; would need FSAI permission or a published feed.",
    docs: "https://www.fsai.ie/news-alerts",
    licence: "Check FSAI re-use terms",
  },
  // ---- Considered and NOT used for verdicts
  {
    id: "inferred_label_apis",
    name: "Edamam / Spoonacular / Nutritionix-style ‘gluten-free’ labels",
    status: "not_integrated",
    role: "Excluded for verdicts: their gluten-free labels are inferred by the provider, not manufacturer claims. Could be shown only as clearly-labelled third-party opinion.",
    docs: "—",
    licence: "Commercial",
  },
  {
    id: "open_food_repo",
    name: "Open Food Repo (Switzerland)",
    status: "not_integrated",
    role: "Open barcode database (Swiss market). Listed as inactive since 2024 — not worth integrating.",
    docs: "https://showcase.c4dt.org/openfoodrepo",
    licence: "CC BY 4.0",
  },
  { id: "tesco", name: "Tesco", status: "not_integrated", sourceType: "authorised_retailer", role: "Authorised retailer feed.", docs: "—", licence: "Requires authorised access; no scraping" },
  { id: "sainsburys", name: "Sainsbury's", status: "not_integrated", sourceType: "authorised_retailer", role: "Authorised retailer feed.", docs: "—", licence: "Requires authorised access; no scraping" },
  { id: "asda", name: "Asda", status: "not_integrated", sourceType: "authorised_retailer", role: "Authorised retailer feed.", docs: "—", licence: "Requires authorised access; no scraping" },
  { id: "morrisons", name: "Morrisons", status: "not_integrated", sourceType: "authorised_retailer", role: "Authorised retailer feed.", docs: "—", licence: "Requires authorised access; no scraping" },
  { id: "waitrose", name: "Waitrose", status: "not_integrated", sourceType: "authorised_retailer", role: "Authorised retailer feed.", docs: "—", licence: "Requires authorised access; no scraping" },
  { id: "ocado", name: "Ocado", status: "not_integrated", sourceType: "authorised_retailer", role: "Authorised retailer feed.", docs: "—", licence: "Requires authorised access; no scraping" },
];
