export const navLinks = ["Home", "Explore", "Personal Collection", "Drops"];
export const moreLinks = ["Stats", "Shows", "About Us", "Community", "Creator Studio", "Edit Profile", "Setting"];

export const stats = [
  { value: "100+", label: "Brands" },
  { value: "20k+", label: "Fashion Designer" },
  { value: "60+", label: "Fashion Shows" },
];

export const brandLogos = ["adidas", "PUMA", "LACOSTE"];

export const features = [
  { title: "No Gas Fees", icon: "tag" },
  { title: "Carbon Netural NFTs", icon: "leaf" },
  { title: "Fast And Easy Transactions", icon: "swap" },
] as const;

export const tabs = ["All Collections", "Verified Brands", "Verified Artists", "New Drops", "Live Shows"];

export type Product = { id: number; user: string; name: string; bid: string; hue: [string, string]; liked?: boolean };

const hues: [string, string][] = [
  ["#7aa7c7", "#2c4a6b"], ["#f0a36b", "#7a3b3b"], ["#3a4a3a", "#0e140e"],
  ["#e9e4f5", "#8f7fd0"], ["#c0392b", "#2a1015"], ["#3fa58a", "#d68ad0"],
  ["#b3342b", "#1a1010"], ["#3b5bdb", "#a855f7"], ["#e6c34a", "#6d28d9"],
  ["#ff9a5a", "#2b2a6b"], ["#5b7a9a", "#1b2a40"], ["#222222", "#6d28d9"],
];

const make = (n: number, offset = 0): Product[] =>
  Array.from({ length: n }, (_, i) => ({
    id: offset + i,
    user: "@Johny",
    name: "Lorem Ipsum",
    bid: "0.005 ETH",
    hue: hues[(offset + i) % hues.length],
    liked: offset === 0 && i < 2,
  }));

export const collection = make(9);
export const trending = make(3, 9);

export const creators = [
  { name: "John Wick", hue: ["#0fb5a0", "#7c3aed"] as [string, string], followed: false },
  { name: "John Wick", hue: ["#888888", "#222222"] as [string, string], followed: true },
  { name: "John Wick", hue: ["#ef4444", "#3b0b5e"] as [string, string], followed: false },
];

export const brands = [
  { name: "Adidas", bg: "#2f3fd8", logo: "adidas", followed: false },
  { name: "Nike", bg: "#2a1c14", logo: "NIKE", followed: true },
  { name: "Lacoste", bg: "#0e1a3a", logo: "LACOSTE", followed: false },
];

export const faqs = Array.from({ length: 6 }, () => "Lorem ipsum ipsum ?");

export const footerCols = [
  { title: "About", links: ["Product", "Resource", "Term & Condition", "FAQ"] },
  { title: "Company", links: ["Our team", "Partner With us", "Privacy & Policy", "Features"] },
];

export const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const exploreTabs = ["Trending", "All Fashion NFTs", "Art", "Fashion", "Creators", "Brands"];

export const exploreCards = [
  { banner: ["#e8e8ec", "#9aa0b8"], avatar: ["#8b8be0", "#3b3b7a"] },
  { banner: ["#d8d8d8", "#1a1a1a"], avatar: ["#8a6a4a", "#111111"] },
  { banner: ["#2b6bff", "#d61f8c"], avatar: ["#ef4444", "#2a0610"] },
  { banner: ["#f5c400", "#e8b800"], avatar: ["#c9a98a", "#2b1d1d"] },
  { banner: ["#b5653a", "#6b3320"], avatar: ["#e8c9a0", "#1b2a3a"] },
  { banner: ["#f0dc9a", "#e0c070"], avatar: ["#c0392b", "#2e3a2e"] },
  { banner: ["#d83a2a", "#a02418"], avatar: ["#d9b08a", "#3a2a1a"] },
  { banner: ["#5a7088", "#2c3c4c"], avatar: ["#6b6bff", "#2a2a8a"] },
  { banner: ["#e6c800", "#1a1a1a"], avatar: ["#cfe0f0", "#4a6a8a"] },
].map((c, id) => ({ id, ...c })) as { id: number; banner: [string, string]; avatar: [string, string] }[];

export const socials = ["youtube", "discord", "instagram"] as const;
