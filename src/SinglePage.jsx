import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --burgundy: #6B1A1A; --deep-red: #8B2B2B; --amber: #C4882B;
    --gold: #D4A843; --cream: #F5EDD8; --warm-white: #FBF6EE;
    --charcoal: #1E1410; --brown: #4A2C1A; --text-dark: #2A1A0E;
    --muted: #7A6050; --border: rgba(107,26,26,0.14);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: #FBF6EE; color: #2A1A0E; overflow-x: hidden; }

  /* HERO */
  @keyframes heroZoom { from{transform:scale(1.05)} to{transform:scale(1.12)} }
  @keyframes heroFadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scrollPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .hero-bg-anim { animation: heroZoom 20s ease-in-out infinite alternate; }
  .hero-content-anim { animation: heroFadeUp 1.2s cubic-bezier(0.16,1,0.3,1) both; }
  .marquee-track { animation: marquee 28s linear infinite; }
  .scroll-line-anim { animation: scrollPulse 2s ease-in-out infinite; }

  /* REVEAL */
  .reveal { opacity:0; transform:translateY(30px); transition:opacity 0.85s ease, transform 0.85s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* PHOTO GRID */
  .photo-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 280px 280px;
    gap: 10px;
  }
  .photo-grid img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s; overflow:hidden; }
  .photo-grid img:hover { transform:scale(1.04); }
  .photo-grid img:first-child { grid-row: span 2; }

  /* MENU GRID */
  .order-menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
    gap: 1rem; margin-top: 1rem;
  }

  /* NAV scrolled */
  .nav-scrolled {
    background: rgba(251,246,238,0.97) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 1px 30px rgba(107,26,26,0.08) !important;
  }
  .nav-scrolled .nav-logo-text { color: #6B1A1A !important; }
  .nav-scrolled .nav-link { color: #4A2C1A !important; }
  .nav-scrolled .nav-link:hover { color: #6B1A1A !important; }

  /* HOURS TABLE */
  .hours-table { width:100%; border-collapse:collapse; }
  .hours-table tr { border-bottom: 1px solid rgba(107,26,26,0.12); }
  .hours-table tr:last-child { border-bottom: none; }
  .hours-table td { padding: 0.85rem 0; font-size: 0.92rem; }
  .hours-table td:first-child { color: #2A1A0E; font-weight: 500; }
  .hours-table td:last-child { color: #C4882B; font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; text-align: right; }

  /* SCROLLBAR */
  .cart-list-scroll { max-height: 320px; overflow-y: auto; }
  .cart-list-scroll::-webkit-scrollbar { width: 4px; }
  .cart-list-scroll::-webkit-scrollbar-thumb { background: rgba(107,26,26,0.2); }

  /* MODAL */
  .modal-open { display: flex !important; }

  @media(max-width:900px) {
    .photo-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .photo-grid img:first-child { grid-row: span 1; }
    .photo-grid img { height: 220px; }
  }
  @media(max-width:650px) {
    .photo-grid { grid-template-columns: 1fr; }
    .photo-grid img { height: 240px; }
  }
`;

// ─────────────────────────────────────────────
// MENU DATA
// ─────────────────────────────────────────────
const MENU = [
  { category: "🍜 Pho Noodle Soup", id: "pho", items: [
    { id: 1, name: "Pho Dac Biet — House Special Combo", desc: "Rare beef, brisket, meatballs & tendon in rich bone broth", price: 17.50, tags: ["pop"] },
    { id: 2, name: "Pho Tai — Rare Beef", desc: "Sliced rare beef in classic bone broth with rice noodles", price: 16.50 },
    { id: 3, name: "Pho Tai Nam — Rare Beef & Brisket", desc: "Rare beef with slow-cooked brisket", price: 17.00, tags: ["pop"] },
    { id: 4, name: "Pho Bo Vien — Beef Meatballs", desc: "House-made beef meatballs in savory broth", price: 15.50 },
    { id: 5, name: "Pho Ga — Chicken Noodle Soup", desc: "Tender shredded chicken in light aromatic broth", price: 16.00 },
    { id: 6, name: "Pho Chay — Vegetarian Pho", desc: "Tofu & vegetables in vegetable broth", price: 15.00, tags: ["veg"] },
    { id: 7, name: "Medium-Rare Steak & Triple Noodle Pho", desc: "House specialty — seared steak, three noodle types, rich broth", price: 19.00, tags: ["pop", "spicy"] },
  ]},
  { category: "🍚 Rice Dishes (Com)", id: "rice", items: [
    { id: 8, name: "Grilled Beef Lemon with Steamed Rice", desc: "Our signature — lemongrass grilled beef on fragrant steamed rice", price: 18.50, tags: ["pop"] },
    { id: 9, name: "Grilled Pork Chop with Steamed Rice", desc: "Marinated pork chop, egg, shredded pork skin, steamed rice", price: 17.50 },
    { id: 10, name: "Grilled Chicken with Steamed Rice", desc: "Lemongrass chicken with pickled vegetables and rice", price: 17.00 },
    { id: 11, name: "Shrimp & Pork Fried Rice", desc: "Wok-tossed rice with shrimp, pork, egg and vegetables", price: 16.50 },
    { id: 12, name: "Vegetarian Fried Rice", desc: "Wok-fried rice with tofu, egg and seasonal vegetables", price: 14.50, tags: ["veg"] },
  ]},
  { category: "🍝 Vermicelli Bowls (Bun)", id: "bun", items: [
    { id: 13, name: "Bun Thit Nuong — Grilled Pork Vermicelli", desc: "Cold vermicelli with grilled pork, herbs, bean sprouts, peanut sauce", price: 16.50, tags: ["pop"] },
    { id: 14, name: "Bun Bo Xao — Lemongrass Beef Vermicelli", desc: "Stir-fried lemongrass beef on cold rice noodles with fresh herbs", price: 17.50 },
    { id: 15, name: "Bun Ga Nuong — Grilled Chicken Vermicelli", desc: "Grilled chicken thighs on vermicelli with hoisin-peanut dressing", price: 16.50 },
    { id: 16, name: "Bun Tom — Shrimp Vermicelli", desc: "Chilled vermicelli with tiger shrimp, fresh herbs and nuoc cham", price: 17.00 },
    { id: 17, name: "Bun Chay — Veggie Vermicelli", desc: "Tofu & vegetables on vermicelli with peanut sauce", price: 14.50, tags: ["veg"] },
  ]},
  { category: "🥗 Starters & Salads", id: "starters", items: [
    { id: 18, name: "Cha Gio — Spring Rolls (4 pcs)", desc: "Crispy pork & vegetable spring rolls with sweet dipping sauce", price: 9.50, tags: ["pop"] },
    { id: 19, name: "Goi Cuon — Fresh Salad Rolls (2 pcs)", desc: "Rice paper rolls with shrimp, pork, herbs and peanut sauce", price: 8.50 },
    { id: 20, name: "Papaya Salad", desc: "Shredded green papaya, shrimp, fresh herbs, lime fish sauce dressing", price: 13.50, tags: ["pop", "spicy"] },
    { id: 21, name: "Chicken Wings (6 pcs)", desc: "Glazed with house lemongrass chili sauce", price: 13.00, tags: ["spicy"] },
    { id: 22, name: "Calamari", desc: "Lightly battered squid with sriracha mayo", price: 12.50 },
  ]},
  { category: "🍛 Sautéed & Stir-Fry", id: "stirfry", items: [
    { id: 23, name: "Stir-Fried Veg & Tofu on Egg Noodles", desc: "Seasonal veg & tofu in garlic oyster sauce on crispy egg noodles", price: 16.00, tags: ["veg", "pop"] },
    { id: 24, name: "Lemongrass Chili Beef on Egg Noodles", desc: "Tender wok-tossed beef in aromatic lemongrass chili sauce", price: 17.50, tags: ["spicy"] },
    { id: 25, name: "Shrimp & Cashew Stir-Fry", desc: "Jumbo shrimp with cashews, bell peppers, hoisin sauce", price: 18.00 },
    { id: 26, name: "Sate Chicken Sub / Banh Mi Ga Sate", desc: "House-made sate chicken in toasted Vietnamese baguette with pickled daikon", price: 12.00, tags: ["pop", "spicy"] },
  ]},
  { category: "🥤 Drinks & Desserts", id: "drinks", items: [
    { id: 27, name: "Vietnamese Iced Coffee (Ca Phe Sua Da)", desc: "Strong drip coffee with sweetened condensed milk over ice", price: 5.50, tags: ["pop"] },
    { id: 28, name: "Thai Iced Tea", desc: "Creamy orange Thai tea with condensed milk", price: 5.50 },
    { id: 29, name: "Soda (Can)", desc: "Coke, Diet Coke, Sprite, Ginger Ale", price: 2.50 },
    { id: 30, name: "Sparkling Water", desc: "San Pellegrino 500ml", price: 3.00 },
    { id: 31, name: "Che Ba Mau — Three Colour Dessert", desc: "Layered jellies, red beans, mung bean, coconut cream over shaved ice", price: 7.50 },
    { id: 32, name: "Mango Pudding", desc: "Silky mango pudding with whipped cream", price: 6.50 },
  ]},
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getItem(id) {
  for (const cat of MENU) {
    const f = cat.items.find(i => i.id === id);
    if (f) return f;
  }
}
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
const LOGO_SRC = "https://lacvietrestaurant.com/huongviet17.2023/wp-content/uploads/2023/10/logo1.png";
const PATTERN_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23d4a843' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

function Tag({ type }) {
  const cfg = {
    pop:   { label: "Popular",    bg: "rgba(212,168,67,0.12)",  color: "#C4882B", border: "rgba(212,168,67,0.3)" },
    veg:   { label: "Vegetarian", bg: "rgba(46,125,50,0.08)",   color: "#2E7D32", border: "rgba(46,125,50,0.2)" },
    spicy: { label: "Spicy",      bg: "rgba(107,26,26,0.07)",   color: "#6B1A1A", border: "rgba(107,26,26,0.2)" },
  }[type];
  if (!cfg) return null;
  return (
    <span style={{
      display: "inline-block", fontSize: "0.6rem", fontWeight: 600,
      padding: "2px 6px", marginLeft: 4, letterSpacing: "0.08em",
      textTransform: "uppercase", background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>{cfg.label}</span>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function HomeNav({ onOrderClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navBase = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "1.1rem 3.5rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    transition: "all 0.4s ease",
    background: scrolled ? "rgba(251,246,238,0.97)" : "transparent",
    boxShadow: scrolled ? "0 1px 30px rgba(107,26,26,0.08)" : "none",
  };
  const linkColor = scrolled ? "#4A2C1A" : "rgba(245,237,216,0.85)";
  const logoColor = scrolled ? "#6B1A1A" : "#F5EDD8";

  return (
    <nav style={navBase}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.7rem", textDecoration: "none" }}>
        <img src={LOGO_SRC} alt="Pho Huong Viet" style={{ height: 44, width: "auto" }} onError={e => e.target.style.display = "none"} />
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: logoColor, transition: "color 0.4s" }}>
          Pho Huong Viet
        </span>
      </a>
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", alignItems: "center" }}>
        {["About", "Menu", "Gallery", "Visit"].map(item => (
          <li key={item} style={{ display: "none" }} className="nav-desktop-item">
            <a href={`#${item.toLowerCase()}`} style={{ fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", color: linkColor, transition: "color 0.3s" }}>
              {item}
            </a>
          </li>
        ))}
        <li>
          <button onClick={onOrderClick} style={{
            background: "#C4882B", color: "white", border: "none",
            padding: "0.55rem 1.4rem", fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", transition: "background 0.3s",
          }}
            onMouseEnter={e => e.target.style.background = "#6B1A1A"}
            onMouseLeave={e => e.target.style.background = "#C4882B"}
          >Order Now</button>
        </li>
      </ul>
      <style>{`
        @media(min-width:700px){ .nav-desktop-item { display: list-item !important; } }
      `}</style>
    </nav>
  );
}

