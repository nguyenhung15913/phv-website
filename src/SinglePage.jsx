import { useState, useEffect, useRef, useCallback } from "react";

const ABLY_API_KEY = "vqYzYw.mXKtJw:upuGWcSbw0o2GVox26C3WA4kdfInGXrIlKJ9VBx1Je4";

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
  body { font-family: 'DM Sans', sans-serif; background: #FBF6EE; color: #2A1A0E; overflow-x: hidden; font-size: 16px; }

  
  @keyframes heroZoom { from{transform:scale(1.05)} to{transform:scale(1.12)} }
  @keyframes heroFadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scrollPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  .hero-bg-anim { animation: heroZoom 20s ease-in-out infinite alternate; }
  .hero-content-anim { animation: heroFadeUp 1.2s cubic-bezier(0.16,1,0.3,1) both; }
  .marquee-track { animation: marquee 28s linear infinite; }
  .scroll-line-anim { animation: scrollPulse 2s ease-in-out infinite; }

  
  .reveal { opacity:0; transform:translateY(30px); transition:opacity 0.85s ease, transform 0.85s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  
  .section-pad   { padding: 7rem 4rem; }
  .section-inner { max-width: 1300px; margin: 0 auto; }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
  }
  .about-stats {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 1.5rem;
  }
  .menu-home-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 2px;
  }
  .visit-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 5rem;
    align-items: start;
  }
  .delivery-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .delivery-btns {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  
  .photo-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 280px 280px;
    gap: 10px;
  }
  .photo-grid img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s; overflow:hidden; }
  .photo-grid img:hover { transform:scale(1.04); }
  .photo-grid img:first-child { grid-row: span 2; }

  
  .order-menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
    gap: 1rem; margin-top: 1rem;
  }

  
  .nav-scrolled {
    background: rgba(251,246,238,0.97) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 1px 30px rgba(107,26,26,0.08) !important;
  }
  .nav-scrolled .nav-logo-text { color: #6B1A1A !important; }
  .nav-scrolled .nav-link { color: #4A2C1A !important; }
  .nav-scrolled .nav-link:hover { color: #6B1A1A !important; }

  
  .mobile-menu {
    display: none;
    position: fixed;
    inset: 0;
    background: #1E1410;
    z-index: 200;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a, .mobile-menu button.mobile-nav-link {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: #F5EDD8;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .mobile-menu a:hover, .mobile-menu button.mobile-nav-link:hover { color: #D4A843; }

  
  .hours-table { width:100%; border-collapse:collapse; }
  .hours-table tr { border-bottom: 1px solid rgba(107,26,26,0.12); }
  .hours-table tr:last-child { border-bottom: none; }
  .hours-table td { padding: 0.85rem 0; font-size: 0.92rem; }
  .hours-table td:first-child { color: #2A1A0E; font-weight: 500; }
  .hours-table td:last-child { color: #C4882B; font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; text-align: right; }

  
  .about-overlay-img { display: block; }
  .cart-list-scroll { max-height: 320px; overflow-y: auto; }
  .cart-list-scroll::-webkit-scrollbar { width: 4px; }
  .cart-list-scroll::-webkit-scrollbar-thumb { background: rgba(107,26,26,0.2); }

  
  .order-layout {
    max-width: 1200px; margin: 0 auto;
    padding: 2.5rem 2rem 6rem;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
    align-items: start;
    flex: 1;
  }
  .order-nav-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 1rem 2.5rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem;
  }
  .order-hero-info {
    display: flex; justify-content: center;
    gap: 2rem; flex-wrap: wrap;
  }

  
  @media(max-width: 1024px) {
    .about-grid { gap: 3rem; }
    .visit-grid { gap: 3rem; }
  }

  @media(max-width: 860px) {
    .section-pad { padding: 5rem 2rem; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .about-stats { grid-template-columns: repeat(3,1fr); }
    .menu-home-grid { grid-template-columns: 1fr 1fr; }
    .visit-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .delivery-inner { flex-direction: column; align-items: flex-start; }
    .photo-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .photo-grid img:first-child { grid-row: span 1; }
    .photo-grid img { height: 220px; }
    .order-layout { grid-template-columns: 1fr; padding: 1.5rem 1rem 6rem; }
    .order-nav-inner { padding: 0.9rem 1.2rem; }
    .order-hero-info { gap: 1rem; }
    .nav-desktop-item { display: none !important; }
    .nav-order-btn { display: none !important; }
    .hamburger-btn { display: flex !important; }
    .about-overlay-img { display: none !important; }
    .testimonials-grid { grid-template-columns: 1fr !important; }
    .menu-home-tab-row { flex-direction: column !important; align-items: flex-start !important; }
    .popup-header-row { flex-wrap: wrap !important; gap: 0.8rem !important; }
  }

  @media(max-width: 600px) {
    .section-pad { padding: 4rem 1.2rem; }
    .about-stats { grid-template-columns: repeat(3,1fr); gap: 0.8rem; }
    .menu-home-grid { grid-template-columns: 1fr; }
    .photo-grid { grid-template-columns: 1fr 1fr; }
    .photo-grid img { height: 160px; }
    .photo-grid img:first-child { grid-row: span 1; }
    .delivery-btns { flex-direction: column; width: 100%; }
    .delivery-btns a, .delivery-btns button { width: 100%; text-align: center; justify-content: center; }
    .order-hero-info { flex-direction: column; align-items: center; gap: 0.5rem; }
    .hero-buttons { flex-direction: column !important; align-items: stretch !important; }
    .hero-buttons > * { width: 100% !important; text-align: center; }
    .cta-buttons { flex-direction: column !important; align-items: stretch !important; }
    .cta-buttons > * { width: 100% !important; text-align: center; justify-content: center !important; }
    .menu-popup-grid { grid-template-columns: 1fr !important; }
    .order-menu-grid { grid-template-columns: 1fr !important; }
    .popup-footer-row { flex-direction: column !important; gap: 0.8rem !important; align-items: stretch !important; }
    .popup-footer-row > * { width: 100% !important; text-align: center; }
    .hours-table td { font-size: 0.82rem; padding: 0.7rem 0; }
    .visit-grid iframe { height: 280px !important; }
    .order-nav-pickup { display: none !important; }
    .delivery-inner { gap: 1.5rem; }
    .menu-cat-dropdown { display: block !important; }
    .menu-cat-tabs { display: none !important; }
    .order-cat-dropdown { display: block !important; }
    .order-cat-tabs { display: none !important; }
  }

  @media(max-width: 400px) {
    .section-pad { padding: 3rem 1rem; }
    .about-stats { grid-template-columns: repeat(3,1fr); gap: 0.5rem; }
    .photo-grid { grid-template-columns: 1fr; }
    .photo-grid img { height: 200px; }
    .mobile-menu a, .mobile-menu button.mobile-nav-link { font-size: 1.6rem; }
  }

  @media(min-width: 861px) {
    .mobile-cart-bar { display: none !important; }
  }
`;

const MENU = [
  { category: "🥗 Appetizers", id: "appetizers", items: [
    { id: 101, name: "A1 — Crispy Shrimp in Delicate Batter (8 pcs)", desc: "Lightly battered crispy shrimp served with dipping sauce", price: 9.95, tags: ["pop"] , isApp: true },
    { id: 102, name: "A2 — Beef Sate Skewers (3 skewers)", desc: "Marinated beef on skewers with sate sauce", price: 8.95 , isApp: true },
    { id: 103, name: "A3 — Grilled Prawn Skewers (12 shrimps)", desc: "Chargrilled tiger prawns on skewers", price: 9.95, tags: ["pop"] , isApp: true },
    { id: 104, name: "A4 — Combo: 2 Beef Sate & 1 Prawn Skewer", desc: "Best of both skewers", price: 9.25, tags: ["pop"] , isApp: true },
    { id: 105, name: "A5 — Deep Fried Squid", desc: "Golden crispy calamari with dipping sauce", price: 9.50 , isApp: true },
    { id: 106, name: "A6 — Deep Fried Wontons", desc: "Crispy pork wontons served with sweet sauce", price: 7.95 , isApp: true },
    { id: 107, name: "A7 — Marinated Pork Ball (3 skewers)", desc: "Grilled house-made pork meatballs on skewers", price: 7.95 , isApp: true },
    { id: 108, name: "A8 — Pork Ball (1) & Beef Skewers (2)", desc: "Combo of pork meatball and beef skewers", price: 8.95 , isApp: true },
    { id: 109, name: "A9 — Fried Fish Cake", desc: "Crispy golden fish cakes with house dipping sauce", price: 9.25 , isApp: true },
    { id: 110, name: "A10 — Fried Fish Cake, Pork Ball & Beef Skewer", desc: "Combination platter", price: 9.95, tags: ["pop"] , isApp: true },
    { id: 111, name: "A11 — Papaya Salad", desc: "Shredded green papaya with fresh herbs and tangy lime dressing", price: 8.95, tags: ["veg"] , isApp: true },
    { id: 112, name: "17 — Deep Fried Spring Rolls (4 pcs)", desc: "Crispy pork and vegetable spring rolls with sweet dipping sauce", price: 8.25, tags: ["pop"] , isApp: true },
    { id: 113, name: "17A — Deep Fried Vegetarian Spring Rolls (4 pcs)", desc: "Crispy vegetarian spring rolls", price: 8.25, tags: ["veg"] , isApp: true },
    { id: 114, name: "18 — Shrimp Salad Rolls (3 pcs)", desc: "Fresh rice paper rolls with shrimp, herbs and peanut sauce", price: 8.25, tags: ["pop"] , isApp: true },
    { id: 115, name: "18A — Vegetarian Salad Rolls (3 pcs)", desc: "Fresh rice paper rolls with tofu and vegetables", price: 7.25, tags: ["veg"] , isApp: true },
    { id: 116, name: "18B — Chicken Salad Rolls (3 pcs)", desc: "Fresh rice paper rolls with chicken, herbs and peanut sauce", price: 8.25 , isApp: true },
    { id: 117, name: "19 — Chicken Wings (8 pcs)", desc: "BBQ, Honey Garlic, Salt & Pepper, Crispy, or Hot Wings", price: 8.95, tags: ["pop"] , isApp: true },
  ]},
  { category: "🥖 Vietnamese Sub", id: "banhmi", items: [
    { id: 201, name: "S1 — Sate Beef & Chicken Sub", desc: "Sate beef and chicken in a toasted baguette with mayo, cheese, pickled carrot, cucumber and cilantro", price: 10.75, tags: ["pop", "spicy"] , isSub: true },
    { id: 202, name: "S2 — Sate Chicken Sub", desc: "Spicy sate chicken with house toppings", price: 9.75, tags: ["spicy"] , isSub: true },
    { id: 203, name: "S3 — Sate Beef Sub", desc: "Spicy sate beef with house toppings", price: 9.75, tags: ["spicy"] , isSub: true },
    { id: 204, name: "S4 — Charbroiled Pork Sub", desc: "Charbroiled BBQ pork with house toppings", price: 9.75 , isSub: true },
    { id: 205, name: "S5 — Marinated Pork Patty Sub", desc: "Grilled marinated pork patty with house toppings", price: 9.75, tags: ["pop"] , isSub: true },
    { id: 206, name: "S6 — Grilled Beef Skewers Sub", desc: "Grilled beef skewers with house toppings", price: 9.95 , isSub: true },
    { id: 207, name: "S7 — Grilled Prawn Skewers Sub", desc: "Chargrilled prawn skewers with house toppings", price: 11.75, tags: ["pop"] , isSub: true },
  ]},
  { category: "🍜 Beef Noodle Soup", id: "pho", items: [
    { id: 301, name: "1 — Huong Viet Sate Beef Noodle Soup (Spicy)", desc: "House signature spicy sate beef in rich bone broth.", price: 14.25, tags: ["pop", "spicy"], sizes: [{label:"Sm", price:14.25},{label:"Lg", price:15.25}] , isSoup: true },
    { id: 302, name: "1A — Seafood Sate Noodle Soup", desc: "Shrimp, squid and artificial crab in spicy sate broth.", price: 16.25, tags: ["spicy"] , isSoup: true },
    { id: 303, name: "2 — Chicken Noodle Soup", desc: "Tender chicken breast in light fragrant broth.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 304, name: "2A — Sate Chicken Noodle Soup (Spicy)", desc: "Chicken breast in spicy sate broth.", price: 14.25, tags: ["spicy"], sizes: [{label:"Sm", price:14.25},{label:"Lg", price:15.25}] , isSoup: true },
    { id: 305, name: "2B — Curry Chicken Noodle Soup", desc: "Chicken breast in aromatic curry broth.", price: 15.25 , isSoup: true },
    { id: 306, name: "3 — Huong Viet's Special Noodle Soup", desc: "Rare beef, beef ball, tendon, flank and tripe.", price: 14.95, tags: ["pop"], sizes: [{label:"Sm", price:14.95},{label:"Lg", price:15.95}] , isSoup: true },
    { id: 307, name: "4 — Rare Beef Noodle Soup", desc: "Sliced rare beef in classic bone broth.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 308, name: "5 — Rare Beef & Flank Noodle Soup", desc: "Rare beef with slow-cooked flank.", price: 13.95, tags: ["pop"], sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 309, name: "6 — Rare Beef & Tripe Noodle Soup", desc: "Rare beef with honeycomb tripe.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 310, name: "7 — Rare Beef & Tendon Noodle Soup", desc: "Rare beef with slow-cooked tendon.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 311, name: "8 — Well Done Flank Noodle Soup", desc: "Well-done slow-cooked flank in bone broth.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 312, name: "9 — Rare Beef & Beef Ball Noodle Soup", desc: "Rare beef with house-made beef balls.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 313, name: "10 — Rare Beef, Flank & Tripe Noodle Soup", desc: "Rare beef, flank and tripe noodle soup.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 314, name: "11 — Rare Beef, Flank, Tendon & Tripe", desc: "The full combination.", price: 13.95, tags: ["pop"], sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 315, name: "12 — Well Done Flank, Tendon & Tripe", desc: "Well-done combination.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 316, name: "13 — Beef Ball Noodle Soup", desc: "House-made beef balls in bone broth.", price: 13.95, sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 317, name: "14 — Vegetables Noodle Soup", desc: "Fresh vegetables in beef or vegetarian broth.", price: 13.95, tags: ["veg"], sizes: [{label:"Sm", price:13.95},{label:"Lg", price:14.95}] , isSoup: true },
    { id: 318, name: "15 — Hue Style Spicy Noodle Soup", desc: "Flank, rare beef, pork roll and beef ball in spicy shrimp paste broth.", price: 14.95, tags: ["spicy"], sizes: [{label:"Sm", price:14.95},{label:"Lg", price:15.95}] , isSoup: true },

    { id: 320, name: "★ Beef Ribs Noodle Soup (NEW)", desc: "Short ribs, beef balls and flank in our savoury bone broth with rice noodles.", price: 19.95, tags: ["pop"] , isSoup: true },
    { id: 321, name: "16A — Wonton Soup (8 wontons)", desc: "Handmade wontons in chicken broth.", price: 10.95 , isSoup: true },
    { id: 322, name: "16C — Special Wor Wonton Soup", desc: "Chicken breast, egg noodle, wontons and veggies.", price: 16.25, tags: ["pop"] , isSoup: true },
    { id: 323, name: "16D — Beef Stew", desc: "choice of noodle or baguette.", price: 16.25, tags: ["pop"] , isSoup: true },
  ]},
  { category: "🍝 Vermicelli Bowls", id: "bun", items: [
    { id: 401, name: "B1 — BBQ Pork & Spring Rolls on Vermicelli", desc: "Grilled BBQ pork and crispy spring rolls on rice vermicelli with veggies", price: 14.95  , isBun: true },
    { id: 402, name: "B2 — Combo Three: BBQ Pork, Pork Patty & Spring Rolls", desc: "Three-item combo on vermicelli", price: 15.75, tags: ["pop"]  , isBun: true },
    { id: 403, name: "B3 — Lemongrass BBQ Chicken & Spring Rolls", desc: "Chargrilled lemongrass chicken on vermicelli", price: 14.95  , isBun: true },
    { id: 404, name: "B4 — Lemongrass Shredded Beef & Spring Rolls", desc: "Stir-fried lemongrass beef on vermicelli", price: 14.95, tags: ["pop"]  , isBun: true },
    { id: 405, name: "B5 — Special Combo: BBQ Chicken, Shredded Beef & Spring Rolls", desc: "Three-item special combo", price: 15.95, tags: ["pop"]  , isBun: true },
    { id: 406, name: "B6 — Shrimp Paste Patty, BBQ Pork & Spring Rolls", desc: "Unique shrimp patty combo", price: 16.25  , isBun: true },
    { id: 407, name: "B7 — Beef Sate Skewers & Spring Rolls", desc: "Sate beef skewers on vermicelli", price: 15.95, tags: ["spicy"]  , isBun: true },
    { id: 408, name: "B8 — Super Combo Four", desc: "BBQ Chicken, BBQ Pork, Charbroiled Prawn Skewers & Spring Rolls on vermicelli", price: 17.95, tags: ["pop"]  , isBun: true },
    { id: 409, name: "B10 — Combo Three: BBQ Pork, Shredded Pork & Spring Rolls", desc: "Classic three-item combo", price: 15.75  , isBun: true },
    { id: 410, name: "B11 — Combo Four: Pork Patty, BBQ Pork, Shredded Pork & Spring Rolls", desc: "Four-item vermicelli bowl", price: 16.25, tags: ["pop"]  , isBun: true },
    { id: 411, name: "B12 — Deep Fried Spring Rolls on Vermicelli", desc: "Crispy spring rolls on rice vermicelli with veggies", price: 14.50  , isBun: true },
    { id: 412, name: "B14 — Fish Cake, Prawn Skewers & Spring Rolls on Vermicelli", desc: "Seafood combo on vermicelli", price: 16.95, tags: ["pop"]  , isBun: true },
    { id: 413, name: "B15 — Grilled Beef in Wild Betel Leaf & Spring Rolls", desc: "Aromatic beef wrapped in betel leaf on vermicelli", price: 15.95, tags: ["pop"]  , isBun: true },
    { id: 414, name: "B16 — Beef Ribs & Spring Rolls on Vermicelli", desc: "Beef ribs on rice vermicelli with veggies", price: 16.95  , isBun: true },
    { id: 415, name: "B23 — Charbroiled Prawns & Spring Rolls on Vermicelli", desc: "Chargrilled prawns on vermicelli", price: 16.50  , isBun: true },
    { id: 416, name: "B13 — Vegetarian Spring Rolls on Vermicelli", desc: "Vegetarian deep fried spring rolls on rice noodle", price: 14.50, tags: ["veg"]  , isBun: true },
    { id: 417, name: "★ Hanoi Style Vermicelli (NEW)", desc: "Grilled pork meatball, shredded pork, spring rolls with veggies and special sauce on vermicelli", price: 16.95, tags: ["pop"]  , isBun: true },
  ]},
  { category: "🍝 Stir Fried Egg Noodle", id: "noodles", items: [
    { id: 501, name: "24 — Stir Fried Tofu & Veggies with Lemongrass", desc: "Tofu and vegetables in lemongrass sauce on egg noodles", price: 15.95, tags: ["veg"] , isNoodle: true },
    { id: 502, name: "25 — Stir Fried Chicken Breast with Lemongrass", desc: "Chicken breast and veggies in lemongrass sauce on egg noodles", price: 16.25, tags: ["pop"] , isNoodle: true },
    { id: 503, name: "26 — Stir Fried Beef with Lemongrass", desc: "Beef and veggies in lemongrass sauce on egg noodles", price: 16.25, tags: ["pop"] , isNoodle: true },
    { id: 504, name: "26A — Stir Fried Seafood with Lemongrass", desc: "Shrimp, squid and artificial crab in lemongrass sauce on egg noodles", price: 17.25, tags: ["pop"] , isNoodle: true },
  ]},
  { category: "🍚 Rice Dishes", id: "rice", items: [
    { id: 601, name: "C1 — Stir Fried Curry Chicken Breast with Veggies on Rice", desc: "Mildly spicy curry chicken stir fry on steamed rice", price: 16.25, tags: ["spicy"] , isRice: true },
    { id: 602, name: "C2 — Stir Fried Curry Beef with Veggies on Rice", desc: "Mildly spicy curry beef stir fry on steamed rice", price: 16.25, tags: ["spicy"] , isRice: true },
    { id: 603, name: "C3 — Stir Fried Curry Seafood with Veggies on Rice", desc: "Mildly spicy curry seafood on steamed rice", price: 17.25, tags: ["spicy"] , isRice: true },
    { id: 604, name: "C27 — Grilled Beef Lemongrass with Veggies on Rice", desc: "Our signature lemongrass beef on fragrant steamed rice", price: 16.25, tags: ["pop"] , isRice: true },
    { id: 605, name: "C28 — BBQ Chicken with Veggies on Steamed Rice", desc: "Mild spicy BBQ chicken with prepared sauce on steamed rice", price: 15.95, tags: ["pop"] , isRice: true },
    { id: 606, name: "C29 — Charbroiled BBQ Pork Chop, Shredded Pork & Fried Egg on Rice", desc: "Classic Vietnamese pork chop rice plate", price: 16.25, tags: ["pop"] , isRice: true },
    { id: 607, name: "C30 — Shrimp Paste Patty, Meat Pie & Shredded Pork on Rice", desc: "Unique Vietnamese shrimp patty rice plate", price: 16.95 , isRice: true },
    { id: 608, name: "C31 — Fried Fish Cake, Meat Pie & Shredded Pork on Rice", desc: "Vietnamese fish cake rice plate", price: 16.95 , isRice: true },
    { id: 609, name: "C32 — Beef Ribs & Fried Egg on Steamed Rice", desc: "Beef ribs with fried egg on steamed rice", price: 16.95, tags: ["pop"] , isRice: true },
    { id: 610, name: "C4 — Stir Fried Curry Tofu with Veggies on Rice", desc: "Vegetarian curry tofu stir fry on rice", price: 16.25, tags: ["veg"] , isRice: true },
    { id: 611, name: "★ Golden Fried Chicken Rice (NEW)", desc: "Crispy chicken with special sauce on coconut rice", price: 16.25, tags: ["pop"] , isRice: true },
    { id: 612, name: "★ Vietnamese Sizzling Crispy Crepes (NEW)", desc: "Savoury crispy crepes filled with seafood, ground pork or beef, onion and bean sprouts", price: 17.95, tags: ["pop"] , isRice: true },
  ]},
  { category: "🥤 Beverages & Desserts", id: "drinks", items: [
    { id: 701, name: "31 — Hot Chocolate", desc: "Rich hot chocolate", price: 3.95 },
    { id: 702, name: "31B — Vietnamese Hot Honey Lemon", desc: "Soothing hot honey lemon drink", price: 4.50 },
    { id: 703, name: "32 — Hot Vietnamese Coffee with Condensed Milk", desc: "Dark roast Vietnamese coffee with sweetened condensed milk", price: 4.75 },
    { id: 704, name: "33 — Iced Vietnamese Coffee with Condensed Milk", desc: "Dark roast Vietnamese coffee over ice with condensed milk", price: 4.75, tags: ["pop"] },
    { id: 705, name: "34 — Pop", desc: "Choose your flavour", price: 2.95, selectLabel: "Choose flavour", selectOptions: ["C Plus", "Pepsi", "Coke", "Ginger Ale", "Sprite", "Nestea", "Rootbeer"] },
    { id: 706, name: "35 — Fresh Lemon Juice", desc: "Freshly squeezed lemon juice over ice", price: 4.75 },
    { id: 707, name: "36 — Fresh Orange Juice", desc: "Freshly squeezed orange juice", price: 5.95 },
    { id: 708, name: "37 — Fresh Coconut Juice", desc: "Fresh coconut water", price: 6.25 },
    { id: 709, name: "39 — Triple Scoop Vanilla Ice Cream", desc: "Triple scoop of vanilla ice cream with peanut and condensed milk", price: 4.50 },
    { id: 710, name: "40 — Deep Fried Banana with Double Scoop Ice Cream", desc: "Crispy fried banana with vanilla ice cream", price: 5.75, tags: ["pop"] },
    { id: 711, name: "41 — Deep Fried Banana with Peanut & Condensed Milk", desc: "Crispy fried banana drizzled with peanut sauce", price: 5.75 },
    { id: 713, name: "43 — Three Colour Dessert", desc: "Mung bean, red bean, pandan jelly and coconut sauce over shaved ice", price: 7.25, tags: ["pop"] },
    { id: 714, name: "Bubble Tea", desc: "Choose up to 3 flavours · Pearl or Jelly · Customize your cup", price: 6.50, tags: ["pop"], isBubbleTea: true },
  ]},
];

function getItem(id) {
  const numId = Number(String(id).split("|")[0]);
  for (const cat of MENU) {
    const f = cat.items.find(i => i.id === numId);
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

function HomeNav({ onOrderClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navBase = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 150,
    padding: "1rem clamp(1rem, 4vw, 2rem)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    transition: "all 0.4s ease",
    background: scrolled ? "rgba(251,246,238,0.97)" : "transparent",
    boxShadow: scrolled ? "0 1px 30px rgba(107,26,26,0.08)" : "none",
  };
  const linkColor = scrolled ? "#4A2C1A" : "rgba(245,237,216,0.85)";
  const logoColor = scrolled ? "#6B1A1A" : "#F5EDD8";
  const burgerColor = scrolled ? "#6B1A1A" : "#F5EDD8";

  const navLink = (href, label) => (
    <a href={href} className="nav-link" onClick={() => setMobileOpen(false)}
      style={{ fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", color: linkColor, transition: "color 0.3s" }}>
      {label}
    </a>
  );

  return (
    <>
      <nav style={navBase}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "center", gap: "0.7rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={LOGO_SRC} alt="Pho Huong Viet" style={{ height: 40, width: "auto" }} onError={e => e.target.style.display = "none"} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: logoColor, transition: "color 0.4s" }}>
            Pho Huong Viet
          </span>
        </button>

        
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", alignItems: "center" }}>
          {[["About","#about"], ["Featured Dishes","#menu"], ["Gallery","#gallery"], ["Visit","#visit"]].map(([label, href]) => (
            <li key={label} className="nav-desktop-item" style={{ display: "none" }}>
              {navLink(href, label)}
            </li>
          ))}
          <li className="nav-order-btn">
            <button onClick={onOrderClick} style={{ background: "#C4882B", color: "white", border: "none", padding: "0.55rem 1.4rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.3s" }}
              onMouseEnter={e => e.target.style.background = "#6B1A1A"}
              onMouseLeave={e => e.target.style.background = "#C4882B"}
            >Order Now</button>
          </li>
          
          <li className="hamburger-btn" style={{ display: "none" }}>
            <button onClick={() => setMobileOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.3rem", display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ display: "block", width: 24, height: 2, background: burgerColor, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ display: "block", width: 24, height: 2, background: burgerColor, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 24, height: 2, background: burgerColor, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </li>
        </ul>

        <style>{`
          @media(min-width:861px){ .nav-desktop-item { display: list-item !important; } }
          @media(max-width:860px){ .nav-order-btn { display: list-item !important; } .hamburger-btn { display: list-item !important; } }
        `}</style>
      </nav>

      
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "2rem", background: "none", border: "none", color: "#F5EDD8", fontSize: "1.8rem", cursor: "pointer" }}>✕</button>
        <img src={LOGO_SRC} alt="" style={{ height: 56, opacity: 0.9, marginBottom: "1rem" }} onError={e => e.target.style.display = "none"} />
        {[["#about","About"], ["#menu","Featured Dishes"], ["#gallery","Gallery"], ["#visit","Visit"]].map(([href, label]) => (
          <a key={label} href={href} onClick={() => setMobileOpen(false)}>{label}</a>
        ))}
      </div>
    </>
  );
}

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

function HeroCanvas() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <style>{HERO_CSS}</style>

      
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(155deg,#06030200 0%,#0D0604 22%,#1A0A07 52%,#220B08 78%,#0C0503 100%)" }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 75% 60% at 50% 78%, rgba(160,55,12,0.32) 0%, rgba(100,28,6,0.14) 50%, transparent 100%)" }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 40% at 50% 0%, rgba(120,18,8,0.25) 0%, transparent 68%)" }} />

      
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

        
        {Array.from({length:14},(_,i)=>(
          <line key={`gl${i}`} x1={i*95} y1={0} x2={i*95+700} y2={700}
            stroke="#D4A843" strokeWidth="0.4" strokeOpacity="0.032"/>
        ))}
        {Array.from({length:14},(_,i)=>(
          <line key={`gr${i}`} x1={i*95+700} y1={0} x2={i*95} y2={700}
            stroke="#D4A843" strokeWidth="0.35" strokeOpacity="0.022"/>
        ))}

        
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

        
        <ellipse cx={600} cy={592} rx={255} ry={70}
          fill="rgba(155,52,10,0.2)" filter="url(#softGlow)"/>

        
        <ellipse cx={600} cy={576} rx={220} ry={47}
          fill="url(#rimGrad)" stroke="#F5EDD8" strokeWidth="2.2" strokeOpacity="0.28"/>

        
        <ellipse cx={600} cy={574} rx={194} ry={40}
          fill="url(#brothGrad)"
          style={{animation:"brothShimmer 3.5s ease-in-out infinite"}}/>

        
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

        
        <g transform="translate(600,558) rotate(-14)">
          <rect x={-10} y={-188} width={6} height={192} rx={2.5} fill="rgba(168,115,50,0.7)"/>
          <rect x={5}   y={-178} width={6} height={182} rx={2.5} fill="rgba(130,85,32,0.62)"/>
        </g>

        
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

        
        {[
          [482,195,0],[722,148,0.38],[352,312,0.75],[882,332,1.12],
          [202,468,1.5],[1002,448,1.88],[542,90,2.25],[662,96,0.62],
          [142,512,1.0],[1062,515,1.4],
        ].map(([x,y,delay],i)=>(
          <circle key={i} cx={x} cy={y} r={2.2} fill="#D4A843" opacity="0.35"
            style={{animation:`sparkle ${2.5+(i%4)*0.55}s ease-in-out infinite ${delay}s`}}/>
        ))}

        
        <path d="M 406 568 A 196 42 0 0 1 794 568"
          fill="none" stroke="rgba(255,245,215,0.15)" strokeWidth="3.5"/>

        
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
function HomeHero({ onOrderClick, onMenuClick }) {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      
      <HeroCanvas />
      
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
        <div className="hero-buttons" style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onMenuClick} style={{ background: "#C4882B", color: "white", padding: "1rem 2.4rem", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all 0.3s", display: "inline-block" }}
            onMouseEnter={e => { e.target.style.background = "#6B1A1A"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#C4882B"; e.target.style.transform = "translateY(0)"; }}
          >Explore Our Menu</button>
          <button onClick={onOrderClick} style={{ background: "transparent", color: "#F5EDD8", padding: "1rem 2.4rem", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "1px solid rgba(245,237,216,0.45)", cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.borderColor = "#D4A843"; e.target.style.color = "#D4A843"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(245,237,216,0.45)"; e.target.style.color = "#F5EDD8"; }}
          >Order Online</button>
        </div>
      </div>
      
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
    <section id="about" className="section-pad">
      <div ref={ref} className="reveal section-inner about-grid">
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
          <div className="about-stats" style={{ marginTop: "3rem", paddingTop: "3rem", borderTop: "1px solid rgba(107,26,26,0.15)" }}>
            {[["20+", "Years of Experience"], ["4.3★", "Guest Rated"], ["50+", "Menu Items"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, color: "#6B1A1A", lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#7A6050", marginTop: "0.4rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", paddingBottom: "3rem" }}>
          <div style={{ position: "absolute", top: "-1.5rem", right: "-1.5rem", width: 110, height: 110, background: "#6B1A1A", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#F5EDD8", boxShadow: "0 8px 30px rgba(107,26,26,0.3)", zIndex: 2 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, lineHeight: 1 }}>★ 4.3</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75, textAlign: "center" }}>Guest<br />Rated</div>
          </div>
          <img src="/phodacbiet.jpg" alt="Restaurant" style={{ width: "100%", height: "clamp(280px, 50vw, 540px)", objectFit: "cover", display: "block" }} />
          <img src="/comtam.jpg" alt="Vietnamese food" className="about-overlay-img" style={{ position: "absolute", bottom: "-3rem", left: "-3rem", width: "52%", height: 200, objectFit: "cover", border: "6px solid #FBF6EE", boxShadow: "0 20px 60px rgba(30,20,16,0.18)" }} />
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
    <div style={{ background: "#F5EDD8", padding: "3rem 2rem", borderTop: "1px solid rgba(107,26,26,0.1)", borderBottom: "1px solid rgba(107,26,26,0.1)" }}>
      <div ref={ref} className="reveal section-inner delivery-inner">
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1E1410", marginBottom: "0.4rem" }}>Order Your Favourites</h3>
          <p style={{ fontSize: "0.9rem", color: "#6A5040" }}>Pick up in-store or have your meal delivered right to your door</p>
        </div>
        <div className="delivery-btns">
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
      { name: "Huong Viet Special Pho", viet: "Phở Đặc Biệt", desc: "Rare beef, beef ball, tendon, flank and tripe in our signature savoury bone broth.", price: "From $14.95", tag: "House Special", img: "/phodacbiet.jpg", fallback: "/phodacbiet.jpg" },
      { name: "Beef Ribs Phở", viet: "Phở Sườn Bò", desc: "Short ribs, beef balls and flank with rice noodles in a savoury beef broth. New item!", price: "$19.95", tag: "NEW", img: "/beefrib.jpg", fallback: "/beefrib.jpg"},
      { name: "Phnom Penh Style Noodle Soup", viet: "Hủ Tiếu Nam Vang", desc: "Vietnamese noodle bowl with rice and egg noodles, veggies, with Pork Ribs or Seafood in pork broth.", price: "From $17.95", tag: "Classic", img: "/hutieu.jpg", fallback: "/hutieu.jpg" },
    ]},
    { id: "mains", label: "Rice & Noodles", items: [
      { name: "Grilled Beef Lemongrass Rice", viet: "Cơm Bò Xào Sả", desc: "Lemongrass grilled beef with veggies on fragrant steamed rice. A customer favourite.", price: "$16.25", tag: "Signature", img: "/boxao.jpg", fallback: "/boxao.jpg" },
      { name: "Vietnamese Sizzling Crispy Crepe", viet: "Bánh Xèo", desc: "Savoury crispy crepe filled with seafood, ground pork, onion and bean sprouts.", price: "$17.95", tag: "NEW", img: "/banhxeo.jpg", fallback: "/banhxeo.jpg"},
      { name: "Golden Fried Chicken Rice", viet: "Cơm Gà Chiên Vàng", desc: "Crispy chicken with special sauce on coconut rice.", price: "$16.25", tag: "NEW", img: "/comga.jpg", fallback: "/comga.jpg" },
    ]},
    { id: "drinks", label: "Drinks & Desserts", items: [
      { name: "Caramel Coffee", viet: "Cà Phê Caramel", desc: "Smooth Vietnamese coffee swirled with golden caramel, served over ice for a rich indulgent sip.", price: "~$6", tag: "NEW", img: "/caramelcoffee.jpg", fallback: "/caramelcoffee.jpg" },
      { name: "Coconut Coffee", viet: "Cà Phê Dừa", desc: "cold, sweet and tropical.", price: "~$6", tag: "NEW", img: "/coconutcoffee.webp", fallback: "/coconutcoffee.webp" },
      { name: "Sparkling Lychee Drink", viet: "Nước Vải Có Ga", desc: "Refreshing sparkling lychee drink with a fruity floral finish. Perfect to cool down.", price: "~$6", tag: "NEW", img: "/lycheedrink.webp", fallback: "/lycheedrink.webp" },
    ]},
  ];
  const active = homeTabs.find(t => t.id === activeTab);
  return (
    <div id="menu" className="section-pad" style={{ background: "#1E1410", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle,rgba(107,26,26,0.25) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div ref={tabsRef} className="reveal menu-home-tab-row" style={{ maxWidth: 1300, margin: "0 auto 4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
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
      <div ref={ref} className="reveal" style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2px" }}>
        {active && active.items.map(item => (
          <div key={item.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,237,216,0.07)", overflow: "hidden", transition: "all 0.4s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ overflow: "hidden", height: 320 }}>
              <img src={item.img} alt={item.name} style={{ width: "100%", height: 320, objectFit: "cover", objectPosition: item.imgPos || "center center", display: "block", transition: "transform 0.6s" }}
                onError={e => e.target.src = item.fallback}
                onMouseEnter={e => e.target.style.transform = "scale(1.07)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              />
            </div>
            <div style={{ padding: "1.6rem 1.8rem 0.5rem" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#F5EDD8", marginBottom: "0.4rem" }}>{item.name}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontStyle: "italic", color: "#D4A843", marginBottom: "0.8rem", opacity: 0.85 }}></div>
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
    { src: "/comsuonbo.webp", fb: "/comsuonbo.webp" },
    { src: "/chickenwings.jpg", fb: "/chickenwings.jpg" },
    { src: "/hutieu.jpg", fb: "/hutieu.jpg" },
    { src: "/bokho.webp", fb: "/bokho.webp" },
    { src: "/crispynoodle.jpg", fb: "/crispynoodle.jpg" },
  ];
  return (
    <section id="gallery" className="section-pad" style={{ background: "#F5EDD8" }}>
      <div className="section-inner">
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

const VIDEO_SRC = "video.mp4";

function FeaturedVideoSection() {
  const ref = useReveal();
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  // Try autoplay on desktop
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setStarted(true)).catch(() => {});
  }, []);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => {});
  };

  return (
    <section className="section-pad" style={{ background: "#1E1410" }}>
      <div className="section-inner">
        <div ref={ref} className="reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>Our Kitchen</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, color: "#F5EDD8" }}>
            Authentic <em style={{ color: "#D4A843" }}>Vietnamese taste</em>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.25rem)", color: "rgba(245,237,216,0.6)", fontStyle: "italic", marginTop: "1rem", maxWidth: 540, margin: "1rem auto 0" }}>
            Over 20 years of crafting genuine Vietnamese flavours on 17 Ave SW, Calgary
          </p>
        </div>

        <div style={{ maxWidth: 400, margin: "0 auto", borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", position: "relative" }}>
          {/* Actual video (always rendered so autoplay works on desktop) */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            style={{ width: "100%", display: "block", aspectRatio: "9/16", objectFit: "cover" }}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>

          {/* Overlay shown on mobile until user taps */}
          {!started && (
            <div onClick={handlePlay} style={{
              position: "absolute", inset: 0, cursor: "pointer",
              background: "rgba(0,0,0,0.45)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem"
            }}>
              <img src="/phodacbiet.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 1 }} />
              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: 76, height: 76, borderRadius: "50%",
                  background: "rgba(196,136,43,0.92)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 5 }}>
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                  Tap to watch
                </span>
              </div>
            </div>
          )}
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
    <div className="section-pad" style={{ background: "#6B1A1A" }}>
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>Guest Voices</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, color: "#F5EDD8" }}>
            What our <em style={{ color: "#D4A843" }}>customers say</em>
          </h2>
        </div>
        <div ref={ref} className="reveal testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
          {reviews.map(r => (
            <div key={r.author} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(245,237,216,0.1)", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
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
    <section id="visit" className="section-pad">
      <div ref={ref} className="reveal section-inner visit-grid">
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.0!2d-114.1450!3d51.0390!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170144939363b%3A0x7d68671f6f9c0a50!2sPho%20Huong%20Viet%20Noodle%20House!5e0!3m2!1sen!2sca!4v1"
            title="Pho Huong Viet location"
            allowFullScreen loading="lazy"
            style={{ width: "100%", height: "clamp(260px, 45vw, 400px)", border: "none", display: "block" }}
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
    <div className="section-pad" style={{ background: "#1E1410", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-4rem", right: "-2rem", fontFamily: "'Playfair Display', serif", fontSize: "clamp(8rem, 20vw, 20rem)", color: "rgba(255,255,255,0.02)", pointerEvents: "none", lineHeight: 1, userSelect: "none" }}>"PHỞ"</div>
      <div ref={ref} className="reveal" style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A843", marginBottom: "1rem" }}>Ready to Eat?</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, color: "#F5EDD8", marginBottom: "1.5rem" }}>
          Order Your <em style={{ color: "#D4A843" }}>Favourites</em>
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgba(245,237,216,0.55)", fontStyle: "italic", marginBottom: "3rem" }}>
          Dine in, pick up, or have it delivered right to your door
        </p>
        <div className="cta-buttons" style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
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
    <footer style={{ background: "#120C08", padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.2rem, 5vw, 2rem)", textAlign: "center" }}>
      <img src={LOGO_SRC} alt="Pho Huong Viet" style={{ height: 60, margin: "0 auto 0.5rem", display: "block", opacity: 0.85 }} onError={e => e.target.style.display = "none"} />
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(245,237,216,0.35)", fontSize: "0.95rem", marginBottom: "2.5rem" }}>
        Authentic Vietnamese Kitchen · Over 20 Years · Calgary, AB
      </div>
      <div style={{ width: 60, height: 1, background: "rgba(212,168,67,0.3)", margin: "0 auto 2.5rem" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {[["About", "#about"], ["Featured Dishes", "#menu"], ["Gallery", "#gallery"], ["Visit Us", "#visit"]].map(([label, href]) => (
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

function MenuPopup({ open, onClose, onOrderClick }) {
  const [activeTab, setActiveTab] = useState(MENU[0].id);
  const activeCat = MENU.find(c => c.id === activeTab);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(14,8,3,0.85)", backdropFilter: "blur(4px)" }} />

      {/* Modal — full screen height on mobile */}
      <div style={{ position: "relative", background: "#FBF6EE", width: "100%", maxWidth: 900, height: "100dvh", maxHeight: "100dvh", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", overflow: "hidden", borderRadius: 0 }}>

        {/* Header */}
        <div style={{ background: "#1E1410", padding: "1rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid rgba(212,168,67,0.15)", gap: "0.8rem" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#F5EDD8", fontWeight: 400 }}>
              Our <em style={{ fontStyle: "italic", color: "#D4A843" }}>Menu</em>
            </div>
            <div style={{ fontSize: "0.68rem", color: "rgba(212,168,67,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "0.2rem" }}>
              Pho Huong Viet · 17 Ave SW, Calgary
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <button onClick={() => { onClose(); onOrderClick(); }} style={{ background: "#C4882B", color: "white", border: "none", padding: "0.6rem 1.2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Order Now</button>
            {/* Big, easy-to-tap close button */}
            <button onClick={onClose} style={{ background: "rgba(245,237,216,0.12)", border: "2px solid rgba(245,237,216,0.35)", color: "#F5EDD8", width: 44, height: 44, fontSize: "1.3rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, flexShrink: 0, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#6B1A1A"; e.currentTarget.style.borderColor = "#6B1A1A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,237,216,0.12)"; e.currentTarget.style.borderColor = "rgba(245,237,216,0.35)"; }}
            >✕</button>
          </div>
        </div>

        {/* Category selector — dropdown on mobile, tabs on desktop */}
        <div style={{ background: "#F5EDD8", borderBottom: "1px solid rgba(107,26,26,0.12)", padding: "0.75rem 1rem", flexShrink: 0 }}>
          {/* Mobile: dropdown */}
          <select
            value={activeTab}
            onChange={e => setActiveTab(e.target.value)}
            style={{
              display: "none",
              width: "100%", padding: "0.65rem 1rem",
              border: "1px solid rgba(107,26,26,0.25)", borderRadius: 4,
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
              color: "#2A1A0E", background: "white", cursor: "pointer",
              appearance: "auto",
            }}
            className="menu-cat-dropdown"
          >
            {MENU.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
          </select>
          {/* Desktop: tab pills */}
          <div className="menu-cat-tabs" style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {MENU.map(cat => (
              <button key={cat.id} onClick={() => setActiveTab(cat.id)} style={{
                padding: "0.4rem 0.9rem", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.08em",
                textTransform: "uppercase", border: "1px solid", cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                borderColor: activeTab === cat.id ? "#6B1A1A" : "rgba(107,26,26,0.18)",
                background: activeTab === cat.id ? "#6B1A1A" : "transparent",
                color: activeTab === cat.id ? "#F5EDD8" : "#7A6050",
              }}>{cat.category}</button>
            ))}
          </div>
        </div>

        {/* Items — scrollable */}
        <div style={{ overflowY: "auto", padding: "1.2rem", flex: 1, WebkitOverflowScrolling: "touch" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#1E1410", paddingBottom: "0.8rem", marginBottom: "1.2rem", borderBottom: "2px solid rgba(107,26,26,0.14)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {activeCat?.category}
          </div>
          <div className="menu-popup-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.8rem" }}>
            {activeCat?.items.map(item => (
              <div key={item.id} style={{ background: "white", border: "1px solid rgba(107,26,26,0.1)", padding: "1rem 1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontWeight: 600, color: "#2A1A0E", lineHeight: 1.3 }}>
                  {item.name}
                  {(item.tags || []).map(t => <Tag key={t} type={t} />)}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "#6A5040", lineHeight: 1.55, flex: 1, fontWeight: 300 }}>{item.desc}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#6B1A1A", marginTop: "0.3rem" }}>
                  {item.sizes ? item.sizes.map(s => `${s.label} $${s.price.toFixed(2)}`).join(" / ") : `$${item.price.toFixed(2)}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#1E1410", padding: "0.9rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderTop: "1px solid rgba(212,168,67,0.1)", flexWrap: "wrap", gap: "0.6rem" }}>
          <p style={{ fontSize: "0.78rem", color: "rgba(245,237,216,0.35)" }}>
            Allergies? Call <a href="tel:+14036863799" style={{ color: "#D4A843", textDecoration: "none" }}>(403) 686-3799</a>
          </p>
          <button onClick={() => { onClose(); onOrderClick(); }} style={{ background: "#C4882B", color: "white", border: "none", padding: "0.65rem 1.4rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>🥡 Order Pick Up</button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onOrderClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <HomeNav onOrderClick={onOrderClick} />
      <HomeHero onOrderClick={onOrderClick} onMenuClick={() => setMenuOpen(true)} />
      <Marquee />
      <AboutSection />
      <FeaturedVideoSection />
      <DeliveryBanner onOrderClick={onOrderClick} />
      <MenuSection />
      <GallerySection />
      <TestimonialsSection />
      <VisitSection onOrderClick={onOrderClick} />
      <OrderCTASection onOrderClick={onOrderClick} />
      <HomeFooter onOrderClick={onOrderClick} />
      <MenuPopup open={menuOpen} onClose={() => setMenuOpen(false)} onOrderClick={onOrderClick} />
    </div>
  );
}

async function publishOrderToKitchen(order) {
  const key = ABLY_API_KEY;
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

function OrderNav({ onBack, cartCount, onCartOpen }) {
  return (
    <header style={{ background: "#1E1410", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 30px rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(212,168,67,0.12)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0.8rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", minWidth: 0, overflow: "hidden" }}>
          <button onClick={onBack} style={{ color: "rgba(245,237,216,0.45)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s", flexShrink: 0 }}
            onMouseEnter={e => e.target.style.color = "#D4A843"}
            onMouseLeave={e => e.target.style.color = "rgba(245,237,216,0.45)"}
          >← Home</button>
          <div style={{ width: 1, height: 24, background: "rgba(212,168,67,0.2)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0, overflow: "hidden" }}>
            <img src={LOGO_SRC} alt="" style={{ height: 34, width: "auto", flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#F5EDD8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Pho Huong Viet</div>
              <div style={{ fontSize: "0.6rem", color: "rgba(212,168,67,0.7)", letterSpacing: "0.14em", textTransform: "uppercase" }}>17 Ave SW · Calgary</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          

          <span className="order-nav-pickup" style={{ background: "rgba(196,136,43,0.15)", border: "1px solid rgba(196,136,43,0.3)", color: "#D4A843", padding: "0.35rem 0.9rem", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
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
    <div style={{ background: "#1E1410", position: "relative", overflow: "hidden", padding: "clamp(2rem, 6vw, 3.5rem) clamp(1rem, 5vw, 2.5rem)", textAlign: "center" }}>
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
      <div className="order-hero-info">
        {["📍 #3855 17 Ave SW, Calgary", "📞 (403) 686-3799", "🕐 Mon 11am–4pm · Tue–Sun 11am–9pm"].map(t => (
          <span key={t} style={{ fontSize: "0.78rem", color: "rgba(212,168,67,0.75)", letterSpacing: "0.08em" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

const BT_FLAVOURS = ["Mango","Strawberry","Taro","Lychee","Avocado","Pineapple","Orange","Watermelon","Green Tea","Peach","Papaya","Banana","Passion Fruit","Blueberry","Coconut","Mocha"];

function BubbleTeaCard({ item, cart, onAdd, onRemove, onRemoveFull }) {
  const [hovered, setHovered] = useState(false);
  const [flavours, setFlavours] = useState(["", "", ""]);
  const [topping, setTopping] = useState("pearl"); // pearl | jelly | none
  const [extras, setExtras] = useState({ extraPearl: false, extraJelly: false });

  const primaryFlavour = flavours[0];
  const extraFlavours = flavours.slice(1).filter(Boolean);
  const extraFlavourCost = extraFlavours.length * 0.50;
  const extraToppingCost = (extras.extraPearl ? 0.50 : 0) + (extras.extraJelly ? 0.50 : 0);
  const totalPrice = item.price + extraFlavourCost + extraToppingCost;

  // Build a unique cart key from all selections
  const flavourStr = flavours.filter(Boolean).join("+");
  const toppingStr = topping;
  const extrasStr = [extras.extraPearl && "xPearl", extras.extraJelly && "xJelly"].filter(Boolean).join("+");
  const cartKey = [String(item.id), flavourStr || "none", toppingStr, extrasStr].filter(Boolean).join("|");
  const qty = cart[cartKey]?.qty || 0;
  const canAdd = !!primaryFlavour;

  const toggleExtra = (key) => setExtras(p => ({ ...p, [key]: !p[key] }));
  const setFlavour = (idx, val) => {
    setFlavours(prev => {
      const next = [...prev];
      next[idx] = val;
      // Clear subsequent if primary cleared
      if (idx === 0 && !val) { next[1] = ""; next[2] = ""; }
      if (idx === 1 && !val) { next[2] = ""; }
      return next;
    });
  };

  const usedFlavours = (idx) => flavours.filter((f, i) => f && i !== idx);

  const chipStyle = (active) => ({
    padding: "0.3rem 0.75rem", fontSize: "0.76rem", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600, cursor: "pointer", border: "1px solid",
    borderColor: active ? "#6B1A1A" : "rgba(107,26,26,0.2)",
    background: active ? "#6B1A1A" : "transparent",
    color: active ? "white" : "#6B1A1A",
    transition: "all 0.15s", borderRadius: 2,
  });

  const selectStyle = {
    width: "100%", padding: "0.45rem 0.7rem",
    border: `1px solid rgba(107,26,26,0.2)`,
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
    color: "#2A1A0E", background: "#FBF6EE", outline: "none", cursor: "pointer", borderRadius: 2,
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: "white", border: "1px solid rgba(107,26,26,0.14)",
      padding: "1.3rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.75rem",
      transition: "all 0.25s",
      boxShadow: hovered ? "0 8px 32px rgba(107,26,26,0.12)" : "0 2px 24px rgba(107,26,26,0.07)",
      transform: hovered ? "translateY(-2px)" : "none",
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600, color: "#2A1A0E" }}>
        {item.name} <Tag type="pop" />
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.92rem", color: "#6A5040" }}>{item.desc}</div>

      {/* Flavour selectors */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6050", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Flavour <span style={{ color: "#C4882B" }}>*</span>
        </div>
        {[0, 1, 2].map(idx => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select
              value={flavours[idx]}
              disabled={idx > 0 && !flavours[idx - 1]}
              onChange={e => setFlavour(idx, e.target.value)}
              style={{ ...selectStyle, opacity: (idx > 0 && !flavours[idx - 1]) ? 0.4 : 1 }}
            >
              <option value="">{idx === 0 ? "— Choose flavour —" : `— Add 2nd flavour ${idx === 1 ? "(+$0.50)" : ""} —`}{idx === 2 ? " (+$0.50)" : ""}</option>
              {BT_FLAVOURS.filter(f => !usedFlavours(idx).includes(f)).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {idx > 0 && flavours[idx] && (
              <span style={{ fontSize: "0.72rem", color: "#C4882B", fontWeight: 600, whiteSpace: "nowrap" }}>+$0.50</span>
            )}
          </div>
        ))}
      </div>

      {/* Pearl or Jelly */}
      <div>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6050", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Base</div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {[["pearl", "🧋 Tapioca Pearl"], ["jelly", "🍮 Jelly"], ["none", "No Topping"]].map(([val, label]) => (
            <button key={val} onClick={() => setTopping(val)} style={chipStyle(topping === val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6050", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Extras (+$0.50 each)</div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {[["extraPearl", "Extra Pearl"], ["extraJelly", "Extra Jelly"]].map(([key, label]) => (
            <button key={key} onClick={() => toggleExtra(key)} style={chipStyle(extras[key])}>{label}{extras[key] ? " ✓" : ""}</button>
          ))}
        </div>
      </div>

      {/* Price + Add */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.7rem", borderTop: "1px solid rgba(107,26,26,0.08)" }}>
        <div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#6B1A1A" }}>${totalPrice.toFixed(2)}</span>
          {(extraFlavourCost + extraToppingCost) > 0 && (
            <span style={{ fontSize: "0.72rem", color: "#7A6050", marginLeft: "0.4rem" }}>base $6.50 + extras</span>
          )}
        </div>
        {qty === 0 ? (
          <button
            onClick={() => { if (canAdd) onAdd(item.id, flavourStr, null, totalPrice, cartKey); }}
            style={{ background: canAdd ? "#6B1A1A" : "#ccc", color: "white", border: "none", width: 32, height: 32, fontSize: "1.2rem", fontWeight: 700, cursor: canAdd ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center" }}
            title={!canAdd ? "Please choose a flavour first" : ""}
          >+</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => onRemoveFull(cartKey)} style={{ background: "#FBF6EE", border: "1px solid rgba(107,26,26,0.14)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>−</button>
            <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center", fontSize: "0.95rem", color: "#6B1A1A" }}>{qty}</span>
            <button onClick={() => onAdd(item.id, flavourStr, null, totalPrice, cartKey)} style={{ background: "#FBF6EE", border: "1px solid rgba(107,26,26,0.14)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared sauce list ──────────────────────────────────────────
const SHARED_SAUCES = [
  { key: "fish",    label: "Add Fish Sauce",        price: 0.50 },
  { key: "peanut",  label: "Add Peanut Sauce",      price: 0.50 },
  { key: "hoisin",  label: "Add Hoisin Sauce",      price: 0.50 },
  { key: "sriracha",label: "Add Sriracha Sauce",    price: 0.50 },
  { key: "plum",    label: "Add Plum Sauce",        price: 0.50 },
];
const SUB_ADDONS = [
  { key: "xmeat",   label: "Add Extra Meat",        price: 3.00 },
  { key: "xshrimp", label: "Add Extra Shrimp",      price: 3.95 },
  { key: "xcheese", label: "Add Extra Cheese",      price: 1.00 },
  { key: "xjal",    label: "Add Jalapeños",         price: 0.50 },
  { key: "xavo",    label: "Add Avocado",           price: 1.50 },
];
const BUN_ADDONS = [
  { key: "xverm",   label: "Add Extra Vermicelli",  price: 2.50 },
  { key: "xroll",   label: "Add Spring Roll (1pc)", price: 1.75 },
  { key: "xpork",   label: "Add BBQ Pork",          price: 3.00 },
  { key: "xshred",  label: "Add Shredded Pork",     price: 3.00 },
  { key: "xpatty",  label: "Add Marinated Pork Patty", price: 3.00 },
  { key: "xchk",    label: "Add BBQ Chicken",       price: 3.00 },
  { key: "xbeef",   label: "Add Beef",              price: 3.00 },
  { key: "xsate",   label: "Add Beef Sate Skewer",  price: 3.00 },
  { key: "xpaste",  label: "Add Grilled Shrimp Paste", price: 2.95 },
  { key: "xshrimp", label: "Add Shrimp",            price: 3.95 },
  { key: "xprawn",  label: "Add Charbroiled Prawns (3pcs)", price: 3.95 },
];
const NOODLE_CHOICES = [
  { key: "regular", label: "Regular Egg Noodles",       price: 0 },
  { key: "crispy",  label: "Crispy Egg Noodles",        price: 1.00 },
];
const NOODLE_ADDONS = [
  { key: "xnoodle", label: "Add Extra Egg Noodles",     price: 2.50 },
  { key: "xcrispy", label: "Add Extra Crispy Egg Noodles", price: 1.00 },
  { key: "xchk",    label: "Add Chicken",               price: 3.00 },
  { key: "xbeef",   label: "Add Beef",                  price: 3.00 },
  { key: "xseafood",label: "Add Seafood",               price: 3.50 },
  { key: "xtofu",   label: "Add Tofu",                  price: 2.50 },
];
const RICE_ADDONS = [
  { key: "xrice",   label: "Add Extra Rice",            price: 3.50 },
  { key: "xveg",    label: "Add Extra Vegetables",      price: 3.00 },
  { key: "xchk",    label: "Add BBQ Chicken",           price: 3.00 },
  { key: "xpchop",  label: "Add BBQ Pork Chop",         price: 4.95 },
  { key: "xshred",  label: "Add Shredded Pork",         price: 3.00 },
  { key: "xpie",    label: "Add Meat Pie",              price: 3.00 },
  { key: "xbreast", label: "Add Chicken Breast",        price: 3.00 },
  { key: "xbeef",   label: "Add Beef",                  price: 3.00 },
  { key: "xpaste",  label: "Add Grilled Shrimp Paste",  price: 3.95 },
  { key: "xfish",   label: "Add Fish Cake",             price: 3.95 },
  { key: "xseafood",label: "Add Seafood",               price: 3.50 },
];

function CustomizeModal({ item, basePrice, extraSections, onClose, onAddToCart }) {
  const [selections, setSelections] = useState({});
  const [note, setNote] = useState("");
  const [qty,  setQty]  = useState(1);

  const extraCost = extraSections.reduce((sum, section) => {
    if (section.type === "radio") {
      const chosen = section.options.find(o => selections[o.key]);
      return sum + (chosen?.price || 0);
    }
    return sum + (section.items || []).reduce((s, a) => s + (selections[a.key] ? a.price : 0), 0);
  }, 0);
  const unitPrice = basePrice + extraCost;
  const total = unitPrice * qty;

  const toggleCheck = (key) => setSelections(p => ({ ...p, [key]: !p[key] }));
  const selectRadio = (section, key) => setSelections(p => {
    const next = { ...p };
    section.options.forEach(o => { next[o.key] = false; });
    next[key] = true;
    return next;
  });

  const handleAdd = () => {
    const parts = extraSections.flatMap(s =>
      s.type === "radio"
        ? (s.options.find(o => selections[o.key])?.key ? [s.options.find(o => selections[o.key]).key] : [])
        : (s.items || []).filter(a => selections[a.key]).map(a => a.key)
    );
    const extrasStr = parts.join("+");
    const noteStr   = note.trim();
    const customKey = [String(item.id), extrasStr || null, noteStr ? `note:${noteStr.slice(0,40).replace(/\|/g,",")}` : null].filter(Boolean).join("|");
    onAddToCart(item.id, null, null, unitPrice, customKey, qty);
    onClose();
  };

  const rowStyle   = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.55rem 0.2rem", borderBottom: "1px solid rgba(107,26,26,0.07)", cursor: "pointer" };
  const boxStyle   = (on) => ({ width: 18, height: 18, borderRadius: 3,    border: `2px solid ${on ? "#6B1A1A" : "rgba(107,26,26,0.25)"}`, background: on ? "#6B1A1A" : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" });
  const radioStyle = (on) => ({ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${on ? "#6B1A1A" : "rgba(107,26,26,0.25)"}`, background: "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" });
  const checkSvg = <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" fill="none"/></svg>;
  const dotEl    = <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6B1A1A" }} />;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,8,0,0.65)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", width: "100%", maxWidth: 480, maxHeight: "92dvh", overflowY: "auto", borderRadius: "14px 14px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#1E1410", color: "#F5EDD8", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderRadius: "14px 14px 0 0", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600 }}>{item.name}</div>
            <div style={{ fontSize: "0.75rem", color: "#D4A843", marginTop: "0.2rem" }}>${basePrice.toFixed(2)}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,237,216,0.6)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1, padding: "0.1rem 0.3rem" }}>✕</button>
        </div>
        <div style={{ padding: "1.2rem 1.4rem", flex: 1 }}>
          {item.desc && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "#6A5040", marginBottom: "1rem", lineHeight: 1.6 }}>{item.desc}</p>}
          {extraSections.map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1E1410", margin: `${si > 0 ? "1rem" : "0.2rem"} 0 0.3rem` }}>{section.label}</div>
              {(section.options || section.items || []).map(a => (
                <div key={a.key} style={rowStyle} onClick={() => section.type === "radio" ? selectRadio(section, a.key) : toggleCheck(a.key)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    {section.type === "radio"
                      ? <div style={radioStyle(selections[a.key])}>{selections[a.key] && dotEl}</div>
                      : <div style={boxStyle(selections[a.key])}>{selections[a.key] && checkSvg}</div>
                    }
                    <span style={{ fontSize: "0.88rem", color: "#2A1A0E" }}>{a.label}</span>
                  </div>
                  <span style={{ fontSize: "0.82rem", color: a.price ? "#6B1A1A" : "#7A6050", fontWeight: 600 }}>
                    {a.price ? `+$${a.price.toFixed(2)}` : "Free"}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: "1.1rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1E1410", marginBottom: "0.4rem" }}>Special Request</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. No onions, extra spicy, sauce on the side…" rows={2}
              style={{ width: "100%", padding: "0.6rem 0.8rem", border: "1px solid rgba(107,26,26,0.18)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#2A1A0E", background: "#FBF6EE", resize: "none", outline: "none", borderRadius: 2, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#6B1A1A"}
              onBlur={e => e.target.style.borderColor = "rgba(107,26,26,0.18)"}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid rgba(107,26,26,0.1)" }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#7A6050", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Quantity</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, border: "1px solid rgba(107,26,26,0.2)", background: "white", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>−</button>
                <span style={{ fontWeight: 700, fontSize: "1rem", minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, border: "1px solid rgba(107,26,26,0.2)", background: "white", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>+</button>
              </div>
            </div>
            <button onClick={handleAdd} style={{ background: "#6B1A1A", color: "white", border: "none", padding: "0.85rem 1.6rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer", borderRadius: 2, transition: "background 0.2s" }}
              onMouseEnter={e => e.target.style.background = "#C4882B"}
              onMouseLeave={e => e.target.style.background = "#6B1A1A"}
            >Add to Order — ${total.toFixed(2)}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubModal({ item, onClose, onAddToCart }) {
  return <CustomizeModal item={item} basePrice={item.price} onClose={onClose} onAddToCart={onAddToCart}
    extraSections={[{ label: "Add-Ons", items: SUB_ADDONS }, { label: "Add Sauce", items: SHARED_SAUCES }]} />;
}
function BunModal({ item, onClose, onAddToCart }) {
  return <CustomizeModal item={item} basePrice={item.price} onClose={onClose} onAddToCart={onAddToCart}
    extraSections={[{ label: "Add-Ons", items: BUN_ADDONS }, { label: "Add Sauce", items: SHARED_SAUCES }]} />;
}
function NoodleModal({ item, onClose, onAddToCart }) {
  return <CustomizeModal item={item} basePrice={item.price} onClose={onClose} onAddToCart={onAddToCart}
    extraSections={[{ label: "Choose Noodles", type: "radio", options: NOODLE_CHOICES }, { label: "Add-Ons", items: NOODLE_ADDONS }, { label: "Add Sauce", items: SHARED_SAUCES }]} />;
}
function RiceModal({ item, onClose, onAddToCart }) {
  return <CustomizeModal item={item} basePrice={item.price} onClose={onClose} onAddToCart={onAddToCart}
    extraSections={[{ label: "Add-Ons", items: RICE_ADDONS }, { label: "Add Sauce", items: SHARED_SAUCES }]} />;
}

const APP_SAUCES = [
  { key: "fish",    label: "Add Fish Sauce",     price: 0.50 },
  { key: "peanut",  label: "Add Peanut Sauce",   price: 0.50 },
  { key: "hoisin",  label: "Add Hoisin Sauce",   price: 0.50 },
  { key: "sriracha",label: "Add Sriracha Sauce", price: 0.50 },
  { key: "plum",    label: "Add Plum Sauce",     price: 0.50 },
  { key: "sweet",   label: "Add Sweet Chili Sauce", price: 0.50 },
];

function AppCustomizeModal({ item, onClose, onAddToCart }) {
  const [sauces, setSauces] = useState({});
  const [note,   setNote]   = useState("");
  const [qty,    setQty]    = useState(1);

  const sauceCost = APP_SAUCES.reduce((s, a) => s + (sauces[a.key] ? a.price : 0), 0);
  const unitPrice = item.price + sauceCost;
  const total     = unitPrice * qty;

  const toggle = (key) => setSauces(p => ({ ...p, [key]: !p[key] }));

  const handleAdd = () => {
    const sauceKeys = APP_SAUCES.filter(a => sauces[a.key]).map(a => a.key).join("+");
    const noteStr   = note.trim();
    const customKey = [String(item.id), sauceKeys || null, noteStr ? `note:${noteStr.slice(0,40).replace(/\|/g,",")}` : null].filter(Boolean).join("|");
    onAddToCart(item.id, null, null, unitPrice, customKey, qty);
    onClose();
  };

  const rowStyle  = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.55rem 0.2rem", borderBottom: "1px solid rgba(107,26,26,0.07)", cursor: "pointer" };
  const checkStyle = (on) => ({
    width: 18, height: 18, borderRadius: 3, border: `2px solid ${on ? "#6B1A1A" : "rgba(107,26,26,0.25)"}`,
    background: on ? "#6B1A1A" : "white", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,8,0,0.65)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", width: "100%", maxWidth: 480, maxHeight: "88dvh", overflowY: "auto", borderRadius: "14px 14px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ background: "#1E1410", color: "#F5EDD8", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderRadius: "14px 14px 0 0", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600 }}>{item.name}</div>
            <div style={{ fontSize: "0.75rem", color: "#D4A843", marginTop: "0.2rem" }}>${item.price.toFixed(2)}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,237,216,0.6)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1, padding: "0.1rem 0.3rem" }}>✕</button>
        </div>

        <div style={{ padding: "1.2rem 1.4rem", flex: 1 }}>

          {/* Desc */}
          {item.desc && (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "#6A5040", marginBottom: "1rem", lineHeight: 1.6 }}>{item.desc}</p>
          )}

          {/* Sauces */}
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1E1410", marginBottom: "0.3rem" }}>Add Sauce</div>
          {APP_SAUCES.map(a => (
            <div key={a.key} style={rowStyle} onClick={() => toggle(a.key)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={checkStyle(sauces[a.key])}>
                  {sauces[a.key] && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" fill="none"/></svg>}
                </div>
                <span style={{ fontSize: "0.88rem", color: "#2A1A0E" }}>{a.label}</span>
              </div>
              <span style={{ fontSize: "0.82rem", color: "#6B1A1A", fontWeight: 600 }}>+${a.price.toFixed(2)}</span>
            </div>
          ))}

          {/* Note */}
          <div style={{ marginTop: "1.1rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1E1410", marginBottom: "0.4rem" }}>Special Request</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Extra crispy, less oil, no cilantro…" rows={2}
              style={{ width: "100%", padding: "0.6rem 0.8rem", border: "1px solid rgba(107,26,26,0.18)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#2A1A0E", background: "#FBF6EE", resize: "none", outline: "none", borderRadius: 2, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#6B1A1A"}
              onBlur={e => e.target.style.borderColor = "rgba(107,26,26,0.18)"}
            />
          </div>

          {/* Qty + Add */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid rgba(107,26,26,0.1)" }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#7A6050", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Quantity</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, border: "1px solid rgba(107,26,26,0.2)", background: "white", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>−</button>
                <span style={{ fontWeight: 700, fontSize: "1rem", minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, border: "1px solid rgba(107,26,26,0.2)", background: "white", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>+</button>
              </div>
            </div>
            <button onClick={handleAdd} style={{ background: "#6B1A1A", color: "white", border: "none", padding: "0.85rem 1.6rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer", borderRadius: 2, transition: "background 0.2s" }}
              onMouseEnter={e => e.target.style.background = "#C4882B"}
              onMouseLeave={e => e.target.style.background = "#6B1A1A"}
            >Add to Order — ${total.toFixed(2)}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


const SOUP_ADDONS = [
  { key: "noodles",    label: "Add Extra Noodles",       price: 2.00 },
  { key: "veggies",    label: "Add Vegetables",           price: 3.00 },
  { key: "beef",       label: "Add Extra Beef",           price: 3.00 },
  { key: "rarebeef",   label: "Add Medium-Rare Beef",     price: 3.00 },
  { key: "flank",      label: "Add Flank",                price: 3.00 },
  { key: "tendon",     label: "Add Tendon",               price: 3.00 },
  { key: "tripe",      label: "Add Tripe",                price: 3.00 },
  { key: "meatballs",  label: "Add Beef Meatballs (4pcs)",price: 2.50 },
  { key: "chicken",    label: "Add Chicken",              price: 3.00 },
  { key: "seafood",    label: "Add Seafood",              price: 3.95 },
];
const SOUP_SAUCES = [
  { key: "fish",    label: "Add Fish Sauce",    price: 0.50 },
  { key: "peanut",  label: "Add Peanut Sauce",  price: 0.50 },
  { key: "hoisin",  label: "Add Hoisin Sauce",  price: 0.50 },
  { key: "sriracha",label: "Add Sriracha Sauce",price: 0.50 },
  { key: "plum",    label: "Add Plum Sauce",    price: 0.50 },
];

function SoupCustomizeModal({ item, size, onClose, onAddToCart }) {
  const [addons, setAddons]   = useState({});
  const [sauces, setSauces]   = useState({});
  const [note, setNote]       = useState("");
  const [qty, setQty]         = useState(1);

  const basePrice = size ? size.price : item.price;
  const addonCost = SOUP_ADDONS.reduce((s, a) => s + (addons[a.key] ? a.price : 0), 0);
  const sauceCost = SOUP_SAUCES.reduce((s, a) => s + (sauces[a.key] ? a.price : 0), 0);
  const unitPrice = basePrice + addonCost + sauceCost;
  const total     = unitPrice * qty;

  const toggle = (obj, setObj, key) => setObj(p => ({ ...p, [key]: !p[key] }));

  const handleAdd = () => {
    const addonKeys  = SOUP_ADDONS.filter(a => addons[a.key]).map(a => a.key);
    const sauceKeys  = SOUP_SAUCES.filter(a => sauces[a.key]).map(a => a.key);
    const extras     = [...addonKeys, ...sauceKeys].join("+");
    const noteStr    = note.trim();
    const sizeTag    = size ? `sz:${size.label}` : null;
    const customKey  = [String(item.id), sizeTag, extras || null, noteStr ? `note:${noteStr.slice(0,40).replace(/\|/g,",")}` : null].filter(Boolean).join("|");
    onAddToCart(item.id, null, size, unitPrice, customKey, qty);
    onClose();
  };

  const rowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.55rem 0.2rem", borderBottom: "1px solid rgba(107,26,26,0.07)", cursor: "pointer" };
  const checkStyle = (on) => ({
    width: 18, height: 18, borderRadius: 3, border: `2px solid ${on ? "#6B1A1A" : "rgba(107,26,26,0.25)"}`,
    background: on ? "#6B1A1A" : "white", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,8,0,0.65)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", width: "100%", maxWidth: 480, maxHeight: "92dvh", overflowY: "auto", borderRadius: "14px 14px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: "#1E1410", color: "#F5EDD8", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderRadius: "14px 14px 0 0", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600 }}>{item.name}</div>
            {size && <div style={{ fontSize: "0.75rem", color: "#D4A843", marginTop: "0.2rem" }}>Size: {size.label} — ${basePrice.toFixed(2)}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,237,216,0.6)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1, padding: "0.1rem 0.3rem" }}>✕</button>
        </div>

        <div style={{ padding: "1.2rem 1.4rem", flex: 1, overflowY: "auto" }}>

          {/* ADD-ONS */}
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1E1410", marginBottom: "0.3rem", marginTop: "0.2rem" }}>Add-Ons</div>
          {SOUP_ADDONS.map(a => (
            <div key={a.key} style={rowStyle} onClick={() => toggle(addons, setAddons, a.key)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={checkStyle(addons[a.key])}>
                  {addons[a.key] && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" fill="none"/></svg>}
                </div>
                <span style={{ fontSize: "0.88rem", color: "#2A1A0E" }}>{a.label}</span>
              </div>
              <span style={{ fontSize: "0.82rem", color: "#6B1A1A", fontWeight: 600 }}>+${a.price.toFixed(2)}</span>
            </div>
          ))}

          {/* SAUCES */}
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1E1410", margin: "1rem 0 0.3rem" }}>Add Sauce</div>
          {SOUP_SAUCES.map(a => (
            <div key={a.key} style={rowStyle} onClick={() => toggle(sauces, setSauces, a.key)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={checkStyle(sauces[a.key])}>
                  {sauces[a.key] && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" fill="none"/></svg>}
                </div>
                <span style={{ fontSize: "0.88rem", color: "#2A1A0E" }}>{a.label}</span>
              </div>
              <span style={{ fontSize: "0.82rem", color: "#6B1A1A", fontWeight: 600 }}>+${a.price.toFixed(2)}</span>
            </div>
          ))}

          {/* NOTE */}
          <div style={{ marginTop: "1.1rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1E1410", marginBottom: "0.4rem" }}>Special Request</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. No onions, less spicy, extra broth…" rows={2}
              style={{ width: "100%", padding: "0.6rem 0.8rem", border: "1px solid rgba(107,26,26,0.18)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#2A1A0E", background: "#FBF6EE", resize: "none", outline: "none", borderRadius: 2, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#6B1A1A"}
              onBlur={e => e.target.style.borderColor = "rgba(107,26,26,0.18)"}
            />
          </div>

          {/* QTY + ADD */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid rgba(107,26,26,0.1)" }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#7A6050", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Quantity</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, border: "1px solid rgba(107,26,26,0.2)", background: "white", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>−</button>
                <span style={{ fontWeight: 700, fontSize: "1rem", minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, border: "1px solid rgba(107,26,26,0.2)", background: "white", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2A1A0E" }}>+</button>
              </div>
            </div>
            <button onClick={handleAdd} style={{ background: "#6B1A1A", color: "white", border: "none", padding: "0.85rem 1.6rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer", borderRadius: 2, transition: "background 0.2s" }}
              onMouseEnter={e => e.target.style.background = "#C4882B"}
              onMouseLeave={e => e.target.style.background = "#6B1A1A"}
            >
              Add to Order — ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuCard({ item, cart, onAdd, onRemove }) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState("");
  const [size, setSize] = useState(item.sizes ? item.sizes[0] : null);
  const [showSoupModal,   setShowSoupModal]   = useState(false);
  const [showAppModal,    setShowAppModal]    = useState(false);
  const [showSubModal,    setShowSubModal]    = useState(false);
  const [showBunModal,    setShowBunModal]    = useState(false);
  const [showNoodleModal, setShowNoodleModal] = useState(false);
  const [showRiceModal,   setShowRiceModal]   = useState(false);

  const isSoup   = !!item.isSoup;
  const isApp    = !!item.isApp;
  const isSub    = !!item.isSub;
  const isBun    = !!item.isBun;
  const isNoodle = !!item.isNoodle;
  const isRice   = !!item.isRice;

  const canAdd = (!item.selectOptions || selected !== "");
  const activePrice = size ? size.price : item.price;
  const sizeTag = size ? `sz:${size.label}` : null;
  const cartKey = [String(item.id), selected || null, sizeTag].filter(Boolean).join("|");
  const qty = cart[cartKey]?.qty || 0;

  const handleAddClick = () => {
    if (!canAdd) return;
    if (isSoup)   { setShowSoupModal(true);   return; }
    if (isApp)    { setShowAppModal(true);     return; }
    if (isSub)    { setShowSubModal(true);     return; }
    if (isBun)    { setShowBunModal(true);     return; }
    if (isNoodle) { setShowNoodleModal(true);  return; }
    if (isRice)   { setShowRiceModal(true);    return; }
    onAdd(item.id, selected, size);
  };

  return (
    <>
    {showSoupModal && <SoupCustomizeModal item={item} size={size} onClose={() => setShowSoupModal(false)} onAddToCart={(id,f,sz,price,key,qty) => { for(let i=0;i<qty;i++) onAdd(id,f,sz,price,key); }} />}
    {showAppModal  && <AppCustomizeModal  item={item} onClose={() => setShowAppModal(false)}  onAddToCart={(id,f,sz,price,key,qty) => { for(let i=0;i<qty;i++) onAdd(id,f,sz,price,key); }} />}
    {showSubModal  && <SubModal    item={item} onClose={() => setShowSubModal(false)}    onAddToCart={(id,f,sz,price,key,qty) => { for(let i=0;i<qty;i++) onAdd(id,f,sz,price,key); }} />}
    {showBunModal  && <BunModal    item={item} onClose={() => setShowBunModal(false)}    onAddToCart={(id,f,sz,price,key,qty) => { for(let i=0;i<qty;i++) onAdd(id,f,sz,price,key); }} />}
    {showNoodleModal && <NoodleModal item={item} onClose={() => setShowNoodleModal(false)} onAddToCart={(id,f,sz,price,key,qty) => { for(let i=0;i<qty;i++) onAdd(id,f,sz,price,key); }} />}
    {showRiceModal && <RiceModal   item={item} onClose={() => setShowRiceModal(false)}   onAddToCart={(id,f,sz,price,key,qty) => { for(let i=0;i<qty;i++) onAdd(id,f,sz,price,key); }} />}
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

      {item.sizes && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
          {item.sizes.map(s => (
            <button key={s.label} onClick={() => setSize(s)} style={{
              padding: "0.3rem 0.85rem", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer", border: "1px solid",
              transition: "all 0.15s",
              background: size?.label === s.label ? "#6B1A1A" : "transparent",
              color: size?.label === s.label ? "white" : "#6B1A1A",
              borderColor: "#6B1A1A",
            }}>
              {s.label} — ${s.price.toFixed(2)}
            </button>
          ))}
        </div>
      )}

      {item.selectOptions && (
        <select value={selected} onChange={e => setSelected(e.target.value)}
          style={{ width: "100%", padding: "0.5rem 0.7rem", border: `1px solid ${selected ? "rgba(107,26,26,0.3)" : "rgba(107,26,26,0.18)"}`, fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: selected ? "#2A1A0E" : "#7A6050", background: "#FBF6EE", outline: "none", cursor: "pointer", borderRadius: 2 }}
        >
          <option value="">— {item.selectLabel} —</option>
          {item.selectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.3rem", paddingTop: "0.7rem", borderTop: "1px solid rgba(107,26,26,0.08)" }}>
        <div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#6B1A1A" }}>${activePrice.toFixed(2)}</span>
          {isSoup   && <span style={{ fontSize: "0.68rem", color: "#7A6050", marginLeft: "0.5rem" }}>+ add-ons available</span>}
          {isApp    && <span style={{ fontSize: "0.68rem", color: "#7A6050", marginLeft: "0.5rem" }}>+ sauces available</span>}
          {isSub    && <span style={{ fontSize: "0.68rem", color: "#7A6050", marginLeft: "0.5rem" }}>+ add-ons available</span>}
          {isBun    && <span style={{ fontSize: "0.68rem", color: "#7A6050", marginLeft: "0.5rem" }}>+ add-ons available</span>}
          {isNoodle && <span style={{ fontSize: "0.68rem", color: "#7A6050", marginLeft: "0.5rem" }}>+ add-ons available</span>}
          {isRice   && <span style={{ fontSize: "0.68rem", color: "#7A6050", marginLeft: "0.5rem" }}>+ add-ons available</span>}
        </div>
        {qty === 0 ? (
          <button onClick={handleAddClick} style={{ background: canAdd ? "#6B1A1A" : "#ccc", color: "white", border: "none", width: 32, height: 32, fontSize: "1.2rem", fontWeight: 700, cursor: canAdd ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            onMouseEnter={e => { if (canAdd) e.target.style.background = "#C4882B"; }}
            onMouseLeave={e => { if (canAdd) e.target.style.background = "#6B1A1A"; }}
            title={!canAdd ? `Please ${item.selectLabel?.toLowerCase()} first` : ""}
          >+</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => onRemove(item.id, selected, size)} style={{ background: "#FBF6EE", border: "1px solid rgba(107,26,26,0.14)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", color: "#2A1A0E" }}>−</button>
            <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center", fontSize: "0.95rem", color: "#6B1A1A" }}>{qty}</span>
            <button onClick={handleAddClick} style={{ background: "#FBF6EE", border: "1px solid rgba(107,26,26,0.14)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", color: "#2A1A0E" }}>+</button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

function SideCart({ cart, onAdd, onRemove, onRemoveFull, onCheckout }) {
  const total = Object.entries(cart).reduce((s, [, v]) => s + (v?.price || 0) * (v?.qty || 0), 0);
  const count = Object.values(cart).reduce((a, v) => a + (v?.qty || 0), 0);
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
            Object.entries(cart).map(([key, v]) => {
              const item = getItem(key);
              const parts = key.split("|").slice(1);
              const flavour = parts.find(p => !p.startsWith("sz:")) || null;
              const sizeLabel = (parts.find(p => p.startsWith("sz:")) || "").replace("sz:", "");
              if (!item) return null;
              const qty = v?.qty || 0;
              const price = v?.price || item.price;
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0", borderBottom: "1px solid rgba(107,26,26,0.07)", fontSize: "0.82rem" }}>
                  <div style={{ flex: 1, fontWeight: 500, lineHeight: 1.3, color: "#2A1A0E" }}>
                    {item.name}
                    {(flavour || sizeLabel) && <div style={{ fontSize: "0.72rem", color: "#C4882B", fontWeight: 400 }}>{[sizeLabel, flavour].filter(Boolean).join(" · ")}</div>}
                  </div>
                  <div style={{ color: "#7A6050", fontSize: "0.75rem" }}>×{qty}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#6B1A1A", whiteSpace: "nowrap", fontSize: "0.9rem" }}>${(price * qty).toFixed(2)}</div>
                  <button onClick={() => onRemoveFull(key)} style={{ background: "none", border: "none", color: "rgba(107,26,26,0.3)", cursor: "pointer", fontSize: "0.9rem", padding: "2px 4px", transition: "color 0.15s" }}
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
  const total = Object.entries(cart).reduce((s, [, v]) => s + (v?.price || 0) * (v?.qty || 0), 0);
  const count = Object.values(cart).reduce((a, v) => a + (v?.qty || 0), 0);
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
              {Object.entries(cart).map(([key, v]) => {
                const item = getItem(key);
                const parts = key.split("|").slice(1);
                const flavour = parts.find(p => !p.startsWith("sz:")) || null;
                const sizeLabel = (parts.find(p => p.startsWith("sz:")) || "").replace("sz:", "");
                if (!item) return null;
                const qty = v?.qty || 0;
                const price = v?.price || item.price;
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0", borderBottom: "1px solid rgba(107,26,26,0.07)", fontSize: "0.82rem" }}>
                    <div style={{ flex: 1, fontWeight: 500, lineHeight: 1.3 }}>
                      {item.name}
                      {(flavour || sizeLabel) && <div style={{ fontSize: "0.72rem", color: "#C4882B", fontWeight: 400 }}>{[sizeLabel, flavour].filter(Boolean).join(" · ")}</div>}
                    </div>
                    <div style={{ color: "#7A6050" }}>×{qty}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#6B1A1A" }}>${(price * qty).toFixed(2)}</div>
                    <button onClick={() => onRemoveFull(key)} style={{ background: "none", border: "none", color: "#7A6050", cursor: "pointer" }}>✕</button>
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
  const [kitchenStatus, setKitchenStatus] = useState(null); 

  const total = Object.entries(cart).reduce((s, [, v]) => s + (v?.price || 0) * (v?.qty || 0), 0);

  const handlePlace = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) { alert("Please fill in your name, phone and email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Please enter a valid email address."); return; }
    setPlacing(true);

    const id = "PHV-" + Date.now().toString(36).toUpperCase().slice(-6);

    
    const order = {
      orderId: id,
      timestamp: new Date().toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" }),
      type: "PICKUP",
      customer: { name: name.trim(), phone: phone.trim(), email: email.trim() },
      specialInstructions: notes.trim() || "None",
      items: Object.entries(cart).map(([key, v]) => {
        const item = getItem(key);
        const parts = key.split("|").slice(1);
        const flavour = parts.find(p => !p.startsWith("sz:")) || null;
        const sizeLabel = (parts.find(p => p.startsWith("sz:")) || "").replace("sz:", "");
        const label = [sizeLabel, flavour].filter(Boolean).join(", ");
        const qty = v?.qty || 0;
        const price = v?.price || item.price;
        return { id: Number(String(key).split("|")[0]), name: item.name + (label ? ` (${label})` : ""), qty, unitPrice: price, subtotal: price * qty };
      }),
      total,
      restaurant: "Pho Huong Viet 17Ave SW",
      restaurantPhone: "(403) 686-3799",
    };

    
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,8,0,0.7)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "white", width: "100%", maxWidth: 520, maxHeight: "94vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,0.4)", borderRadius: "12px 12px 0 0" }}>
        <div style={{ background: "#1E1410", color: "#F5EDD8", padding: "1.4rem 1.6rem", fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 400, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
          Complete Your <em style={{ fontStyle: "italic", color: "#D4A843", marginLeft: 6 }}>Order</em>
          <button onClick={handleClose} style={{ background: "none", border: "none", color: "rgba(245,237,216,0.6)", fontSize: "1.3rem", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#D4A843"}
            onMouseLeave={e => e.target.style.color = "rgba(245,237,216,0.6)"}
          >✕</button>
        </div>
        <div style={{ padding: "clamp(1rem, 4vw, 1.8rem)" }}>
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
                {Object.entries(cart).map(([key, v]) => {
                  const item = getItem(key);
                  const parts = key.split("|").slice(1);
                  const isBT = item?.isBubbleTea;
                  let label = "";
                  if (isBT) {
                    const [flavourPart, toppingPart, extrasPart] = parts;
                    const flavours = (flavourPart || "").replace(/\+/g, " · ");
                    const topping = toppingPart === "pearl" ? "Tapioca Pearl" : toppingPart === "jelly" ? "Jelly" : "No Topping";
                    const extras = (extrasPart || "").split("+").filter(Boolean).map(e => e === "xPearl" ? "Extra Pearl" : "Extra Jelly").join(", ");
                    label = [flavours, topping, extras].filter(Boolean).join(" · ");
                  } else {
                    const flavour = parts.find(p => !p.startsWith("sz:")) || null;
                    const sizeLabel = (parts.find(p => p.startsWith("sz:")) || "").replace("sz:", "");
                    label = [sizeLabel, flavour].filter(Boolean).join(", ");
                  }
                  if (!item) return null;
                  const qty = v?.qty || 0;
                  const price = v?.price || item.price;
                  return (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.3rem 0", color: "#2A1A0E" }}>
                      <span>{item.name}{label ? ` (${label})` : ""} ×{qty}</span>
                      <span>${(price * qty).toFixed(2)}</span>
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
                <label style={labelStyle}>📝 Order Notes <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#C4882B" }}>(allergies, modifications, special requests…)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Extra spicy, no onions, allergy to peanuts…" style={{ ...inputStyle, resize: "vertical", minHeight: 90, borderColor: "rgba(196,136,43,0.35)", background: "rgba(251,246,238,0.7)" }}
                  onFocus={e => e.target.style.borderColor = "#C4882B"}
                  onBlur={e => e.target.style.borderColor = "rgba(196,136,43,0.35)"}
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

  const cartCount = Object.values(cart).reduce((a, v) => a + (v?.qty || 0), 0);

  useEffect(() => {
    const observers = [];
    MENU.forEach(cat => {
      const el = document.getElementById(`sec-${cat.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveTab(cat.id);
      }, { threshold: 0.25 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const addItem = useCallback((id, flavour, size, customPrice, customKey) => {
    const sizeTag = size ? `sz:${size.label}` : null;
    const key = customKey || [String(id), flavour || null, sizeTag].filter(Boolean).join("|");
    const price = customPrice !== undefined ? customPrice : (size ? size.price : (getItem(String(id))?.price || 0));
    setCart(c => ({ ...c, [key]: { qty: ((c[key]?.qty) || 0) + 1, price } }));
  }, []);
  const removeItem = useCallback((id, flavour, size) => {
    const sizeTag = size ? `sz:${size.label}` : null;
    const key = [String(id), flavour || null, sizeTag].filter(Boolean).join("|");
    setCart(c => {
      const n = { ...c };
      if (!n[key]) return n;
      if (n[key].qty > 1) n[key] = { ...n[key], qty: n[key].qty - 1 };
      else delete n[key];
      return n;
    });
  }, []);
  const removeItemFull = useCallback((key) => {
    setCart(c => { const n = { ...c }; delete n[key]; return n; });
  }, []);
  const clearCart = () => setCart({});

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <OrderNav
        onBack={onBack}
        cartCount={cartCount}
        onCartOpen={() => setMobileCartOpen(true)}
      />
      <OrderHero />
      <div className="order-layout">
        <div style={{ minWidth: 0 }}>
          
          {/* Mobile: dropdown — Desktop: tab pills — STICKY */}
          <div style={{
            position: "sticky", top: 58, zIndex: 90,
            background: "#FBF6EE", marginBottom: "1.8rem",
            padding: "0.75rem 0",
            borderBottom: "1px solid rgba(107,26,26,0.1)",
            marginLeft: "calc(-1 * clamp(1rem, 4vw, 2.5rem))",
            marginRight: "calc(-1 * clamp(1rem, 4vw, 2.5rem))",
            paddingLeft: "clamp(1rem, 4vw, 2.5rem)",
            paddingRight: "clamp(1rem, 4vw, 2.5rem)",
            boxShadow: "0 4px 16px rgba(107,26,26,0.06)",
          }}>
            <select
              className="order-cat-dropdown"
              value={activeTab}
              onChange={e => {
                setActiveTab(e.target.value);
                const el = document.getElementById(`sec-${e.target.value}`);
                if (el) {
                  const offset = el.getBoundingClientRect().top + window.scrollY - 120;
                  window.scrollTo({ top: offset, behavior: "smooth" });
                }
              }}
              style={{
                display: "none", width: "100%", padding: "0.75rem 1rem",
                border: "1px solid rgba(107,26,26,0.25)", borderRadius: 4,
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
                color: "#2A1A0E", background: "white", cursor: "pointer",
                appearance: "auto", marginBottom: 0,
              }}
            >
              {MENU.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
            </select>
            <div className="order-cat-tabs" style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {MENU.map(cat => (
                <button key={cat.id} onClick={() => {
                  setActiveTab(cat.id);
                  const el = document.getElementById(`sec-${cat.id}`);
                  if (el) {
                    const offset = el.getBoundingClientRect().top + window.scrollY - 120;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                  }
                }} style={{
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
          </div>
          
          {MENU.map(cat => (
            <div key={cat.id} id={`sec-${cat.id}`} style={{ marginBottom: "3rem" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1410", paddingBottom: "0.8rem", marginBottom: "0.2rem", borderBottom: "2px solid rgba(107,26,26,0.14)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span>{cat.category.split(" ")[0]}</span>
                {cat.category.replace(/^[^\s]+\s/, "")}
              </div>
              <div className="order-menu-grid">
                {cat.items.map(item => item.isBubbleTea ? (
                  <BubbleTeaCard key={item.id} item={item} cart={cart} onAdd={addItem} onRemove={removeItem} onRemoveFull={removeItemFull} />
                ) : (
                  <MenuCard key={item.id} item={item} cart={cart} onAdd={addItem} onRemove={removeItem} />
                ))}
              </div>
            </div>
          ))}
        </div>
        
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
      {/* Mobile sticky cart bar — shows when cart has items and drawer is closed */}
      {cartCount > 0 && !mobileCartOpen && (
        <div
          className="mobile-cart-bar"
          onClick={() => setMobileCartOpen(true)}
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 199,
            background: "#6B1A1A", color: "white",
            padding: "0 1rem", height: 64,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", boxShadow: "0 -4px 24px rgba(107,26,26,0.35)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Left: item count badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <div style={{
              background: "#C4882B", color: "white", borderRadius: "50%",
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.82rem", fontWeight: 700, flexShrink: 0,
            }}>{cartCount}</div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.05em", lineHeight: 1.2 }}>
                {cartCount === 1 ? "1 item" : `${cartCount} items`} in your order
              </div>
              {/* Show last added item name */}
              {(() => {
                const entries = Object.entries(cart);
                if (!entries.length) return null;
                const [lastKey] = entries[entries.length - 1];
                const lastItem = getItem(lastKey);
                const parts = lastKey.split("|").slice(1);
                const sizeLabel = (parts.find(p => p.startsWith("sz:")) || "").replace("sz:", "");
                if (!lastItem) return null;
                return (
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", marginTop: 1, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lastItem.name}{sizeLabel ? ` · ${sizeLabel}` : ""}
                  </div>
                );
              })()}
            </div>
          </div>
          {/* Right: total + arrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700 }}>
              ${Object.entries(cart).reduce((s, [, v]) => s + (v?.price || 0) * (v?.qty || 0), 0).toFixed(2)}
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      )}
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} onSuccess={clearCart} />
    </div>
  );
}

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

  return page === "home"
    ? <HomePage onOrderClick={goOrder} />
    : <OrderPage onBack={goHome} />;
}