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

export const exploreCards = [
  { name: "Aria Lawn Kurta", category: "1PC", price: "4,500", discountedPrice: "3,600", description: "Breathable embroidered lawn kurta with a relaxed fit, perfect for warm afternoons.", banner: ["#e8e8ec", "#9aa0b8"], avatar: ["#8b8be0", "#3b3b7a"] },
  { name: "Noor Chiffon Duo", category: "2PC", price: "8,000", description: "Chiffon shirt paired with a matching raw-silk trouser, finished with delicate hand work.", banner: ["#d8d8d8", "#1a1a1a"], avatar: ["#8a6a4a", "#111111"] },
  { name: "Zeba Bridal Trio", category: "3PC", price: "19,000", discountedPrice: "15,500", description: "Heavily embellished shirt, sharara and organza dupatta crafted for festive evenings.", banner: ["#2b6bff", "#d61f8c"], avatar: ["#ef4444", "#2a0610"] },
  { name: "Sunday Cotton Set", category: "Casual", price: "3,000", discountedPrice: "2,400", description: "Soft everyday cotton set with minimal prints and an easy, comfortable silhouette.", banner: ["#f5c400", "#e8b800"], avatar: ["#c9a98a", "#2b1d1d"] },
  { name: "Amber Silk Ensemble", category: "Semi Formal", price: "11,000", description: "Rust-toned silk ensemble with subtle zari borders, ideal for dinners and small gatherings.", banner: ["#b5653a", "#6b3320"], avatar: ["#e8c9a0", "#1b2a3a"] },
  { name: "Ivory Gala Gown", category: "Formal", price: "24,000", discountedPrice: "19,900", description: "Floor-length ivory gown with pearl detailing, made for black-tie occasions.", banner: ["#f0dc9a", "#e0c070"], avatar: ["#c0392b", "#2e3a2e"] },
  { name: "Scarlet Festive Kurta", category: "1PC", price: "5,500", description: "Bold scarlet kurta with mirror-work neckline and flared sleeves.", banner: ["#d83a2a", "#a02418"], avatar: ["#d9b08a", "#3a2a1a"] },
  { name: "Slate Linen Pair", category: "2PC", price: "7,000", description: "Structured linen top and straight trousers in a cool slate tone for the office.", banner: ["#5a7088", "#2c3c4c"], avatar: ["#6b6bff", "#2a2a8a"] },
  { name: "Marigold Day Dress", category: "Casual", price: "3,500", description: "Lightweight marigold dress with a flattering waist tie and pockets.", banner: ["#e6c800", "#1a1a1a"], avatar: ["#cfe0f0", "#4a6a8a"] },
  { name: "Mehr Printed Kurta", category: "1PC", price: "3,800", description: "Digital-print kurta in soft lawn with side slits and a classic round neck.", banner: ["#f0dc9a", "#c9a14a"], avatar: ["#8b8be0", "#2a2a5a"] },
  { name: "Saira Cotton Duo", category: "2PC", price: "6,500", description: "Embroidered cotton shirt with cigarette trousers, easy to dress up or down.", banner: ["#b5653a", "#3a1a10"], avatar: ["#e8c9a0", "#2e3a2e"] },
  { name: "Layla Festive Trio", category: "3PC", price: "15,500", discountedPrice: "12,900", description: "Embroidered khaddar shirt, matching trouser and a wool-blend shawl for winter weddings.", banner: ["#5a7088", "#d61f8c"], avatar: ["#d9b08a", "#2a0610"] },
  { name: "Rumi Velvet Trio", category: "3PC", price: "22,000", description: "Deep emerald velvet shirt, straight pants and a net dupatta with sequin edging.", banner: ["#1f6b4a", "#0e2a20"], avatar: ["#f0dc9a", "#1b2a3a"] },
  { name: "Weekend Jersey Set", category: "Casual", price: "2,800", description: "Stretchy jersey tee and joggers set for lounging and quick errands.", banner: ["#2b6bff", "#9aa0b8"], avatar: ["#c9a98a", "#2b1d1d"] },
  { name: "Pearl Organza Set", category: "Semi Formal", price: "12,500", description: "Pearl-toned organza top with a flared skirt, suited to engagement lunches.", banner: ["#e8e8ec", "#d83a2a"], avatar: ["#c0392b", "#3a2a1a"] },
  { name: "Dusk Crepe Ensemble", category: "Semi Formal", price: "9,800", discountedPrice: "7,900", description: "Plum crepe tunic with tailored trousers and subtle thread embroidery.", banner: ["#6b3aa0", "#2a1a4a"], avatar: ["#cfe0f0", "#4a6a8a"] },
  { name: "Noir Banarsi Gown", category: "Formal", price: "28,000", description: "Black Banarsi brocade gown with gold motifs and a dramatic train.", banner: ["#1a1a1a", "#c9a14a"], avatar: ["#e8c9a0", "#111111"] },
  { name: "Rosewater Maxi", category: "Formal", price: "26,500", description: "Blush maxi with hand-sewn crystals and a sheer embroidered cape.", banner: ["#f5c4d0", "#d61f8c"], avatar: ["#8a6a4a", "#2e3a2e"] },
].map((c, id) => ({ id, ...c })) as {
  id: number;
  name: string;
  category: string;
  price: string;
  discountedPrice?: string;
  description: string;
  banner: [string, string];
  avatar: [string, string];
}[];

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

export function getItemDetails(id: number, category: string) {
  const { fabric, colour } = itemSpecs[id] ?? { fabric: "Cotton", colour: "Assorted" };
  const pieces = (piecesByCategory[category] ?? defaultPieces).map((p) => ({
    title: p.name,
    line: `${fabric} ${p.name} ${p.length}`,
    fabric,
    colour,
  }));
  return { fabric, colour, pieces };
}

export const socials = ["youtube", "discord", "instagram"] as const;