// ─────────────────────────────────────────────
// HERO BG — SVG + CSS animated restaurant scene
// ─────────────────────────────────────────────
const HERO_CSS = `
@keyframes lanternSwing {
  0%,100%{ transform: rotate(-6deg); }
  50%    { transform: rotate( 6deg); }
}
@keyframes lanternSwing2 {
  0%,100%{ transform: rotate( 5deg); }
  50%    { transform: rotate(-5deg); }
}
@keyframes steamRise1 {
  0%  { transform: translateY(0)   translateX(0)    scaleX(1);   opacity:0; }
  15% { opacity: 0.55; }
  60% { opacity: 0.3; }
  100%{ transform: translateY(-160px) translateX(18px)  scaleX(1.8); opacity:0; }
}
@keyframes steamRise2 {
  0%  { transform: translateY(0)   translateX(0)    scaleX(1);   opacity:0; }
  15% { opacity: 0.45; }
  60% { opacity: 0.22; }
  100%{ transform: translateY(-140px) translateX(-22px) scaleX(2.1); opacity:0; }
}
@keyframes steamRise3 {
  0%  { transform: translateY(0)   translateX(0)    scaleX(1);   opacity:0; }
  20% { opacity: 0.5; }
  100%{ transform: translateY(-180px) translateX(8px)   scaleX(1.6); opacity:0; }
}
@keyframes floatDrift {
  0%  { transform: translateY(0px)   rotate(0deg); }
  33% { transform: translateY(-14px) rotate(8deg); }
  66% { transform: translateY(-6px)  rotate(-6deg); }
  100%{ transform: translateY(0px)   rotate(0deg); }
}
@keyframes floatDrift2 {
  0%  { transform: translateY(0px)   rotate(0deg); }
  40% { transform: translateY(-20px) rotate(-10deg); }
  100%{ transform: translateY(0px)   rotate(0deg); }
}
@keyframes floatDrift3 {
  0%  { transform: translateY(0px)  rotate(0deg); }
  50% { transform: translateY(-10px) rotate(15deg); }
  100%{ transform: translateY(0px)  rotate(0deg); }
}
@keyframes noodleWave {
  0%,100%{ d: path("M-180 0 Q-90 -22 0 0 Q90 22 180 0"); }
  50%    { d: path("M-180 0 Q-90  22 0 0 Q90 -22 180 0"); }
}
@keyframes noodleWave2 {
  0%,100%{ d: path("M-160 0 Q-80  18 0 0 Q80 -18 160 0"); }
  50%    { d: path("M-160 0 Q-80 -18 0 0 Q80  18 160 0"); }
}
@keyframes brothShimmer {
  0%,100%{ opacity:0.55; }
  50%    { opacity:0.7;  }
}
@keyframes glowPulse {
  0%,100%{ opacity:0.22; r:105; }
  50%    { opacity:0.38; r:118; }
}
@keyframes herbDrift {
  0%  { transform: translate(0,0)   rotate(0deg); opacity:0.13; }
  25% { opacity:0.22; }
  50% { transform: translate(-12px,-30px) rotate(20deg); }
  75% { opacity:0.18; }
  100%{ transform: translate(5px,-65px)   rotate(-8deg); opacity:0; }
}
@keyframes herbDrift2 {
  0%  { transform: translate(0,0)   rotate(0deg); opacity:0.11; }
  30% { opacity:0.2; }
  100%{ transform: translate(18px,-70px)  rotate(25deg); opacity:0; }
}
@keyframes seedFloat {
  0%  { transform: translateY(0); opacity:0.18; }
  50% { transform: translateY(-40px); opacity:0.28; }
  100%{ transform: translateY(-90px); opacity:0; }
}
@keyframes sparkle {
  0%,100%{ opacity:0; transform:scale(0.5); }
  50%    { opacity:0.6; transform:scale(1); }
}
.lantern-a { transform-origin:top center; animation: lanternSwing  3.8s ease-in-out infinite; }
.lantern-b { transform-origin:top center; animation: lanternSwing2 4.2s ease-in-out infinite; }
.lantern-c { transform-origin:top center; animation: lanternSwing  5.1s ease-in-out infinite 0.6s; }
.lantern-d { transform-origin:top center; animation: lanternSwing2 3.5s ease-in-out infinite 1.2s; }
.steam1 { animation: steamRise1 3.2s ease-out infinite 0s; }
.steam2 { animation: steamRise2 3.8s ease-out infinite 0.9s; }
.steam3 { animation: steamRise3 4.1s ease-out infinite 1.8s; }
.steam4 { animation: steamRise1 3.5s ease-out infinite 2.5s; }
.steam5 { animation: steamRise2 4.4s ease-out infinite 0.4s; }
`;

// Star anise SVG path
function StarAniseSVG({ cx, cy, r, opacity, cls }) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const px = cx + Math.cos(a) * r * 0.72;
    const py = cy + Math.sin(a) * r * 0.72;
    return <ellipse key={i} cx={px} cy={py} rx={r * 0.28} ry={r * 0.13}
      fill="rgba(200,155,55,0.85)" transform={`rotate(${i * 45},${px},${py})`} />;
  });
  return (
    <g opacity={opacity} className={cls}>
      {petals}
      <circle cx={cx} cy={cy} r={r * 0.22} fill="rgba(155,95,28,0.9)" />
    </g>
  );
}

function Lantern({ x, y, w, h, cls }) {
  const gId = `lg${Math.round(x)}`;
  return (
    <g className={cls}>
      {/* string */}
      <line x1={x} y1={0} x2={x} y2={y - h * 0.55} stroke="rgba(212,168,67,0.4)" strokeWidth="1" />
      {/* glow */}
      <radialGradient id={gId} cx="38%" cy="30%" r="60%">
        <stop offset="0%"   stopColor="#FF9922" stopOpacity="0.35" />
        <stop offset="50%"  stopColor="#CC3300" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#AA1100" stopOpacity="0" />
      </radialGradient>
      <ellipse cx={x} cy={y} rx={w * 2.8} ry={h * 2.2} fill={`url(#${gId})`} />
      {/* body */}
      <ellipse cx={x} cy={y} rx={w} ry={h} fill="url(#lanternBody)" stroke="rgba(100,15,5,0.5)" strokeWidth="0.8" />
      {/* ribs */}
      {[-0.55, -0.28, 0, 0.28, 0.55].map((f, i) => (
        <ellipse key={i} cx={x + f * w} cy={y} rx={w * 0.09} ry={h}
          fill="none" stroke="rgba(90,10,4,0.45)" strokeWidth="0.7" />
      ))}
      {/* caps */}
      <ellipse cx={x} cy={y - h} rx={w * 0.62} ry={h * 0.15} fill="rgba(212,168,67,0.7)" />
      <ellipse cx={x} cy={y + h} rx={w * 0.62} ry={h * 0.15} fill="rgba(212,168,67,0.7)" />
      {/* tassel */}
      {[-0.2, -0.07, 0.06, 0.19].map((f, i) => (
        <line key={i} x1={x + f * w} y1={y + h * 1.15} x2={x + f * w} y2={y + h * 1.72}
          stroke="rgba(212,168,67,0.55)" strokeWidth="0.9" />
      ))}
    </g>
  );
}

