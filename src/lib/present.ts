import type { ClassificationResult, GlutenStatus } from "./types";

export const STATUS_TEXT: Record<GlutenStatus, { label: string; short: string; explain: string }> = {
  VERIFIED_GLUTEN_FREE: {
    label: "Verified gluten-free",
    short: "Verified GF",
    explain: "A current manufacturer or certification source explicitly claims this exact product is gluten-free, with nothing contradicting it.",
  },
  LABELLED_GLUTEN_FREE: {
    label: "Labelled gluten-free",
    short: "Labelled GF",
    explain:
      "The pack carries a gluten-free label or logo (reported by Open Food Facts contributors), and the ingredient list we checked shows no gluten ingredients or ‘may contain gluten’ warning. Not independently verified with the manufacturer.",
  },
  CONTAINS_GLUTEN: {
    label: "Contains gluten",
    short: "Contains gluten",
    explain: "The source data explicitly lists a gluten-containing ingredient or declares gluten as an allergen.",
  },
  UNVERIFIED: {
    label: "Unverified — check packaging",
    short: "Unverified",
    explain: "The available data is incomplete, conflicting or has no substantiated gluten-free claim. Read the pack.",
  },
};

/** One-line reason under the badge, derived only from rule ids. */
export function reasonLine(c: ClassificationResult): string {
  const d = c.decidedBy;
  if (c.status === "CONTAINS_GLUTEN") return "Gluten ingredient or allergen listed in the source data.";
  if (c.status === "VERIFIED_GLUTEN_FREE")
    return c.claimBasis === "certification" ? "Current certification evidence." : "Current manufacturer gluten-free claim.";
  if (c.status === "LABELLED_GLUTEN_FREE") {
    const crossed = c.hits.some((h) => h.evidence.some((e) => /crossed-grain|aoecs|afdiag/.test(e.value)));
    return crossed ? "Gluten-free label and Crossed Grain logo reported on pack; ingredients checked." : "Gluten-free label reported on pack; ingredients checked.";
  }
  if (d.includes("R-CONFLICT-CLAIM")) return "Conflict: a gluten-free label is recorded but a gluten ingredient is also listed.";
  if (d.includes("R-CONFLICT-SOURCES")) return "Sources disagree about the ingredients.";
  if (d.includes("R-EX-ONLY")) return "Gluten is declared, but only via an exempt or special-case ingredient (e.g. malt vinegar).";
  if (d.includes("R-UV-CLAIM-WITH-PAL")) return "Gluten-free label recorded alongside a ‘may contain gluten’ warning.";
  if (d.includes("R-UV-COMMUNITY-CLAIM")) {
    if (d.includes("R-UV-NOT-ENGLISH")) return "Gluten-free label reported, but the ingredient list isn't in English so we couldn't check it.";
    if (d.includes("R-UV-NO-INGREDIENTS")) return "Gluten-free label reported, but there's no ingredient list to check.";
    if (d.includes("R-UV-INCOMPLETE")) return "Gluten-free label reported, but the ingredient list is incomplete.";
    return "Gluten-free label reported, but the record is out of date or couldn't be fully checked.";
  }
  if (d.includes("R-UV-NO-DATA")) return "No product record found from any source.";
  if (d.includes("R-UV-NO-INGREDIENTS")) return "No ingredient list available.";
  if (d.includes("R-UV-NOT-ENGLISH")) return "Ingredient list not available in English.";
  if (d.includes("R-UV-INCOMPLETE")) return "The source marks the ingredient list as incomplete.";
  if (d.includes("R-UV-STALE-CLAIM")) return "A gluten-free claim exists but is out of date.";
  if (d.includes("R-UV-NO-CLAIM")) return "No gluten ingredients listed, but no gluten-free claim either.";
  return "Not enough evidence to decide.";
}

export function fmtDate(iso?: string | null): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" });
}

export function fmtDateTime(iso?: string | null): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
}

export function tagLabel(tag: string): string {
  return tag.replace(/^[a-z]{2}:/, "").replace(/-/g, " ");
}

export function fmtPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

/** Display priority: gluten-free evidence first. */
export const STATUS_RANK: Record<string, number> = {
  VERIFIED_GLUTEN_FREE: 0,
  LABELLED_GLUTEN_FREE: 1,
  UNVERIFIED: 2,
  CONTAINS_GLUTEN: 3,
};
