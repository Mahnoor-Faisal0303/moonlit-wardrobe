export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "On Sale", href: "/#sale" },
  { label: "About Us", href: "/#about" },
];
export const moreLinks = [
  { label: "FAQ", href: "/#faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export const features = [
  { title: "Premium Fabrics", text: "Lawn, linen, silk and more, chosen for comfort and finish.", icon: "fabric" },
  { title: "Fast Delivery", text: "Order today and receive it in 3–5 working days.", icon: "truck" },
  { title: "Easy Returns", text: "Not the right fit? Return it within 7 days.", icon: "return" },
] as const;

export const faqs = [
  { q: "How long does delivery take?", a: "Orders are delivered within 3–5 working days anywhere in the country." },
  { q: "Can I return or exchange an item?", a: "Yes. Unworn items with tags can be returned or exchanged within 7 days of delivery." },
  { q: "Are the suits stitched?", a: "Our 1PC, 2PC and 3PC collections are unstitched. Casual, Semi Formal and Formal pieces list their details on the item page." },
  { q: "Will the colour match the photos?", a: "We try to be accurate, but actual colour may vary slightly from the image because of screen settings." },
  { q: "Which payment methods do you accept?", a: "Cash on delivery and online card payments are supported." },
  { q: "How should I care for my outfit?", a: "Dry clean embellished and formal pieces. Lawn and cotton can be gently hand washed in cold water." },
];

export const footerCols = [
  { title: "Shop", links: [
    { label: "1PC", href: "/explore?category=1PC" },
    { label: "2PC", href: "/explore?category=2PC" },
    { label: "3PC", href: "/explore?category=3PC" },
    { label: "Formal", href: "/explore?category=Formal" },
  ] },
  { title: "Help", links: [
    { label: "FAQ", href: "/#faq" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Your Bag", href: "/bag" },
  ] },
];

export const tagline = "Elegant everyday and occasion wear, from casual lawn to formal gowns.";

export const exploreTabs = ["1PC", "2PC", "3PC", "Casual", "Semi Formal", "Formal"];

const rawItems = [
  { name: "Aria Lawn Kurta", category: "1PC", price: "4,500", discountedPrice: "3,600", description: "Breathable embroidered lawn kurta with a relaxed fit, perfect for warm afternoons." },
  { name: "Noor Chiffon Duo", category: "2PC", price: "8,000", description: "Chiffon shirt paired with a matching raw-silk trouser, finished with delicate hand work." },
  { name: "Zeba Bridal Trio", category: "3PC", price: "19,000", discountedPrice: "15,500", description: "Heavily embellished shirt, sharara and organza dupatta crafted for festive evenings." },
  { name: "Sunday Cotton Set", category: "Casual", price: "3,000", discountedPrice: "2,400", description: "Soft everyday cotton set with minimal prints and an easy, comfortable silhouette." },
  { name: "Amber Silk Ensemble", category: "Semi Formal", price: "11,000", description: "Rust-toned silk ensemble with subtle zari borders, ideal for dinners and small gatherings." },
  { name: "Ivory Gala Gown", category: "Formal", price: "24,000", discountedPrice: "19,900", description: "Floor-length ivory gown with pearl detailing, made for black-tie occasions." },
  { name: "Scarlet Festive Kurta", category: "1PC", price: "5,500", description: "Bold scarlet kurta with mirror-work neckline and flared sleeves." },
  { name: "Slate Linen Pair", category: "2PC", price: "7,000", description: "Structured linen top and straight trousers in a cool slate tone for the office." },
  { name: "Marigold Day Dress", category: "Casual", price: "3,500", description: "Lightweight marigold dress with a flattering waist tie and pockets." },
  { name: "Mehr Printed Kurta", category: "1PC", price: "3,800", description: "Digital-print kurta in soft lawn with side slits and a classic round neck." },
  { name: "Saira Cotton Duo", category: "2PC", price: "6,500", description: "Embroidered cotton shirt with cigarette trousers, easy to dress up or down." },
  { name: "Layla Festive Trio", category: "3PC", price: "15,500", discountedPrice: "12,900", description: "Embroidered khaddar shirt, matching trouser and a wool-blend shawl for winter weddings." },
  { name: "Rumi Velvet Trio", category: "3PC", price: "22,000", description: "Deep emerald velvet shirt, straight pants and a net dupatta with sequin edging." },
  { name: "Weekend Jersey Set", category: "Casual", price: "2,800", description: "Stretchy jersey tee and joggers set for lounging and quick errands." },
  { name: "Pearl Organza Set", category: "Semi Formal", price: "12,500", description: "Pearl-toned organza top with a flared skirt, suited to engagement lunches." },
  { name: "Dusk Crepe Ensemble", category: "Semi Formal", price: "9,800", discountedPrice: "7,900", description: "Plum crepe tunic with tailored trousers and subtle thread embroidery." },
  { name: "Noir Banarsi Gown", category: "Formal", price: "28,000", description: "Black Banarsi brocade gown with gold motifs and a dramatic train." },
  { name: "Rosewater Maxi", category: "Formal", price: "26,500", description: "Blush maxi with hand-sewn crystals and a sheer embroidered cape." },
  { name: "Bloom Dobby Kurta", category: "1PC", price: "3,200", discountedPrice: "2,700", description: "Light dobby kurta with a subtle floral texture and a straight, easy cut." },
  { name: "Saffron Block Print Kurta", category: "1PC", price: "4,200", description: "Hand block printed cotton kurta in warm saffron with contrast piping." },
  { name: "Meadow Cambric Duo", category: "2PC", price: "5,600", discountedPrice: "4,500", description: "Printed cambric shirt with dyed straight trousers, soft and ideal for daily wear." },
  { name: "Indigo Dyed Pair", category: "2PC", price: "6,800", description: "Indigo-dyed cotton shirt and matching culottes with hand-finished hems." },
  { name: "Nargis Lawn Trio", category: "3PC", price: "9,500", discountedPrice: "7,600", description: "Embroidered lawn shirt, dyed trouser and a printed chiffon dupatta for summer events." },
  { name: "Gulnar Jacquard Trio", category: "3PC", price: "17,800", description: "Jacquard shirt with sequin neckline, silk trouser and a tissue dupatta with tassels." },
  { name: "Coastal Linen Shirt Set", category: "Casual", price: "4,900", description: "Relaxed linen shirt and wide-leg pants in a sandy tone, made for travel days." },
  { name: "Daisy Poplin Dress", category: "Casual", price: "3,900", discountedPrice: "3,100", description: "Crisp poplin dress with a gathered waist, puff sleeves and tiny daisy prints." },
  { name: "Mauve Raw Silk Set", category: "Semi Formal", price: "13,800", description: "Raw silk kurta with cutwork hem and cigarette pants, polished for dinners and dawats." },
  { name: "Sage Organza Ensemble", category: "Semi Formal", price: "14,500", discountedPrice: "11,600", description: "Sage organza shirt with pearl buttons, silk slip and tailored trousers." },
  { name: "Midnight Velvet Gown", category: "Formal", price: "32,000", description: "Navy velvet gown with a fitted bodice, hand-embroidered neckline and a flowing skirt." },
  { name: "Champagne Tissue Lehenga", category: "Formal", price: "38,500", discountedPrice: "32,900", description: "Champagne tissue lehenga with zardozi work, a short choli and a net dupatta." },
];

export const priceToNumber = (v: string) => Number(v.replace(/,/g, ""));

export function getDiscountPercent(price: string, discountedPrice?: string) {
  if (!discountedPrice) return 0;
  return Math.round((1 - priceToNumber(discountedPrice) / priceToNumber(price)) * 100);
}

/** Fabric and colour per explore card, indexed by card id. */
const itemSpecs: { fabric: string; colour: string }[] = [
  { fabric: "Lawn", colour: "Ivory" },
  { fabric: "Chiffon", colour: "Charcoal" },
  { fabric: "Organza", colour: "Magenta" },
  { fabric: "Cotton", colour: "Mustard" },
  { fabric: "Silk", colour: "Rust" },
  { fabric: "Silk", colour: "Ivory" },
  { fabric: "Lawn", colour: "Scarlet" },
  { fabric: "Linen", colour: "Slate" },
  { fabric: "Cotton", colour: "Marigold" },
  { fabric: "Lawn", colour: "Beige" },
  { fabric: "Cotton", colour: "Terracotta" },
  { fabric: "Khaddar", colour: "Dusty Pink" },
  { fabric: "Velvet", colour: "Emerald" },
  { fabric: "Jersey", colour: "Blue Grey" },
  { fabric: "Organza", colour: "Pearl" },
  { fabric: "Crepe", colour: "Plum" },
  { fabric: "Brocade", colour: "Black" },
  { fabric: "Chiffon", colour: "Blush" },
  { fabric: "Dobby", colour: "Powder Blue" },
  { fabric: "Cotton", colour: "Saffron" },
  { fabric: "Cambric", colour: "Teal" },
  { fabric: "Cotton", colour: "Indigo" },
  { fabric: "Lawn", colour: "Peach" },
  { fabric: "Jacquard", colour: "Wine" },
  { fabric: "Linen", colour: "Sand" },
  { fabric: "Poplin", colour: "White" },
  { fabric: "Raw Silk", colour: "Mauve" },
  { fabric: "Organza", colour: "Sage" },
  { fabric: "Velvet", colour: "Navy" },
  { fabric: "Tissue", colour: "Champagne" },
];

const piecesByCategory: Record<string, { name: string; length: string }[]> = {
  "1PC": [{ name: "Shirt", length: "3m" }],
  "2PC": [{ name: "Shirt", length: "3m" }, { name: "Trouser", length: "2.5m" }],
};
const defaultPieces = [
  { name: "Shirt", length: "3m" },
  { name: "Dupatta", length: "2.5m" },
  { name: "Trouser", length: "2.5m" },
];


export type Item = {
  id: string;
  name: string;
  category: string;
  price: string;
  discountedPrice?: string;
  description: string;
  fabric: string;
  colour: string;
  /** Photo URLs. The built-in sample items use the illustrations in public/items. */
  images: string[];
  /** True for items an admin added through the admin panel. */
  custom?: boolean;
};

export const PLACEHOLDER_IMAGE = "/items/suit.png";

export const formatPrice = (n: number) => n.toLocaleString("en-US");

export const staticItems: Item[] = rawItems.map((c, i) => ({
  id: String(i),
  ...c,
  ...(itemSpecs[i] ?? { fabric: "Cotton", colour: "Assorted" }),
  images: [`/items/${i}-1.svg`, `/items/${i}-2.svg`],
}));

export function getItemDetails(item: Pick<Item, "category" | "fabric" | "colour">) {
  const { fabric, colour, category } = item;
  const pieces = (piecesByCategory[category] ?? defaultPieces).map((p) => ({
    title: p.name,
    line: `${fabric} ${p.name} ${p.length}`,
    fabric,
    colour,
  }));
  return { fabric, colour, pieces };
}

export const socials = ["youtube", "discord", "instagram"] as const;