function HeroCanvas() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <style>{HERO_CSS}</style>

      {/* layered dark backgrounds */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(155deg,#06030200 0%,#0D0604 22%,#1A0A07 52%,#220B08 78%,#0C0503 100%)" }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 75% 60% at 50% 78%, rgba(160,55,12,0.32) 0%, rgba(100,28,6,0.14) 50%, transparent 100%)" }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 40% at 50% 0%, rgba(120,18,8,0.25) 0%, transparent 68%)" }} />

      {/* SVG scene */}
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="lanternBody" cx="35%" cy="28%" r="65%">
            <stop offset="0%"   stopColor="#FF9930" stopOpacity="0.92"/>
            <stop offset="42%"  stopColor="#CC3A10" stopOpacity="0.88"/>
            <stop offset="100%" stopColor="#7A0F05" stopOpacity="0.82"/>
          </radialGradient>
          <radialGradient id="brothGrad" cx="40%" cy="32%" r="70%">
            <stop offset="0%"   stopColor="#C8782A" stopOpacity="0.65"/>
            <stop offset="55%"  stopColor="#8B4210" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#3E1405" stopOpacity="0.45"/>
          </radialGradient>
          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#F5EDD8" stopOpacity="0.38"/>
            <stop offset="100%" stopColor="#C8A870" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="noodleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#E8C98A" stopOpacity="0"/>
            <stop offset="20%"  stopColor="#E8C98A" stopOpacity="0.35"/>
            <stop offset="80%"  stopColor="#D4A843" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#D4A843" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="lanternGlow1" cx="38%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#FF9922" stopOpacity="0.35"/>
            <stop offset="50%"  stopColor="#CC3300" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#AA1100" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="lanternGlow2" cx="38%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#FF9922" stopOpacity="0.3"/>
            <stop offset="50%"  stopColor="#CC3300" stopOpacity="0.16"/>
            <stop offset="100%" stopColor="#AA1100" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="bottomFade" cx="50%" cy="90%" r="55%">
            <stop offset="0%"   stopColor="#080302" stopOpacity="0"/>
            <stop offset="100%" stopColor="#080302" stopOpacity="0.68"/>
          </radialGradient>
          <filter id="steamBlur"><feGaussianBlur stdDeviation="7"/></filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="20" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* diagonal grid */}
        {Array.from({length:14},(_,i)=>(
          <line key={`gl${i}`} x1={i*95} y1={0} x2={i*95+700} y2={700}
            stroke="#D4A843" strokeWidth="0.4" strokeOpacity="0.032"/>
        ))}
        {Array.from({length:14},(_,i)=>(
          <line key={`gr${i}`} x1={i*95+700} y1={0} x2={i*95} y2={700}
            stroke="#D4A843" strokeWidth="0.35" strokeOpacity="0.022"/>
        ))}

        {/* Vietnamese wave corner motifs */}
        {[
          {ox:0,   oy:28, dir:1,  n:6, span:165},
          {ox:1200,oy:28, dir:-1, n:6, span:165},
          {ox:0,   oy:545,dir:1,  n:5, span:138},
          {ox:1200,oy:545,dir:-1, n:5, span:138},
        ].map((wv,wi)=>
          Array.from({length:wv.n},(_,row)=>{
            const pts=Array.from({length:32},(_,k)=>{
              const frac=k/31;
              const wx=wv.ox+frac*wv.span*wv.dir;
              const wy=wv.oy+row*14+Math.sin(frac*Math.PI*2.2)*9;
              return `${k===0?"M":"L"}${wx.toFixed(1)},${wy.toFixed(1)}`;
            }).join(" ");
            return <path key={`wv${wi}-${row}`} d={pts}
              fill="none" stroke="#D4A843" strokeWidth="0.8"
              strokeOpacity={(0.065-row*0.009).toFixed(3)}/>;
          })
        )}

        {/* ── LANTERN A (top-left) ── */}
        <g className="lantern-a">
          <line x1={82} y1={0} x2={82} y2={28} stroke="rgba(212,168,67,0.4)" strokeWidth="1"/>
          <ellipse cx={82} cy={82} rx={90} ry={120} fill="url(#lanternGlow1)"/>
          <ellipse cx={82} cy={82} rx={32} ry={54} fill="url(#lanternBody)" stroke="rgba(90,10,4,0.5)" strokeWidth="0.8"/>
          {[-0.55,-0.28,0,0.28,0.55].map((f,i)=>(
            <ellipse key={i} cx={82+f*32} cy={82} rx={32*0.09} ry={54} fill="none" stroke="rgba(80,8,3,0.45)" strokeWidth="0.7"/>
          ))}
          <ellipse cx={82} cy={28} rx={20} ry={8} fill="rgba(212,168,67,0.7)"/>
          <ellipse cx={82} cy={136} rx={20} ry={8} fill="rgba(212,168,67,0.7)"/>
          {[-0.2,-0.07,0.06,0.19].map((f,i)=>(
            <line key={i} x1={82+f*32} y1={153} x2={82+f*32} y2={193}
              stroke="rgba(212,168,67,0.55)" strokeWidth="0.9"/>
          ))}
        </g>

        {/* ── LANTERN B (top-right) ── */}
        <g className="lantern-b">
          <line x1={1118} y1={0} x2={1118} y2={22} stroke="rgba(212,168,67,0.4)" strokeWidth="1"/>
          <ellipse cx={1118} cy={86} rx={108} ry={140} fill="url(#lanternGlow2)"/>
          <ellipse cx={1118} cy={86} rx={38} ry={64} fill="url(#lanternBody)" stroke="rgba(90,10,4,0.5)" strokeWidth="0.8"/>
          {[-0.55,-0.28,0,0.28,0.55].map((f,i)=>(
            <ellipse key={i} cx={1118+f*38} cy={86} rx={38*0.09} ry={64} fill="none" stroke="rgba(80,8,3,0.45)" strokeWidth="0.7"/>
          ))}
          <ellipse cx={1118} cy={22} rx={24} ry={10} fill="rgba(212,168,67,0.7)"/>
          <ellipse cx={1118} cy={150} rx={24} ry={10} fill="rgba(212,168,67,0.7)"/>
          {[-0.2,-0.07,0.06,0.19].map((f,i)=>(
            <line key={i} x1={1118+f*38} y1={170} x2={1118+f*38} y2={218}
              stroke="rgba(212,168,67,0.55)" strokeWidth="0.9"/>
          ))}
        </g>

        {/* ── LANTERN C (lower-left) ── */}
        <g className="lantern-c">
          <line x1={195} y1={528} x2={195} y2={558} stroke="rgba(212,168,67,0.35)" strokeWidth="1"/>
          <ellipse cx={195} cy={600} rx={68} ry={84} fill="url(#lanternGlow1)"/>
          <ellipse cx={195} cy={600} rx={24} ry={42} fill="url(#lanternBody)" stroke="rgba(90,10,4,0.5)" strokeWidth="0.8"/>
          {[-0.55,-0.28,0,0.28,0.55].map((f,i)=>(
            <ellipse key={i} cx={195+f*24} cy={600} rx={24*0.09} ry={42} fill="none" stroke="rgba(80,8,3,0.45)" strokeWidth="0.6"/>
          ))}
          <ellipse cx={195} cy={558} rx={15} ry={6} fill="rgba(212,168,67,0.65)"/>
          <ellipse cx={195} cy={642} rx={15} ry={6} fill="rgba(212,168,67,0.65)"/>
          {[-0.2,-0.07,0.06,0.19].map((f,i)=>(
            <line key={i} x1={195+f*24} y1={656} x2={195+f*24} y2={686}
              stroke="rgba(212,168,67,0.5)" strokeWidth="0.8"/>
          ))}
        </g>

        {/* ── LANTERN D (lower-right) ── */}
        <g className="lantern-d">
          <line x1={1012} y1={538} x2={1012} y2={562} stroke="rgba(212,168,67,0.35)" strokeWidth="1"/>
          <ellipse cx={1012} cy={608} rx={80} ry={100} fill="url(#lanternGlow2)"/>
          <ellipse cx={1012} cy={608} rx={28} ry={48} fill="url(#lanternBody)" stroke="rgba(90,10,4,0.5)" strokeWidth="0.8"/>
          {[-0.55,-0.28,0,0.28,0.55].map((f,i)=>(
            <ellipse key={i} cx={1012+f*28} cy={608} rx={28*0.09} ry={48} fill="none" stroke="rgba(80,8,3,0.45)" strokeWidth="0.6"/>
          ))}
          <ellipse cx={1012} cy={560} rx={18} ry={7} fill="rgba(212,168,67,0.65)"/>
          <ellipse cx={1012} cy={656} rx={18} ry={7} fill="rgba(212,168,67,0.65)"/>
          {[-0.2,-0.07,0.06,0.19].map((f,i)=>(
            <line key={i} x1={1012+f*28} y1={672} x2={1012+f*28} y2={700}
              stroke="rgba(212,168,67,0.5)" strokeWidth="0.8"/>
          ))}
        </g>

        {/* ── Bowl glow ── */}
        <ellipse cx={600} cy={592} rx={255} ry={70}
          fill="rgba(155,52,10,0.2)" filter="url(#softGlow)"/>

        {/* ── Bowl outer rim ── */}
        <ellipse cx={600} cy={576} rx={220} ry={47}
          fill="url(#rimGrad)" stroke="#F5EDD8" strokeWidth="2.2" strokeOpacity="0.28"/>

        {/* ── Broth surface ── */}
        <ellipse cx={600} cy={574} rx={194} ry={40}
          fill="url(#brothGrad)"
          style={{animation:"brothShimmer 3.5s ease-in-out infinite"}}/>

        {/* ── Noodle waves ── */}
        {[
          {dy:-13,dur:"4.2s",del:"0s",  amp:24,stroke:2.1},
          {dy:  1,dur:"3.8s",del:"0.7s",amp:19,stroke:1.8},
          {dy: 14,dur:"5.0s",del:"1.4s",amp:21,stroke:1.5},
          {dy:-25,dur:"4.6s",del:"2.0s",amp:15,stroke:1.2},
        ].map((n,i)=>(
          <path key={i} fill="none" stroke="url(#noodleGrad)" strokeWidth={n.stroke}
            style={{animation:`${i%2===0?"noodleWave":"noodleWave2"} ${n.dur} ease-in-out infinite ${n.del}`}}
            d={`M${435},${574+n.dy} Q${517},${574+n.dy-n.amp} ${600},${574+n.dy} Q${683},${574+n.dy+n.amp} ${765},${574+n.dy}`}/>
        ))}

        {/* ── Chopsticks ── */}
        <g transform="translate(600,558) rotate(-14)">
          <rect x={-10} y={-188} width={6} height={192} rx={2.5} fill="rgba(168,115,50,0.7)"/>
          <rect x={5}   y={-178} width={6} height={182} rx={2.5} fill="rgba(130,85,32,0.62)"/>
        </g>

        {/* ── Steam ── */}
        {[
          {x:566,y:540,cls:"steam1",rx:22,ry:12},
          {x:600,y:537,cls:"steam2",rx:18,ry:10},
          {x:632,y:542,cls:"steam3",rx:20,ry:11},
          {x:550,y:544,cls:"steam4",rx:16,ry:9},
          {x:648,y:538,cls:"steam5",rx:24,ry:13},
        ].map((s,i)=>(
          <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry}
            fill="rgba(255,235,210,0.52)" filter="url(#steamBlur)" className={s.cls}/>
        ))}

        {/* ── Star anise ── */}
        {[
          {cx:155,cy:222,r:22,op:0.16,cls:"floatDrift"},
          {cx:1052,cy:182,r:18,op:0.13,cls:"floatDrift2"},
          {cx:322,cy:482,r:14,op:0.12,cls:"floatDrift3"},
          {cx:932,cy:424,r:20,op:0.15,cls:"floatDrift"},
          {cx:758,cy:118,r:12,op:0.1, cls:"floatDrift2"},
          {cx:88, cy:422,r:16,op:0.11,cls:"floatDrift3"},
          {cx:1142,cy:342,r:13,op:0.1,cls:"floatDrift"},
        ].map(({cx,cy,r,op,cls},si)=>(
          <g key={si} opacity={op} className={cls}>
            {Array.from({length:8},(_,i)=>{
              const a=(i/8)*Math.PI*2;
              return <ellipse key={i}
                cx={cx+Math.cos(a)*r*0.72} cy={cy+Math.sin(a)*r*0.72}
                rx={r*0.28} ry={r*0.13}
                fill="rgba(200,155,55,0.85)"
                transform={`rotate(${i*45},${cx+Math.cos(a)*r*0.72},${cy+Math.sin(a)*r*0.72})`}/>;
            })}
            <circle cx={cx} cy={cy} r={r*0.22} fill="rgba(150,92,28,0.9)"/>
          </g>
        ))}

        {/* ── Herb leaves ── */}
        {[
          {cx:242,cy:352,rx:8, ry:20,rot:30, op:0.12,cls:"floatDrift2"},
          {cx:982,cy:282,rx:7, ry:17,rot:-45,op:0.1, cls:"floatDrift"},
          {cx:418,cy:152,rx:9, ry:22,rot:15, op:0.09,cls:"floatDrift3"},
          {cx:852,cy:492,rx:6, ry:16,rot:-25,op:0.11,cls:"floatDrift2"},
          {cx:1082,cy:502,rx:8,ry:20,rot:55, op:0.09,cls:"floatDrift"},
          {cx:112, cy:322,rx:7,ry:18,rot:-35,op:0.1, cls:"floatDrift3"},
        ].map((l,i)=>(
          <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry}
            fill="rgba(88,132,68,0.75)" opacity={l.op}
            transform={`rotate(${l.rot},${l.cx},${l.cy})`} className={l.cls}/>
        ))}

        {/* ── Sesame sparkles ── */}
        {[
          [482,195,0],[722,148,0.38],[352,312,0.75],[882,332,1.12],
          [202,468,1.5],[1002,448,1.88],[542,90,2.25],[662,96,0.62],
          [142,512,1.0],[1062,515,1.4],
        ].map(([x,y,delay],i)=>(
          <circle key={i} cx={x} cy={y} r={2.2} fill="#D4A843" opacity="0.35"
            style={{animation:`sparkle ${2.5+(i%4)*0.55}s ease-in-out infinite ${delay}s`}}/>
        ))}

        {/* ── Rim highlight ── */}
        <path d="M 406 568 A 196 42 0 0 1 794 568"
          fill="none" stroke="rgba(255,245,215,0.15)" strokeWidth="3.5"/>

        {/* ── Vignette ── */}
        <rect x={0} y={0} width={1200} height={700} fill="url(#bottomFade)"/>
        <rect x={0} y={0} width={1200} height={700}
          fill="url(#sideVig)" opacity="0.0"/>
        <defs>
          <radialGradient id="sideVig" cx="50%" cy="50%" r="78%">
            <stop offset="0%"   stopColor="#000000" stopOpacity="0"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0.65"/>
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1200} height={700}>
          <animate attributeName="opacity" values="0;0" dur="1s" fill="freeze"/>
        </rect>
        <ellipse cx={600} cy={350} rx={680} ry={420}
          fill="none" stroke="none" opacity="0"/>
        {/* radial vignette */}
        <radialGradient id="vigRad" cx="50%" cy="50%" r="75%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0"/>
          <stop offset="68%"  stopColor="#000" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.72"/>
        </radialGradient>
        <rect x={0} y={0} width={1200} height={700} fill="url(#vigRad)"/>
      </svg>
    </div>
  );
}
function HomeHero({ onOrderClick }) {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Canvas BG */}
      <HeroCanvas />
      {/* Content */}
      <div className="hero-content-anim" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 820, padding: "0 2rem" }}>
        <img src={LOGO_SRC} alt="" style={{ height: 88, margin: "0 auto 1.5rem", display: "block", filter: "brightness(0) invert(1)" }} onError={e => e.target.style.display = "none"} />
        <div style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <span style={{ width: 40, height: 1, background: "#D4A843", opacity: 0.6, display: "inline-block" }} />
          Best Vietnamese Restaurant in Calgary
          <span style={{ width: 40, height: 1, background: "#D4A843", opacity: 0.6, display: "inline-block" }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem,7vw,6rem)", fontWeight: 400, color: "#F5EDD8", lineHeight: 1.05, marginBottom: "0.3rem" }}>
          Pho <em style={{ fontStyle: "italic", color: "#D4A843" }}>Huong</em> Viet
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2.2vw,1.4rem)", fontStyle: "italic", color: "rgba(245,237,216,0.75)", margin: "1.2rem 0 2.5rem", fontWeight: 300 }}>
          Over 20 years of authentic Vietnamese flavours on 17 Ave SW, Calgary
        </p>
        <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#menu" style={{ background: "#C4882B", color: "white", padding: "1rem 2.4rem", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s", display: "inline-block" }}
            onMouseEnter={e => { e.target.style.background = "#6B1A1A"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#C4882B"; e.target.style.transform = "translateY(0)"; }}
          >Explore Our Menu</a>
          <button onClick={onOrderClick} style={{ background: "transparent", color: "#F5EDD8", padding: "1rem 2.4rem", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "1px solid rgba(245,237,216,0.45)", cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.borderColor = "#D4A843"; e.target.style.color = "#D4A843"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(245,237,216,0.45)"; e.target.style.color = "#F5EDD8"; }}
          >Order Online</button>
        </div>
      </div>
      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "rgba(245,237,216,0.5)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        <div className="scroll-line-anim" style={{ width: 1, height: 50, background: "linear-gradient(to bottom,rgba(245,237,216,0.5),transparent)" }} />
        Scroll
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Over 20 Years in Calgary", "Fresh ingredients, every day", "Authentic Vietnamese cuisine", "Dine-in · Pick-up · Delivery", "#3855 17 Ave SW, Calgary, AB"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#6B1A1A", padding: "1.2rem 0", overflow: "hidden" }}>
      <div className="marquee-track" style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(245,237,216,0.75)", letterSpacing: "0.05em", flexShrink: 0, display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ color: "#D4A843", fontSize: "0.5rem", fontStyle: "normal" }}>◆</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function AboutSection() {
  const ref = useReveal();
  return (
    <section id="about" style={{ padding: "7rem 4rem" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4882B", marginBottom: "1rem" }}>Our Story</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, lineHeight: 1.15, color: "#1E1410", marginBottom: "2rem" }}>
            Calgary's beloved<br /><em style={{ color: "#6B1A1A" }}>Vietnamese kitchen</em>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", lineHeight: 1.85, color: "#4A3828", marginBottom: "1.4rem", fontWeight: 300 }}>
            Located at #3855 - 17 Ave SW, Pho Huong Viet has been one of Calgary's best choices for authentic Vietnamese cuisine for over 20 years. What started as a family passion has grown into a beloved neighbourhood institution.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", lineHeight: 1.85, color: "#4A3828", marginBottom: "1.4rem", fontWeight: 300 }}>
            We always use fresh ingredients to bring out the true taste in every dish — a difference you will notice the moment your bowl arrives. Must-tries: Grilled Beef Lemon with Steamed Rice, the Sate Chicken Sub, and our signature Pho Dac Biet.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "3rem", paddingTop: "3rem", borderTop: "1px solid rgba(107,26,26,0.15)" }}>
            {[["20+", "Years of Experience"], ["4.3★", "Guest Rated"], ["50+", "Menu Items"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "#6B1A1A", lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#7A6050", marginTop: "0.4rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-1.5rem", right: "-1.5rem", width: 110, height: 110, background: "#6B1A1A", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#F5EDD8", boxShadow: "0 8px 30px rgba(107,26,26,0.3)", zIndex: 2 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, lineHeight: 1 }}>★ 4.3</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75, textAlign: "center" }}>Guest<br />Rated</div>
          </div>
          <img src="https://phohuongviet17.com/wp-content/uploads/2023/10/native.jpg" alt="Restaurant" style={{ width: "100%", height: 540, objectFit: "cover", display: "block" }} onError={e => e.target.src = "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=700&q=80"} />
          <img src="https://phohuongviet17.com/wp-content/uploads/2024/04/photo6.jpg" alt="Vietnamese food" style={{ position: "absolute", bottom: "-3rem", left: "-3rem", width: "52%", height: 200, objectFit: "cover", border: "6px solid #FBF6EE", boxShadow: "0 20px 60px rgba(30,20,16,0.18)" }} onError={e => e.target.src = "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80"} />
        </div>
      </div>
    </section>
  );
}

function DeliveryBanner({ onOrderClick }) {
  const ref = useReveal();
  const btnStyle = (bg) => ({
    display: "flex", alignItems: "center", gap: "0.7rem",
    padding: "0.85rem 1.8rem", borderRadius: 3, textDecoration: "none",
    fontSize: "0.85rem", fontWeight: 500, transition: "all 0.3s",
    background: bg, color: "white", border: "none", cursor: "pointer",
  });
  return (
    <div style={{ background: "#F5EDD8", padding: "3rem 4rem", borderTop: "1px solid rgba(107,26,26,0.1)", borderBottom: "1px solid rgba(107,26,26,0.1)" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1E1410", marginBottom: "0.4rem" }}>Order Your Favourites</h3>
          <p style={{ fontSize: "0.9rem", color: "#6A5040" }}>Pick up in-store or have your meal delivered right to your door</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <a href="https://www.skipthedishes.com/pho-huong-viet" target="_blank" rel="noreferrer" style={btnStyle("#E8344D")}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >🛵 Skip the Dishes</a>
          <a href="https://www.doordash.com/store/pho-huong-viet-calgary-567238" target="_blank" rel="noreferrer" style={btnStyle("#FF3008")}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >🚗 DoorDash</a>
          <button onClick={onOrderClick} style={btnStyle("#6B1A1A")}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >🥡 Order Pick-Up</button>
        </div>
      </div>
    </div>
  );
}

function MenuSection() {
  const [activeTab, setActiveTab] = useState("pho");
  const ref = useReveal();
  const tabsRef = useReveal();
  const homeTabs = [
    { id: "pho", label: "Pho & Soups", items: [
      { name: "Special Beef Pho", viet: "Phở Đặc Biệt", desc: "Beef, beef ball, tendon, flank and tripe with rice noodles in our signature savoury beef broth.", price: "From $15", tag: "House Special", img: "https://phohuongviet17.com/wp-content/uploads/2024/04/photo5.jpg", fallback: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80" },
      { name: "Sate Beef Noodle Soup", viet: "Phở Bò Sate", desc: "Mildly spicy sate beef with rice noodles in a rich savoury beef broth.", price: "From $15", tag: "Fan Favourite", img: "https://phohuongviet17.com/wp-content/uploads/2024/04/photo4.jpg", fallback: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
      { name: "Chicken Noodle Soup", viet: "Phở Gà", desc: "Tender chicken with rice or egg noodles in our fragrant, golden chicken broth.", price: "From $14", tag: "Light & Delicate", img: "https://phohuongviet17.com/wp-content/uploads/2024/04/photo7.jpg", fallback: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80" },
    ]},
    { id: "mains", label: "Mains & Subs", items: [
      { name: "Grilled Beef Lemon with Rice", viet: "Cơm Bò Nướng Chanh", desc: "Lemon-marinated beef chargrilled and served over steamed rice.", price: "From $16", tag: "Signature", img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80", fallback: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80" },
      { name: "Sate Chicken Sub", viet: "Bánh Mì Gà Sate", desc: "Vietnamese baguette with sate chicken, mayo, pickled carrot, cucumbers and cilantro.", price: "From $10", tag: "Must Try", img: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80", fallback: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80" },
      { name: "Stir-Fried Veg & Tofu", viet: "Mì Xào Rau Đậu Hủ", desc: "Wok-tossed vegetables and tofu on golden egg noodles. Vegetarian favourite.", price: "From $14", tag: "Vegetarian", img: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80", fallback: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80" },
    ]},
    { id: "drinks", label: "Drinks", items: [
      { name: "Vietnamese Iced Coffee", viet: "Cà Phê Sữa Đá", desc: "Vietnamese dark-roast dripped through a French filter with condensed milk over ice.", price: "~$5", tag: "Classic", img: "https://images.unsplash.com/photo-1559181567-c3190ca9be39?w=600&q=80", fallback: "https://images.unsplash.com/photo-1559181567-c3190ca9be39?w=600&q=80" },
      { name: "Bubble Tea", viet: "Trà Sữa Trân Châu", desc: "Bubble tea with chewy tapioca pearls. Available in multiple flavours.", price: "~$6", tag: "Refreshing", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", fallback: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
      { name: "Fresh Squeezed Juices", viet: "Nước Trái Cây Tươi", desc: "Freshly squeezed lemon or orange juice made to order. Fresh coconut water available.", price: "~$4", tag: "Fresh Daily", img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", fallback: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80" },
    ]},
  ];
  const active = homeTabs.find(t => t.id === activeTab);
  return (
    <div id="menu" style={{ background: "#1E1410", padding: "7rem 4rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle,rgba(107,26,26,0.25) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div ref={tabsRef} className="reveal" style={{ maxWidth: 1300, margin: "0 auto 4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>What We Serve</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, lineHeight: 1.15, color: "#F5EDD8" }}>
            Taste the <em style={{ fontStyle: "italic", color: "#D4A843" }}>Flavours<br />of Vietnam</em>
          </h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {homeTabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "0.6rem 1.2rem", fontSize: "0.78rem", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 500, border: "1px solid",
              borderColor: activeTab === t.id ? "#C4882B" : "rgba(245,237,216,0.2)",
              color: activeTab === t.id ? "white" : "rgba(245,237,216,0.55)",
              background: activeTab === t.id ? "#C4882B" : "none",
              cursor: "pointer", transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="reveal" style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px" }}>
        {active && active.items.map(item => (
          <div key={item.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,237,216,0.07)", overflow: "hidden", transition: "all 0.4s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ overflow: "hidden", height: 210 }}>
              <img src={item.img} alt={item.name} style={{ width: "100%", height: 210, objectFit: "cover", display: "block", transition: "transform 0.6s" }}
                onError={e => e.target.src = item.fallback}
                onMouseEnter={e => e.target.style.transform = "scale(1.07)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              />
            </div>
            <div style={{ padding: "1.6rem 1.8rem 0.5rem" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#F5EDD8", marginBottom: "0.4rem" }}>{item.name}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontStyle: "italic", color: "#D4A843", marginBottom: "0.8rem", opacity: 0.85 }}>{item.viet}</div>
              <div style={{ fontSize: "0.84rem", lineHeight: 1.65, color: "rgba(245,237,216,0.5)" }}>{item.desc}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.8rem 1.5rem" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#C4882B" }}>{item.price}</span>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 0.8rem", border: "1px solid rgba(212,168,67,0.3)", color: "rgba(212,168,67,0.7)" }}>{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GallerySection() {
  const ref = useReveal();
  const photos = [
    { src: "https://phohuongviet17.com/wp-content/uploads/2023/10/FullSizeRender-45-1-768x1024.jpg", fb: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" },
    { src: "https://phohuongviet17.com/wp-content/uploads/2024/04/photo4.jpg", fb: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80" },
    { src: "https://phohuongviet17.com/wp-content/uploads/2023/10/279451493_158886583254675_4425778237888570373_n-768x768.jpg", fb: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80" },
    { src: "https://phohuongviet17.com/wp-content/uploads/2024/04/photo7.jpg", fb: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80" },
    { src: "https://phohuongviet17.com/wp-content/uploads/2025/03/IMG_4272.jpg", fb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
  ];
  return (
    <section id="gallery" style={{ background: "#F5EDD8", padding: "6rem 4rem" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div ref={ref} className="reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4882B", marginBottom: "1rem" }}>Our Food & Space</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, color: "#1E1410" }}>
            Real food, <em style={{ color: "#6B1A1A" }}>real flavours</em>
          </h2>
        </div>
        <div ref={useReveal()} className="reveal photo-grid">
          {photos.map((p, i) => (
            <img key={i} src={p.src} alt={`Pho Huong Viet ${i + 1}`} onError={e => e.target.src = p.fb} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useReveal();
  const reviews = [
    { text: "My family has been coming here for many years. Our favourites are definitely the Pho Noodles! All their dishes are equally sumptuous. A nice cozy place to enjoy some hot meals.", author: "Alice Woo", source: "Google Review" },
    { text: "Pho Huong Viet offers an authentic Vietnamese experience. The pho dac biet was exceptional — rich broth, tender beef, perfectly cooked noodles. Cozy ambiance and friendly staff.", author: "Andrew Le", source: "Google Review" },
    { text: "We recently found this place and it was a treat. Pho portions are huge, the rice porkchop is great. Best pho we've had in a while. It's our new favourite Vietnamese spot in Calgary!", author: "TripAdvisor Guest", source: "TripAdvisor" },
  ];
  return (
    <div style={{ background: "#6B1A1A", padding: "7rem 4rem" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>Guest Voices</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, color: "#F5EDD8" }}>
            What our <em style={{ color: "#D4A843" }}>customers say</em>
          </h2>
        </div>
        <div ref={ref} className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
          {reviews.map(r => (
            <div key={r.author} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(245,237,216,0.1)", padding: "2.5rem" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "4rem", color: "#D4A843", opacity: 0.4, lineHeight: 0.8, marginBottom: "1rem" }}>"</div>
              <div style={{ color: "#D4A843", fontSize: "0.85rem", marginBottom: "1rem", letterSpacing: "0.1em" }}>★★★★★</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(245,237,216,0.8)", fontStyle: "italic", marginBottom: "1.5rem" }}>{r.text}</p>
              <div style={{ fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.08em", color: "rgba(245,237,216,0.5)", textTransform: "uppercase" }}>— {r.author}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(212,168,67,0.6)", marginTop: "0.3rem" }}>{r.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisitSection({ onOrderClick }) {
  const ref = useReveal();
  return (
    <section id="visit" style={{ padding: "7rem 4rem" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.0!2d-114.1450!3d51.0390!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170144939363b%3A0x7d68671f6f9c0a50!2sPho%20Huong%20Viet%20Noodle%20House!5e0!3m2!1sen!2sca!4v1"
            title="Pho Huong Viet location"
            allowFullScreen loading="lazy"
            style={{ width: "100%", height: 400, border: "none", display: "block" }}
          />
          <div style={{ background: "#6B1A1A", padding: "1.4rem 1.8rem" }}>
            <strong style={{ color: "#D4A843", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.35rem" }}>📍 Find Us</strong>
            <p style={{ color: "#F5EDD8", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem" }}>#3855 - 17 Ave SW, Calgary, AB T3C 1J7</p>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4882B", marginBottom: "1rem" }}>Plan Your Visit</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, lineHeight: 1.15, color: "#1E1410", marginBottom: "2.5rem" }}>
            Hours &<br /><em style={{ color: "#6B1A1A" }}>Location</em>
          </h2>
          <table className="hours-table">
            <tbody>
              <tr><td>Monday</td><td>11:00 am – 4:00 pm</td></tr>
              <tr><td>Tuesday – Sunday</td><td>11:00 am – 9:00 pm</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            {[
              { label: "📞 (403) 686-3799", href: "tel:+14036863799" },
              { label: "📷 Instagram", href: "https://www.instagram.com/pho.huongviet/" },
            ].map(c => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 1.2rem", background: "#F5EDD8", fontSize: "0.85rem", color: "#2A1A0E", textDecoration: "none", border: "1px solid rgba(107,26,26,0.15)", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#6B1A1A"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#F5EDD8"; e.currentTarget.style.color = "#2A1A0E"; }}
              >{c.label}</a>
            ))}
            <button onClick={onOrderClick} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 1.2rem", background: "#F5EDD8", fontSize: "0.85rem", color: "#2A1A0E", textDecoration: "none", border: "1px solid rgba(107,26,26,0.15)", transition: "all 0.3s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#6B1A1A"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F5EDD8"; e.currentTarget.style.color = "#2A1A0E"; }}
            >🥡 Order Pick-Up</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderCTASection({ onOrderClick }) {
  const ref = useReveal();
  const btnStyle = (bg) => ({
    display: "flex", alignItems: "center", gap: "0.8rem",
    padding: "1.1rem 2rem", fontSize: "0.9rem", fontWeight: 500,
    letterSpacing: "0.08em", textTransform: "uppercase",
    textDecoration: "none", border: "none", cursor: "pointer",
    transition: "all 0.3s", background: bg, color: "white",
    fontFamily: "'DM Sans', sans-serif",
  });
  return (
    <div style={{ background: "#1E1410", padding: "7rem 4rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-4rem", right: "-2rem", fontFamily: "'Playfair Display', serif", fontSize: "20rem", color: "rgba(255,255,255,0.02)", pointerEvents: "none", lineHeight: 1, userSelect: "none" }}>"PHỞ"</div>
      <div ref={ref} className="reveal" style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>Ready to Eat?</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, color: "#F5EDD8", marginBottom: "1.5rem" }}>
          Order Your <em style={{ color: "#D4A843" }}>Favourites</em>
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgba(245,237,216,0.55)", fontStyle: "italic", marginBottom: "3rem" }}>
          Dine in, pick up, or have it delivered right to your door
        </p>
        <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <a href="https://www.skipthedishes.com/pho-huong-viet" target="_blank" rel="noreferrer" style={btnStyle("#E8344D")}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 35px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >🛵 Order on SkipTheDishes</a>
          <a href="https://www.doordash.com/store/pho-huong-viet-calgary-567238" target="_blank" rel="noreferrer" style={btnStyle("#FF3008")}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 35px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >🚗 Order on DoorDash</a>
          <button onClick={onOrderClick} style={btnStyle("#C4882B")}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 35px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >🥡 Pick-Up Online</button>
        </div>
        <p style={{ fontSize: "0.82rem", color: "rgba(245,237,216,0.35)" }}>
          Allergies? Call us at{" "}
          <a href="tel:+14036863799" style={{ color: "#D4A843", textDecoration: "none" }}>(403) 686-3799</a>
        </p>
      </div>
    </div>
  );
}

function HomeFooter({ onOrderClick }) {
  return (
    <footer style={{ background: "#120C08", padding: "4rem", textAlign: "center" }}>
      <img src={LOGO_SRC} alt="Pho Huong Viet" style={{ height: 60, margin: "0 auto 0.5rem", display: "block", opacity: 0.85 }} onError={e => e.target.style.display = "none"} />
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(245,237,216,0.35)", fontSize: "0.95rem", marginBottom: "2.5rem" }}>
        Authentic Vietnamese Kitchen · Over 20 Years · Calgary, AB
      </div>
      <div style={{ width: 60, height: 1, background: "rgba(212,168,67,0.3)", margin: "0 auto 2.5rem" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {[["About", "#about"], ["Menu", "#menu"], ["Gallery", "#gallery"], ["Visit Us", "#visit"]].map(([label, href]) => (
          <a key={label} href={href} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,237,216,0.4)", textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => e.target.style.color = "#D4A843"}
            onMouseLeave={e => e.target.style.color = "rgba(245,237,216,0.4)"}
          >{label}</a>
        ))}
        <button onClick={onOrderClick} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,237,216,0.4)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s" }}
          onMouseEnter={e => e.target.style.color = "#D4A843"}
          onMouseLeave={e => e.target.style.color = "rgba(245,237,216,0.4)"}
        >Order Online</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "3rem" }}>
        {[["📷", "https://www.instagram.com/pho.huongviet/"], ["🛵", "https://www.skipthedishes.com/pho-huong-viet"], ["🚗", "https://www.doordash.com/store/pho-huong-viet-calgary-567238"]].map(([icon, href]) => (
          <a key={icon} href={href} target="_blank" rel="noreferrer" style={{ width: 40, height: 40, border: "1px solid rgba(245,237,216,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,237,216,0.4)", textDecoration: "none", fontSize: "0.95rem", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#C4882B"; e.currentTarget.style.borderColor = "#C4882B"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(245,237,216,0.15)"; e.currentTarget.style.color = "rgba(245,237,216,0.4)"; }}
          >{icon}</a>
        ))}
      </div>
      <div style={{ fontSize: "0.72rem", color: "rgba(245,237,216,0.2)", letterSpacing: "0.08em" }}>
        © 2025 Pho Huong Viet · #3855 17 Ave SW, Calgary, AB T3C 1J7 · (403) 686-3799
      </div>
    </footer>
  );
}

function HomePage({ onOrderClick }) {
  return (
    <div>
      <HomeNav onOrderClick={onOrderClick} />
      <HomeHero onOrderClick={onOrderClick} />
      <Marquee />
      <AboutSection />
      <DeliveryBanner onOrderClick={onOrderClick} />
      <MenuSection />
      <GallerySection />
      <TestimonialsSection />
      <VisitSection onOrderClick={onOrderClick} />
      <OrderCTASection onOrderClick={onOrderClick} />
      <HomeFooter onOrderClick={onOrderClick} />
    </div>
  );
}

// ─────────────────────────────────────────────
// ORDER PAGE
// ─────────────────────────────────────────────

// ── Ably publish helper ──────────────────────
async function publishOrderToKitchen(order) {
  const key = localStorage.getItem("ably_api_key") || "";
  if (!key) return { ok: false, reason: "no_key" };
  try {
    const res = await fetch(
      "https://rest.ably.io/channels/pho-kitchen-orders/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(key),
        },
        body: JSON.stringify({
          name: "new-order",
          data: JSON.stringify({ type: "NEW_ORDER", order }),
        }),
      }
    );
    return res.ok ? { ok: true } : { ok: false, reason: `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, reason: e.message || "network error" };
  }
}

// ── Kitchen settings modal ───────────────────
function KitchenSettingsModal({ open, onClose }) {
  const [key, setKey] = useState(() => localStorage.getItem("ably_api_key") || "");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | 'ok' | 'fail'

  const save = () => {
    localStorage.setItem("ably_api_key", key.trim());
    onClose();
  };

  const testConnection = async () => {
    if (!key.trim()) return;
    setTesting(true); setTestResult(null);
    // Send a tiny ping message
    try {
      const res = await fetch(
        "https://rest.ably.io/channels/pho-kitchen-orders/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(key.trim()),
          },
          body: JSON.stringify({ name: "ping", data: "test" }),
        }
      );
      setTestResult(res.ok ? "ok" : "fail");
    } catch { setTestResult("fail"); }
    setTesting(false);
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#1A0A06", border: "1px solid rgba(212,168,67,0.2)", width: "100%", maxWidth: 480, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
        {/* Header */}
        <div style={{ padding: "1.3rem 1.6rem", borderBottom: "1px solid rgba(212,168,67,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#F5EDD8" }}>
              🍜 Kitchen App <em style={{ color: "#D4A843" }}>Connection</em>
            </div>
            <div style={{ fontSize: "0.68rem", color: "rgba(212,168,67,0.55)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "0.2rem" }}>
              Ably Realtime · pho-kitchen-orders
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,237,216,0.4)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "1.6rem" }}>
          {/* Status indicator */}
          <div style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.15)", padding: "0.9rem 1rem", marginBottom: "1.4rem", fontSize: "0.8rem", color: "rgba(245,237,216,0.6)", lineHeight: 1.65 }}>
            Orders placed on this website are sent live to the{" "}
            <strong style={{ color: "#D4A843" }}>Pho Kitchen App</strong> via Ably.
            Paste your Ably API key below to connect.{" "}
            <a href="https://ably.com" target="_blank" rel="noreferrer" style={{ color: "#C4882B", textDecoration: "none" }}>Get a free key at ably.com →</a>
          </div>

          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "rgba(212,168,67,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Ably API Key
          </label>
          <input
            type="text"
            value={key}
            onChange={e => { setKey(e.target.value); setTestResult(null); }}
            placeholder="xxxxxx.xxxxxx:xxxxxxxxxxxxxxxxxxxxxxxx"
            style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,168,67,0.2)", color: "#F5EDD8", fontFamily: "monospace", fontSize: "0.82rem", outline: "none", marginBottom: "0.6rem" }}
            onFocus={e => e.target.style.borderColor = "#D4A843"}
            onBlur={e => e.target.style.borderColor = "rgba(212,168,67,0.2)"}
          />
          <div style={{ fontSize: "0.7rem", color: "rgba(245,237,216,0.35)", marginBottom: "1.4rem", fontFamily: "monospace" }}>
            Format: appId.keyId:keySecret
          </div>

          {/* Test result */}
          {testResult && (
            <div style={{ padding: "0.65rem 1rem", marginBottom: "1rem", fontSize: "0.82rem", fontWeight: 500, background: testResult === "ok" ? "rgba(39,174,96,0.1)" : "rgba(192,57,43,0.12)", border: `1px solid ${testResult === "ok" ? "rgba(39,174,96,0.3)" : "rgba(192,57,43,0.3)"}`, color: testResult === "ok" ? "#27AE60" : "#E74C3C" }}>
              {testResult === "ok" ? "✅ Connected — kitchen app will receive orders" : "❌ Connection failed — check your API key"}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.7rem" }}>
            <button onClick={testConnection} disabled={!key.trim() || testing} style={{ flex: 1, padding: "0.75rem", background: "transparent", border: "1px solid rgba(212,168,67,0.3)", color: "#D4A843", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: key.trim() ? "pointer" : "not-allowed", opacity: key.trim() ? 1 : 0.4, transition: "all 0.2s" }}>
              {testing ? "Testing…" : "Test Connection"}
            </button>
            <button onClick={save} style={{ flex: 2, padding: "0.75rem", background: "#6B1A1A", border: "none", color: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e => e.target.style.background = "#C4882B"}
              onMouseLeave={e => e.target.style.background = "#6B1A1A"}
            >Save & Close</button>
          </div>

          {/* Current status pill */}
          <div style={{ marginTop: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: localStorage.getItem("ably_api_key") ? "#27AE60" : "rgba(245,237,216,0.2)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.7rem", color: "rgba(245,237,216,0.35)", letterSpacing: "0.08em" }}>
              {localStorage.getItem("ably_api_key") ? "API key saved — live orders active" : "No key saved — orders won't reach kitchen app"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderNav({ onBack, cartCount, onCartOpen, onSettingsOpen, ablyConnected }) {
  return (
    <header style={{ background: "#1E1410", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 30px rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(212,168,67,0.12)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={onBack} style={{ color: "rgba(245,237,216,0.45)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s" }}
            onMouseEnter={e => e.target.style.color = "#D4A843"}
            onMouseLeave={e => e.target.style.color = "rgba(245,237,216,0.45)"}
          >← Home</button>
          <div style={{ width: 1, height: 24, background: "rgba(212,168,67,0.2)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <img src={LOGO_SRC} alt="" style={{ height: 40, width: "auto" }} onError={e => e.target.style.display = "none"} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#F5EDD8" }}>Pho Huong Viet</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(212,168,67,0.7)", letterSpacing: "0.18em", textTransform: "uppercase" }}>17 Ave SW · Calgary</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {/* Kitchen connection status + settings */}
          <button onClick={onSettingsOpen} title="Kitchen App Settings" style={{ display: "flex", alignItems: "center", gap: "0.45rem", background: ablyConnected ? "rgba(39,174,96,0.1)" : "rgba(245,237,216,0.05)", border: `1px solid ${ablyConnected ? "rgba(39,174,96,0.3)" : "rgba(245,237,216,0.12)"}`, color: ablyConnected ? "#27AE60" : "rgba(245,237,216,0.4)", padding: "0.35rem 0.8rem", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A843"; e.currentTarget.style.color = "#D4A843"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ablyConnected ? "rgba(39,174,96,0.3)" : "rgba(245,237,216,0.12)"; e.currentTarget.style.color = ablyConnected ? "#27AE60" : "rgba(245,237,216,0.4)"; }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ablyConnected ? "#27AE60" : "rgba(245,237,216,0.25)", display: "inline-block", flexShrink: 0 }} />
            {ablyConnected ? "Kitchen Live" : "Kitchen ⚙"}
          </button>
          <span style={{ background: "rgba(196,136,43,0.15)", border: "1px solid rgba(196,136,43,0.3)", color: "#D4A843", padding: "0.35rem 0.9rem", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            🥡 Pick Up Only
          </span>
          <button onClick={onCartOpen} style={{ background: "#C4882B", color: "white", border: "none", padding: "0.6rem 1.3rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem", transition: "background 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#8B2B2B"}
            onMouseLeave={e => e.currentTarget.style.background = "#C4882B"}
          >
            🛒 Cart
            <span style={{ background: "#1E1410", color: "#D4A843", borderRadius: "50%", width: 20, height: 20, fontSize: "0.72rem", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function OrderHero() {
  return (
    <div style={{ background: "#1E1410", position: "relative", overflow: "hidden", padding: "3.5rem 2.5rem", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: PATTERN_BG, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right,transparent,rgba(212,168,67,0.25),transparent)" }} />
      <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}>
        <span style={{ width: 30, height: 1, background: "#D4A843", opacity: 0.5, display: "inline-block" }} />
        Pho Huong Viet · 17 Ave SW
        <span style={{ width: 30, height: 1, background: "#D4A843", opacity: 0.5, display: "inline-block" }} />
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 400, color: "#F5EDD8", marginBottom: "0.6rem" }}>
        Order <em style={{ fontStyle: "italic", color: "#D4A843" }}>Pick Up</em>
      </h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", color: "rgba(245,237,216,0.55)", fontWeight: 300, marginBottom: "1.5rem" }}>
        Fresh, authentic Vietnamese cuisine — ready when you are
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        {["📍 #3855 17 Ave SW, Calgary", "📞 (403) 686-3799", "🕐 Mon 11am–4pm · Tue–Sun 11am–9pm"].map(t => (
          <span key={t} style={{ fontSize: "0.78rem", color: "rgba(212,168,67,0.75)", letterSpacing: "0.08em" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function MenuCard({ item, qty, onAdd, onRemove }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: "white", border: "1px solid rgba(107,26,26,0.14)",
      padding: "1.3rem 1.4rem",
      display: "flex", flexDirection: "column", gap: "0.6rem",
      transition: "all 0.25s",
      boxShadow: hovered ? "0 8px 32px rgba(107,26,26,0.12)" : "0 2px 24px rgba(107,26,26,0.07)",
      transform: hovered ? "translateY(-2px)" : "none",
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.35, color: "#2A1A0E" }}>
        {item.name}
        {(item.tags || []).map(t => <Tag key={t} type={t} />)}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", lineHeight: 1.6, flex: 1, color: "#6A5040", fontWeight: 300 }}>{item.desc}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.3rem", paddingTop: "0.7rem", borderTop: "1px solid rgba(107,26,26,0.08)" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#6B1A1A" }}>${item.price.toFixed(2)}</span>
        {qty === 0 ? (
          <button onClick={() => onAdd(item.id)} style={{ background: "#6B1A1A", color: "white", border: "none", width: 32, height: 32, fontSize: "1.2rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            onMouseEnter={e => e.target.style.background = "#C4882B"}
            onMouseLeave={e => e.target.style.background = "#6B1A1A"}
          >+</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => onRemove(item.id)} style={{ background: "#FBF6EE", border: "1px solid rgba(107,26,26,0.14)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", color: "#2A1A0E" }}>−</button>
            <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center", fontSize: "0.95rem", color: "#6B1A1A" }}>{qty}</span>
            <button onClick={() => onAdd(item.id)} style={{ background: "#FBF6EE", border: "1px solid rgba(107,26,26,0.14)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", color: "#2A1A0E" }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SideCart({ cart, onAdd, onRemove, onRemoveFull, onCheckout }) {
  const total = Object.entries(cart).reduce((s, [id, qty]) => s + (getItem(Number(id))?.price || 0) * qty, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <div style={{ position: "sticky", top: 80, maxHeight: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "white", border: "1px solid rgba(107,26,26,0.14)", boxShadow: "0 2px 24px rgba(107,26,26,0.07)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 100px)" }}>
        <div style={{ background: "#1E1410", padding: "1.1rem 1.4rem", fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#F5EDD8", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid rgba(212,168,67,0.12)", flexShrink: 0 }}>
          🛒 Your Order
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(212,168,67,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", marginLeft: "auto" }}>Pick Up</span>
        </div>
        <div className="cart-list-scroll" style={{ padding: "0.8rem 1rem", flex: 1, overflowY: "auto" }}>
          {count === 0 ? (
            <div style={{ textAlign: "center", color: "#7A6050", padding: "2rem 1rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", lineHeight: 1.6 }}>
              Your cart is empty.<br />Add items from the menu.
            </div>
          ) : (
            Object.entries(cart).map(([id, qty]) => {
              const item = getItem(Number(id));
              if (!item) return null;
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0", borderBottom: "1px solid rgba(107,26,26,0.07)", fontSize: "0.82rem" }}>
                  <div style={{ flex: 1, fontWeight: 500, lineHeight: 1.3, color: "#2A1A0E" }}>{item.name}</div>
                  <div style={{ color: "#7A6050", fontSize: "0.75rem" }}>×{qty}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#6B1A1A", whiteSpace: "nowrap", fontSize: "0.9rem" }}>${(item.price * qty).toFixed(2)}</div>
                  <button onClick={() => onRemoveFull(Number(id))} style={{ background: "none", border: "none", color: "rgba(107,26,26,0.3)", cursor: "pointer", fontSize: "0.9rem", padding: "2px 4px", transition: "color 0.15s" }}
                    onMouseEnter={e => e.target.style.color = "#6B1A1A"}
                    onMouseLeave={e => e.target.style.color = "rgba(107,26,26,0.3)"}
                  >✕</button>
                </div>
              );
            })
          )}
        </div>
        {count > 0 && (
          <div style={{ padding: "1rem 1.2rem", borderTop: "1px solid rgba(107,26,26,0.14)", background: "rgba(245,237,216,0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "1rem", marginBottom: "0.9rem" }}>
              <span>Subtotal</span>
              <span style={{ fontFamily: "'Playfair Display', serif", color: "#6B1A1A" }}>${total.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} style={{ width: "100%", background: "#6B1A1A", color: "white", border: "none", padding: "0.95rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.25s" }}
              onMouseEnter={e => e.target.style.background = "#C4882B"}
              onMouseLeave={e => e.target.style.background = "#6B1A1A"}
            >Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileCartDrawer({ open, onClose, cart, onAdd, onRemove, onRemoveFull, onCheckout }) {
  const total = Object.entries(cart).reduce((s, [id, qty]) => s + (getItem(Number(id))?.price || 0) * qty, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200 }} />}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderRadius: "16px 16px 0 0", maxHeight: "82vh", overflowY: "auto", zIndex: 201, paddingBottom: "2rem", transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease", borderTop: "2px solid rgba(107,26,26,0.15)" }}>
        <div onClick={onClose} style={{ textAlign: "center", padding: "0.9rem", cursor: "pointer" }}>
          <span style={{ display: "inline-block", width: 40, height: 4, background: "rgba(107,26,26,0.14)", borderRadius: 2 }} />
        </div>
        <div style={{ padding: "0 1.2rem 1rem" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", color: "#1E1410" }}>Your Order</div>
          {count === 0 ? (
            <div style={{ textAlign: "center", color: "#7A6050", padding: "1.5rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Your cart is empty.</div>
          ) : (
            <>
              {Object.entries(cart).map(([id, qty]) => {
                const item = getItem(Number(id));
                if (!item) return null;
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0", borderBottom: "1px solid rgba(107,26,26,0.07)", fontSize: "0.82rem" }}>
                    <div style={{ flex: 1, fontWeight: 500 }}>{item.name}</div>
                    <div style={{ color: "#7A6050" }}>×{qty}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#6B1A1A" }}>${(item.price * qty).toFixed(2)}</div>
                    <button onClick={() => onRemoveFull(Number(id))} style={{ background: "none", border: "none", color: "#7A6050", cursor: "pointer" }}>✕</button>
                  </div>
                );
              })}
              <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: "0.8rem", fontSize: "1rem" }}>
                  <span>Subtotal</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", color: "#6B1A1A" }}>${total.toFixed(2)}</span>
                </div>
                <button onClick={() => { onClose(); onCheckout(); }} style={{ width: "100%", background: "#6B1A1A", color: "white", border: "none", padding: "0.95rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                  Proceed to Checkout →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CheckoutModal({ open, onClose, cart, onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [kitchenStatus, setKitchenStatus] = useState(null); // null | 'sending' | 'sent' | 'no_key' | 'failed'

  const total = Object.entries(cart).reduce((s, [id, qty]) => s + (getItem(Number(id))?.price || 0) * qty, 0);

  const handlePlace = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) { alert("Please fill in your name, phone and email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Please enter a valid email address."); return; }
    setPlacing(true);

    const id = "PHV-" + Date.now().toString(36).toUpperCase().slice(-6);

    // Build the Order object matching the kitchen app's types.ts
    const order = {
      orderId: id,
      timestamp: new Date().toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" }),
      type: "PICKUP",
      customer: { name: name.trim(), phone: phone.trim(), email: email.trim() },
      specialInstructions: notes.trim() || "None",
      items: Object.entries(cart).map(([itemId, qty]) => {
        const item = getItem(Number(itemId));
        return { id: Number(itemId), name: item.name, qty, unitPrice: item.price, subtotal: item.price * qty };
      }),
      total,
      restaurant: "Pho Huong Viet 17Ave SW",
      restaurantPhone: "(403) 686-3799",
    };

    // Send to kitchen app via Ably
    setKitchenStatus("sending");
    const result = await publishOrderToKitchen(order);
    if (result.ok) {
      setKitchenStatus("sent");
    } else if (result.reason === "no_key") {
      setKitchenStatus("no_key");
    } else {
      setKitchenStatus("failed");
    }

    setOrderId(id);
    setSuccess(true);
    setPlacing(false);
    onSuccess();
  };

  const handleClose = () => {
    setSuccess(false); setName(""); setPhone(""); setEmail(""); setNotes("");
    setKitchenStatus(null); setPlacing(false);
    onClose();
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem", border: "1px solid rgba(107,26,26,0.14)",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", color: "#2A1A0E",
    background: "white", outline: "none",
  };
  const labelStyle = { display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#7A6050", marginBottom: "0.4rem", letterSpacing: "0.1em", textTransform: "uppercase" };

  if (!open) return null;

  const kitchenBadge = {
    sending: { bg: "rgba(41,128,185,0.1)",  border: "rgba(41,128,185,0.3)",  color: "#2980B9", text: "⏳ Notifying kitchen…" },
    sent:    { bg: "rgba(39,174,96,0.1)",   border: "rgba(39,174,96,0.3)",   color: "#27AE60", text: "✅ Kitchen app notified!" },
    no_key:  { bg: "rgba(243,156,18,0.1)",  border: "rgba(243,156,18,0.3)",  color: "#F39C12", text: "⚠️ Kitchen app not connected — configure in order page settings" },
    failed:  { bg: "rgba(192,57,43,0.08)",  border: "rgba(192,57,43,0.25)", color: "#C0392B", text: "⚠️ Kitchen notify failed — check Ably key in settings" },
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,8,0,0.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "white", width: "100%", maxWidth: 520, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ background: "#1E1410", color: "#F5EDD8", padding: "1.4rem 1.6rem", fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 400, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
          Complete Your <em style={{ fontStyle: "italic", color: "#D4A843", marginLeft: 6 }}>Order</em>
          <button onClick={handleClose} style={{ background: "none", border: "none", color: "rgba(245,237,216,0.6)", fontSize: "1.3rem", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#D4A843"}
            onMouseLeave={e => e.target.style.color = "rgba(245,237,216,0.6)"}
          >✕</button>
        </div>
        <div style={{ padding: "1.8rem" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "2.5rem 2rem" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1.2rem" }}>🎉</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "0.6rem", color: "#1E1410" }}>
                Order <em style={{ color: "#6B1A1A" }}>Placed!</em>
              </h3>
              <p style={{ color: "#7A6050", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Thank you, <strong>{name}</strong>!</p>
              <p style={{ color: "#7A6050", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Your order will be ready for pick up at</p>
              <p style={{ color: "#7A6050", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.8rem" }}>#3855 17 Ave SW, Calgary</p>
              <div style={{ fontSize: "0.78rem", color: "#C4882B", fontWeight: 600, background: "rgba(196,136,43,0.08)", border: "1px solid rgba(196,136,43,0.25)", padding: "0.4rem 1rem", display: "inline-block", margin: "0.6rem 0", letterSpacing: "0.1em" }}>
                Order #{orderId}
              </div>

              {/* Kitchen notification status */}
              {kitchenStatus && (
                <div style={{ margin: "1rem 0 0.5rem", padding: "0.65rem 1rem", fontSize: "0.8rem", fontWeight: 500, background: kitchenBadge[kitchenStatus].bg, border: `1px solid ${kitchenBadge[kitchenStatus].border}`, color: kitchenBadge[kitchenStatus].color, textAlign: "left", lineHeight: 1.5 }}>
                  {kitchenBadge[kitchenStatus].text}
                </div>
              )}

              <p style={{ fontSize: "0.82rem", color: "#7A6050", marginTop: "0.8rem" }}>Questions? Call us at (403) 686-3799</p>
              <button onClick={handleClose} style={{ background: "#1E1410", color: "white", border: "none", padding: "0.8rem 2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", marginTop: "1.2rem", transition: "background 0.2s" }}
                onMouseEnter={e => e.target.style.background = "#6B1A1A"}
                onMouseLeave={e => e.target.style.background = "#1E1410"}
              >Start New Order</button>
            </div>
          ) : (
            <>
              <div style={{ background: "#FBF6EE", border: "1px solid rgba(107,26,26,0.14)", padding: "1.2rem", marginBottom: "1.5rem" }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.8rem", color: "#1E1410", letterSpacing: "0.05em", textTransform: "uppercase" }}>Order Summary</h4>
                {Object.entries(cart).map(([id, qty]) => {
                  const item = getItem(Number(id));
                  if (!item) return null;
                  return (
                    <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.3rem 0", color: "#2A1A0E" }}>
                      <span>{item.name} ×{qty}</span>
                      <span>${(item.price * qty).toFixed(2)}</span>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem", borderTop: "1px solid rgba(107,26,26,0.14)", marginTop: "0.5rem", paddingTop: "0.7rem" }}>
                  <span>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", color: "#6B1A1A", fontSize: "1.1rem" }}>${total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.25)", padding: "0.8rem 1rem", fontSize: "0.8rem", color: "#6A4800", marginBottom: "1.4rem" }}>
                ⚠️ If you have allergies or dietary requirements, note them in Special Instructions below.
              </div>
              {[
                { label: "Full Name *", id: "name", type: "text", val: name, set: setName, ph: "Your name" },
                { label: "Phone Number *", id: "phone", type: "tel", val: phone, set: setPhone, ph: "(403) 000-0000" },
                { label: "Email Address *", id: "email", type: "email", val: email, set: setEmail, ph: "you@email.com" },
              ].map(f => (
                <div key={f.id} style={{ marginBottom: "1.1rem" }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#6B1A1A"}
                    onBlur={e => e.target.style.borderColor = "rgba(107,26,26,0.14)"}
                  />
                </div>
              ))}
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={labelStyle}>Special Instructions</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, modifications, preferences…" style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                  onFocus={e => e.target.style.borderColor = "#6B1A1A"}
                  onBlur={e => e.target.style.borderColor = "rgba(107,26,26,0.14)"}
                />
              </div>
              <button onClick={handlePlace} disabled={placing} style={{ width: "100%", background: placing ? "#7A6050" : "#6B1A1A", color: "white", border: "none", padding: "1.1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: placing ? "not-allowed" : "pointer", marginTop: "0.5rem", transition: "background 0.25s" }}
                onMouseEnter={e => { if (!placing) e.target.style.background = "#C4882B"; }}
                onMouseLeave={e => { if (!placing) e.target.style.background = "#6B1A1A"; }}
              >{placing ? "⏳ Sending to Kitchen…" : "🥡 Place Pick Up Order"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderPage({ onBack }) {
  const [cart, setCart] = useState({});
  const [activeTab, setActiveTab] = useState("pho");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [kitchenSettingsOpen, setKitchenSettingsOpen] = useState(false);
  const [ablyConnected, setAblyConnected] = useState(() => !!localStorage.getItem("ably_api_key"));

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addItem = useCallback((id) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }, []);
  const removeItem = useCallback((id) => {
    setCart(c => {
      const n = { ...c };
      if (n[id] > 1) n[id]--;
      else delete n[id];
      return n;
    });
  }, []);
  const removeItemFull = useCallback((id) => {
    setCart(c => { const n = { ...c }; delete n[id]; return n; });
  }, []);
  const clearCart = () => setCart({});

  const activeMenu = MENU.find(m => m.id === activeTab);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <OrderNav
        onBack={onBack}
        cartCount={cartCount}
        onCartOpen={() => setMobileCartOpen(true)}
        onSettingsOpen={() => setKitchenSettingsOpen(true)}
        ablyConnected={ablyConnected}
      />
      <OrderHero />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2rem 6rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start", flex: 1 }}>
        <div style={{ minWidth: 0 }}>
          {/* Category tabs */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.8rem" }}>
            {MENU.map(cat => (
              <button key={cat.id} onClick={() => setActiveTab(cat.id)} style={{
                padding: "0.5rem 1.1rem", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.08em",
                textTransform: "uppercase", border: "1px solid",
                borderColor: activeTab === cat.id ? "#6B1A1A" : "rgba(107,26,26,0.14)",
                background: activeTab === cat.id ? "#6B1A1A" : "white",
                color: activeTab === cat.id ? "#F5EDD8" : "#7A6050",
                cursor: "pointer", transition: "all 0.25s", fontFamily: "'DM Sans', sans-serif",
              }}>
                {cat.category}
              </button>
            ))}
          </div>
          {/* Menu items */}
          {MENU.map(cat => (
            <div key={cat.id} id={`sec-${cat.id}`} style={{ marginBottom: "3rem", display: activeTab === cat.id ? "block" : "block" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1410", paddingBottom: "0.8rem", marginBottom: "0.2rem", borderBottom: "2px solid rgba(107,26,26,0.14)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span>{cat.category.split(" ")[0]}</span>
                {cat.category.replace(/^[^\s]+\s/, "")}
              </div>
              <div className="order-menu-grid">
                {cat.items.map(item => (
                  <MenuCard key={item.id} item={item} qty={cart[item.id] || 0} onAdd={addItem} onRemove={removeItem} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
        <div style={{ display: "none", alignSelf: "stretch" }} className="order-sidebar-desktop">
          <SideCart cart={cart} onAdd={addItem} onRemove={removeItem} onRemoveFull={removeItemFull} onCheckout={() => setCheckoutOpen(true)} />
        </div>
        <style>{`@media(min-width:861px){ .order-sidebar-desktop { display: block !important; } }`}</style>
      </div>
      <footer style={{ background: "#120C08", padding: "2.5rem 4rem", textAlign: "center", borderTop: "1px solid rgba(212,168,67,0.1)" }}>
        <p style={{ fontSize: "0.78rem", color: "rgba(245,237,216,0.25)", letterSpacing: "0.08em" }}>
          © 2025 Pho Huong Viet · #3855 17 Ave SW, Calgary, AB T3C 1J7 ·{" "}
          <a href="tel:+14036863799" style={{ color: "rgba(212,168,67,0.5)", textDecoration: "none" }}>(403) 686-3799</a>
        </p>
      </footer>
      <MobileCartDrawer open={mobileCartOpen} onClose={() => setMobileCartOpen(false)} cart={cart} onAdd={addItem} onRemove={removeItem} onRemoveFull={removeItemFull} onCheckout={() => { setMobileCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} onSuccess={clearCart} />
      <KitchenSettingsModal open={kitchenSettingsOpen} onClose={() => { setKitchenSettingsOpen(false); setAblyConnected(!!localStorage.getItem("ably_api_key")); }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// KITCHEN PRINT PAGE
// Runs in Chrome on any PC/Mac with a USB printer
// Connects to Ably, auto-prints each confirmed order
// ─────────────────────────────────────────────
const KITCHEN_PRINT_CSS = `
@keyframes kpFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.kp-entry { animation: kpFadeIn 0.35s ease both; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.kp-pulse { animation: pulse 1.4s ease-in-out infinite; }
@media print {
  body > *:not(#kp-print-frame) { display: none !important; }
  #kp-print-frame { display: block !important; position: fixed; inset: 0; width: 100%; height: 100%; border: none; }
}
`;

// Mirrors the receipt HTML from the kitchen app's printService.ts
function buildReceiptHTML(order, prepMins) {
  const now = new Date().toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });
  const itemRows = order.items.map(item =>
    `<tr><td class="qty">${item.qty}×</td><td class="name">${item.name}</td><td class="price">$${item.subtotal.toFixed(2)}</td></tr>`
  ).join("");
  const special = (order.specialInstructions && order.specialInstructions !== "None")
    ? `<p class="special"><strong>⚠ Special Instructions:</strong><br>${order.specialInstructions}</p>` : "";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Courier New',monospace;font-size:13pt;color:#000;padding:12px;max-width:320px;margin:0 auto}
  .hdr{text-align:center;border-bottom:2px dashed #000;padding-bottom:12px;margin-bottom:12px}
  .hdr h1{font-size:16pt;font-weight:bold}.hdr p{font-size:9pt;margin-top:3px}
  .badge{display:inline-block;background:#000;color:#fff;padding:4px 14px;font-size:9pt;letter-spacing:2px;margin-top:8px}
  .oid{text-align:center;font-size:11pt;margin:10px 0 2px;font-weight:bold}
  .ts{text-align:center;font-size:8pt;color:#555;margin-bottom:10px}
  .sec{margin:10px 0}.sec-t{font-size:8pt;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:8px}
  table{width:100%;border-collapse:collapse}
  td{padding:4px 0;font-size:10pt;vertical-align:top}
  td.qty{width:30px;font-weight:bold}td.price{text-align:right;white-space:nowrap}
  hr{border:none;border-top:1px dashed #000;margin:10px 0}
  .tot{display:flex;justify-content:space-between;font-weight:bold;font-size:13pt;margin-top:8px}
  .special{font-size:9pt;border:2px solid #000;padding:7px;margin:8px 0;line-height:1.5}
  .prep{text-align:center;margin:12px 0}.prep strong{font-size:20pt;display:block;margin-top:4px}
  .ftr{text-align:center;font-size:8pt;margin-top:16px;border-top:2px dashed #000;padding-top:12px;line-height:2}
</style></head><body>
<div class="hdr"><h1>PHO HUONG VIET</h1><p>#3855 17 Ave SW, Calgary, AB</p><p>(403) 686-3799</p><div class="badge">PICK-UP ORDER</div></div>
<div class="oid">Order #${order.orderId}</div><div class="ts">${now}</div><hr>
<div class="sec"><div class="sec-t">Customer</div><p><strong>${order.customer.name}</strong></p><p>${order.customer.phone}</p></div><hr>
<div class="sec"><div class="sec-t">Items</div><table>${itemRows}</table></div><hr>
<div class="tot"><span>TOTAL</span><span>$${order.total.toFixed(2)}</span></div>
${special}<hr>
<div class="prep">Ready In:<strong>${prepMins ? prepMins + " min" : "—"}</strong></div><hr>
<div class="ftr"><strong>Thank You!</strong><br>Please wait for your name<br>(403) 686-3799</div>
</body></html>`;
}

function silentPrint(html) {
  // Inject into hidden iframe then print — doesn't interrupt the page UI
  let frame = document.getElementById("kp-print-frame");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "kp-print-frame";
    frame.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:320px;height:600px;border:none;visibility:hidden";
    document.body.appendChild(frame);
  }
  frame.srcdoc = html;
  frame.onload = () => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch (e) {
      // fallback: open in new tab
      const w = window.open("", "_blank");
      if (w) { w.document.write(html); w.document.close(); w.print(); }
    }
  };
}

function KitchenPrintPage({ onBack }) {
  const [ablyKey, setAblyKey] = useState(() => localStorage.getItem("ably_api_key") || "");
  const [status, setStatus] = useState("disconnected"); // disconnected | connecting | connected | error
  const [errorMsg, setErrorMsg] = useState("");
  const [autoPrint, setAutoPrint] = useState(true);
  const [printOnNew, setPrintOnNew] = useState(false); // optional: print on arrival too
  const [log, setLog] = useState([]); // [{order, time, printed, trigger}]
  const wsRef = useRef(null);
  const reconnTimerRef = useRef(null);

  const addLog = (order, printed, trigger) => {
    setLog(prev => [{
      order,
      time: new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" }),
      printed,
      trigger, // 'confirmed' | 'arrived'
      id: order.orderId + Date.now(),
    }, ...prev].slice(0, 40));
  };

  const handleOrder = useCallback((order, prepMins, isArrival = false) => {
    const html = buildReceiptHTML(order, prepMins);
    const shouldPrint = autoPrint;
    if (shouldPrint) silentPrint(html);
    addLog(order, shouldPrint, isArrival ? "arrived" : "confirmed");
  }, [autoPrint]);

  const connect = useCallback(() => {
    const key = ablyKey.trim();
    if (!key) return;
    localStorage.setItem("ably_api_key", key);

    if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }
    clearTimeout(reconnTimerRef.current);
    setStatus("connecting"); setErrorMsg("");

    const ws = new WebSocket(
      `wss://realtime.ably.io/?key=${encodeURIComponent(key)}&format=json&heartbeats=true&v=1.2&agent=js-1.2`
    );
    wsRef.current = ws;

    const timeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) { ws.close(); setStatus("error"); setErrorMsg("Connection timed out"); }
    }, 10000);

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.action === 4) { // CONNECTED
          clearTimeout(timeout);
          setStatus("connected"); setErrorMsg("");
          ws.send(JSON.stringify({ action: 10, channel: "pho-kitchen-orders" }));
        }
        if (msg.action === 15 && msg.channel === "pho-kitchen-orders") {
          (msg.messages || []).forEach(m => {
            try {
              const data = typeof m.data === "string" ? JSON.parse(m.data) : m.data;
              // PRINT_ORDER = kitchen staff confirmed → print immediately
              if (data?.type === "PRINT_ORDER" && data?.order) {
                handleOrder(data.order, data.prepMins ?? null);
              }
              // Also catch NEW_ORDER if user wants to print on arrival too
              if (data?.type === "NEW_ORDER" && data?.order && printOnNew) {
                handleOrder(data.order, null, true /* isArrival */);
              }
            } catch {}
          });
        }
        if (msg.action === 9) {
          clearTimeout(timeout);
          const code = msg.error?.code;
          setErrorMsg(code === 40101 || code === 40102 ? "Invalid API key" : (msg.error?.message || "Ably error"));
          setStatus("error");
        }
      } catch {}
    };
    ws.onerror = () => { clearTimeout(timeout); setStatus("error"); setErrorMsg("WebSocket error"); };
    ws.onclose = (e) => {
      clearTimeout(timeout);
      if (e.code !== 1000) {
        setStatus("error"); setErrorMsg("Disconnected — retrying in 5s…");
        reconnTimerRef.current = setTimeout(connect, 5000);
      }
    };
  }, [ablyKey, handleOrder]);

  const disconnect = () => {
    clearTimeout(reconnTimerRef.current);
    if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); wsRef.current = null; }
    setStatus("disconnected");
  };

  useEffect(() => () => { disconnect(); }, []);

  const statusCfg = {
    disconnected: { dot: "rgba(245,237,216,0.2)",   label: "Not connected",   bg: "transparent" },
    connecting:   { dot: "#F39C12",                 label: "Connecting…",     bg: "rgba(243,156,18,0.08)" },
    connected:    { dot: "#27AE60",                 label: "Live — listening for orders", bg: "rgba(39,174,96,0.08)" },
    error:        { dot: "#C0392B",                 label: errorMsg || "Error", bg: "rgba(192,57,43,0.08)" },
  };
  const sc = statusCfg[status];

  return (
    <div style={{ minHeight: "100vh", background: "#0E0806", color: "#F5EDD8", display: "flex", flexDirection: "column" }}>
      <style>{KITCHEN_PRINT_CSS}</style>

      {/* Header */}
      <header style={{ background: "#120A06", borderBottom: "1px solid rgba(212,168,67,0.12)", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <button onClick={onBack} style={{ color: "rgba(245,237,216,0.4)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => e.target.style.color = "#D4A843"} onMouseLeave={e => e.target.style.color = "rgba(245,237,216,0.4)"}
          >← Back</button>
          <div style={{ width: 1, height: 20, background: "rgba(212,168,67,0.15)" }} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#F5EDD8" }}>🖨 Kitchen Print Station</div>
            <div style={{ fontSize: "0.62rem", color: "rgba(212,168,67,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "0.1rem" }}>
              Auto-prints orders via any USB / Wi-Fi printer
            </div>
          </div>
        </div>
        {/* Status pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", background: sc.bg, border: `1px solid ${sc.dot}30`, borderRadius: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} className={status === "connecting" ? "kp-pulse" : ""} />
          <span style={{ fontSize: "0.72rem", color: sc.dot, fontWeight: 500, letterSpacing: "0.08em" }}>{sc.label}</span>
        </div>
      </header>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "360px 1fr", gap: 0, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "2rem", gap: "1.5rem", alignItems: "start" }}>

        {/* Left — Setup panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* How it works */}
          <div style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.14)", padding: "1.1rem 1.2rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#D4A843", marginBottom: "0.7rem" }}>How it works</div>
            {[
              ["1", "Open this page on the PC/Mac that has your printer (USB or same Wi-Fi)"],
              ["2", "Set that printer as the Default Printer in your computer's settings"],
              ["3", "Connect below — keep this tab open in the background"],
              ["4", "Kitchen app confirms order → receipt prints instantly, no dialog"],
            ].map(([n, t]) => (
              <div key={n} style={{ display: "flex", gap: "0.7rem", marginBottom: "0.6rem", fontSize: "0.8rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.5 }}>
                <span style={{ background: "#6B1A1A", color: "#D4A843", width: 18, height: 18, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{n}</span>
                {t}
              </div>
            ))}
            <div style={{ marginTop: "0.8rem", padding: "0.65rem 0.8rem", background: "rgba(39,174,96,0.07)", border: "1px solid rgba(39,174,96,0.2)", fontSize: "0.75rem", color: "rgba(39,174,96,0.85)", lineHeight: 1.6 }}>
              ✅ No EPOS required · No USB relay script · Works with any printer
            </div>
          </div>

          {/* Connection setup */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,67,0.12)", padding: "1.3rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>Ably Connection</div>
            <label style={{ display: "block", fontSize: "0.68rem", color: "rgba(245,237,216,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>API Key</label>
            <input
              value={ablyKey}
              onChange={e => setAblyKey(e.target.value)}
              placeholder="xxxxxx.xxxxxx:xxxxxxxxxxxxxxxx"
              disabled={status === "connected" || status === "connecting"}
              style={{ width: "100%", padding: "0.65rem 0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.18)", color: "#F5EDD8", fontFamily: "monospace", fontSize: "0.78rem", outline: "none", marginBottom: "0.8rem", opacity: status === "connected" ? 0.5 : 1 }}
            />
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {status !== "connected" ? (
                <button onClick={connect} disabled={!ablyKey.trim()} style={{ flex: 1, padding: "0.7rem", background: ablyKey.trim() ? "#6B1A1A" : "rgba(255,255,255,0.05)", color: ablyKey.trim() ? "white" : "rgba(245,237,216,0.3)", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: ablyKey.trim() ? "pointer" : "not-allowed", transition: "background 0.2s" }}>
                  Connect
                </button>
              ) : (
                <button onClick={disconnect} style={{ flex: 1, padding: "0.7rem", background: "rgba(192,57,43,0.15)", color: "#E74C3C", border: "1px solid rgba(192,57,43,0.3)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                  Disconnect
                </button>
              )}
            </div>
          </div>

          {/* Print settings + test */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,67,0.12)", padding: "1.3rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>Print Settings</div>

            {/* Auto-print on confirm toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#F5EDD8" }}>Print on Confirm</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(245,237,216,0.35)", marginTop: "0.2rem" }}>Prints when kitchen staff confirms the order</div>
              </div>
              <div onClick={() => setAutoPrint(v => !v)} style={{ width: 42, height: 24, background: autoPrint ? "#27AE60" : "rgba(255,255,255,0.1)", borderRadius: 12, cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: autoPrint ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>

            {/* Also print on arrival toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#F5EDD8" }}>Also Print on Arrival</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(245,237,216,0.35)", marginTop: "0.2rem" }}>Extra copy when order is first received</div>
              </div>
              <div onClick={() => setPrintOnNew(v => !v)} style={{ width: 42, height: 24, background: printOnNew ? "#2980B9" : "rgba(255,255,255,0.1)", borderRadius: 12, cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: printOnNew ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>

            <button onClick={() => {
              const testOrder = {
                orderId: "PHV-TEST",
                customer: { name: "Test Customer", phone: "(403) 555-0000", email: "test@test.com" },
                items: [
                  { qty: 1, name: "Pho Dac Biet — House Special Combo", unitPrice: 17.50, subtotal: 17.50 },
                  { qty: 2, name: "Vietnamese Iced Coffee", unitPrice: 5.50, subtotal: 11.00 },
                ],
                total: 28.50,
                specialInstructions: "No bean sprouts",
                timestamp: new Date().toLocaleString(),
              };
              silentPrint(buildReceiptHTML(testOrder, 15));
              addLog(testOrder, true, "confirmed");
            }} style={{ width: "100%", padding: "0.65rem", background: "transparent", border: "1px solid rgba(212,168,67,0.25)", color: "#D4A843", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,168,67,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >🖨 Print Test Receipt</button>
          </div>

          {/* Silent print tip */}
          <div style={{ background: "rgba(41,128,185,0.07)", border: "1px solid rgba(41,128,185,0.2)", padding: "1rem 1.1rem", fontSize: "0.75rem", color: "rgba(245,237,216,0.5)", lineHeight: 1.7 }}>
            <strong style={{ color: "#2980B9", display: "block", marginBottom: "0.3rem" }}>💡 Tip: Skip the print dialog</strong>
            In Chrome, go to <strong style={{ color: "rgba(245,237,216,0.7)" }}>Settings → Printing → Skip print preview</strong>, or launch Chrome with:
            <code style={{ display: "block", marginTop: "0.4rem", padding: "0.3rem 0.5rem", background: "rgba(0,0,0,0.3)", fontFamily: "monospace", fontSize: "0.7rem", letterSpacing: "0.05em" }}>--kiosk-printing</code>
            to print silently every time.
          </div>
        </div>

        {/* Right — Live order log */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#F5EDD8" }}>
                Live Order <em style={{ color: "#D4A843" }}>Log</em>
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(245,237,216,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.2rem" }}>
                {log.length} order{log.length !== 1 ? "s" : ""} this session
              </div>
            </div>
            {log.length > 0 && (
              <button onClick={() => setLog([])} style={{ fontSize: "0.7rem", color: "rgba(245,237,216,0.3)", background: "none", border: "1px solid rgba(245,237,216,0.08)", padding: "0.3rem 0.7rem", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                Clear
              </button>
            )}
          </div>

          {log.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center", border: "1px dashed rgba(212,168,67,0.12)", color: "rgba(245,237,216,0.2)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem", opacity: 0.4 }}>🍜</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.05rem" }}>
                Waiting for orders…
              </div>
              <div style={{ fontSize: "0.72rem", marginTop: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {status === "connected" ? "Connected — ready to receive" : "Connect above to start listening"}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {log.map(entry => (
                <div key={entry.id} className="kp-entry" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,67,0.1)", padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#D4A843", flexShrink: 0 }}>#{entry.order.orderId}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "0.88rem", color: "#F5EDD8" }}>{entry.order.customer.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(245,237,216,0.4)", marginTop: "0.15rem" }}>
                      {entry.order.items.length} item{entry.order.items.length !== 1 ? "s" : ""} · ${entry.order.total.toFixed(2)} · {entry.time}
                      {entry.trigger && <span style={{ marginLeft: "0.5rem", fontSize: "0.65rem", padding: "0.1rem 0.45rem", borderRadius: 2, background: entry.trigger === "confirmed" ? "rgba(39,174,96,0.12)" : "rgba(41,128,185,0.12)", color: entry.trigger === "confirmed" ? "#27AE60" : "#2980B9", border: `1px solid ${entry.trigger === "confirmed" ? "rgba(39,174,96,0.25)" : "rgba(41,128,185,0.25)"}` }}>{entry.trigger === "confirmed" ? "✓ Confirmed" : "↓ Arrived"}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    {entry.printed
                      ? <span style={{ fontSize: "0.68rem", color: "#27AE60", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", padding: "0.2rem 0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>✓ Printed</span>
                      : <span style={{ fontSize: "0.68rem", color: "#F39C12", background: "rgba(243,156,18,0.08)", border: "1px solid rgba(243,156,18,0.25)", padding: "0.2rem 0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Skipped</span>
                    }
                    <button onClick={() => { silentPrint(buildReceiptHTML(entry.order, null)); setLog(l => l.map(e => e.id === entry.id ? {...e, printed: true} : e)); }}
                      style={{ fontSize: "0.68rem", color: "rgba(212,168,67,0.6)", background: "none", border: "1px solid rgba(212,168,67,0.18)", padding: "0.2rem 0.6rem", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,168,67,0.1)"; e.currentTarget.style.color = "#D4A843"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(212,168,67,0.6)"; }}
                    >Re-print</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const goOrder = () => setPage("order");
  const goHome = () => setPage("home");
  const goKitchenPrint = () => setPage("kitchen-print");

  if (page === "kitchen-print") return <KitchenPrintPage onBack={goHome} />;
  return page === "home"
    ? <HomePage onOrderClick={goOrder} />
    : <OrderPage onBack={goHome} onKitchenPrint={goKitchenPrint} />;
}