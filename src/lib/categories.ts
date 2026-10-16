/**
 * Gluten-free browse categories. Each maps to an Open Food Facts category tag.
 * The list is navigation only: products shown always come live from the source
 * and are always individually classified by the rule engine.
 */
export interface GfCategory {
  slug: string;
  name: string;
  offTag: string;
  icon: string; // lucide icon name
  blurb: string;
}

export const GF_CATEGORIES: GfCategory[] = [
  { slug: "bread", name: "Bread & rolls", offTag: "en:breads", icon: "Sandwich", blurb: "Loaves, rolls, baguettes and bagels labelled gluten-free." },
  { slug: "pasta", name: "Pasta", offTag: "en:pastas", icon: "Soup", blurb: "Dried and fresh pasta labelled gluten-free." },
  { slug: "pizza", name: "Pizza & bases", offTag: "en:pizzas", icon: "Pizza", blurb: "Frozen and chilled pizzas and pizza bases." },
  { slug: "chocolate", name: "Chocolate", offTag: "en:chocolates", icon: "Candy", blurb: "Bars, buttons and chocolate confectionery." },
  { slug: "dairy", name: "Dairy & yoghurts", offTag: "en:dairies", icon: "Milk", blurb: "Yoghurts, cheese, milk drinks and desserts." },
  { slug: "biscuits", name: "Biscuits & cookies", offTag: "en:biscuits", icon: "Cookie", blurb: "Biscuits, cookies and crackers." },
  { slug: "cereal", name: "Breakfast cereals", offTag: "en:breakfast-cereals", icon: "Wheat", blurb: "Cereals, granola and porridge oats labelled gluten-free." },
  { slug: "cakes", name: "Cakes & bakes", offTag: "en:cakes", icon: "CakeSlice", blurb: "Cakes, brownies, muffins and sweet bakes." },
  { slug: "crisps", name: "Crisps & snacks", offTag: "en:crisps", icon: "Popcorn", blurb: "Crisps and savoury snacks." },
  { slug: "flour", name: "Flour & baking", offTag: "en:flours", icon: "Croissant", blurb: "Flour blends and baking mixes." },
  { slug: "beer", name: "Beer", offTag: "en:beers", icon: "Beer", blurb: "Beers labelled gluten-free (including deglutenised beers)." },
  { slug: "sausages", name: "Sausages", offTag: "en:sausages", icon: "Drumstick", blurb: "Sausages and burgers labelled gluten-free." },
];

export function categoryBySlug(slug: string): GfCategory | undefined {
  return GF_CATEGORIES.find((c) => c.slug === slug);
}
