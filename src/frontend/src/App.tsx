import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowRight,
  CheckCircle2,
  Facebook,
  Instagram,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiPinterest } from "react-icons/si";
import { toast } from "sonner";
import type { Product } from "./backend.d";
import { useGetAllProducts, useSubscribeNewsletter } from "./hooks/useQueries";

const CATEGORIES = ["All", "Men's", "Women's", "Essentials", "New Arrivals"];

const PRODUCT_GRADIENTS = [
  "linear-gradient(135deg, #c9b99a 0%, #a8956e 100%)",
  "linear-gradient(135deg, #b5c4b1 0%, #8fa88a 100%)",
  "linear-gradient(135deg, #d4b8b0 0%, #b8907e 100%)",
  "linear-gradient(135deg, #a0adc0 0%, #6d839e 100%)",
  "linear-gradient(135deg, #d8cfc4 0%, #b9ac9a 100%)",
  "linear-gradient(135deg, #c4b8d0 0%, #9987ae 100%)",
  "linear-gradient(135deg, #e0d0b0 0%, #c4a86c 100%)",
  "linear-gradient(135deg, #b8c4bc 0%, #7a9882 100%)",
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

function formatPrice(price: bigint) {
  return `$${(Number(price) / 100).toFixed(2)}`;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group"
      data-ocid={`product.item.${index + 1}`}
    >
      <div
        className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-3"
        style={{
          background: PRODUCT_GRADIENTS[index % PRODUCT_GRADIENTS.length],
        }}
      />
      <div>
        <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-1">
          {formatPrice(product.price)}
        </p>
        <button
          type="button"
          className="text-xs font-semibold tracking-widest uppercase text-foreground border-b border-foreground pb-0.5 hover:text-accent transition-colors"
          data-ocid={`product.link.${index + 1}`}
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div>
      <Skeleton className="w-full aspect-[3/4] rounded-lg mb-3" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/3 mb-2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const { data: products, isLoading } = useGetAllProducts();
  const subscribeMutation = useSubscribeNewsletter();

  const filteredProducts = products
    ? activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory)
    : [];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await subscribeMutation.mutateAsync(newsletterEmail);
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      toast.success("You're subscribed! Welcome to STYLECO.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* HEADER */}
      <header
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
        data-ocid="nav.panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="/"
              className="font-display font-bold text-2xl tracking-[0.15em] uppercase text-foreground"
              data-ocid="nav.link"
            >
              STYLECO
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {["Collections", "New Arrivals", "Sale", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="nav.link"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-foreground hover:text-accent transition-colors hidden sm:block"
                aria-label="Search"
                data-ocid="nav.search_input"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                className="text-foreground hover:text-accent transition-colors hidden sm:block"
                aria-label="Account"
                data-ocid="nav.button"
              >
                <User size={18} />
              </button>
              <button
                type="button"
                className="text-foreground hover:text-accent transition-colors"
                aria-label="Cart"
                data-ocid="nav.cart_button"
              >
                <ShoppingBag size={18} />
              </button>
              <button
                type="button"
                className="md:hidden text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                data-ocid="nav.toggle"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background"
            >
              <nav className="flex flex-col px-4 py-4 gap-4">
                {["Collections", "New Arrivals", "Sale", "About"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-sm font-semibold tracking-widest uppercase text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ),
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* HERO */}
        <section
          className="relative overflow-hidden"
          style={{ minHeight: "clamp(480px, 72vh, 720px)" }}
        >
          <img
            src="/assets/generated/hero-fashion.dim_1400x700.jpg"
            alt="STYLECO Summer Collection"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center"
            style={{ minHeight: "clamp(480px, 72vh, 720px)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p
                className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
                style={{ color: "#C6A874" }}
              >
                Summer &rsquo;26
              </p>
              <h1
                className="font-display font-bold text-white uppercase leading-none mb-6"
                style={{ fontSize: "clamp(48px, 7vw, 80px)" }}
              >
                Wear the
                <br />
                Season
              </h1>
              <p className="text-white/80 text-base mb-8 max-w-sm leading-relaxed">
                Discover effortless style built for the modern world —
                sustainable materials, timeless silhouettes.
              </p>
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 font-bold tracking-widest uppercase text-xs px-8 py-6 rounded-none"
                data-ocid="hero.primary_button"
              >
                Shop the Collection
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* FEATURED COLLECTIONS */}
        <section
          id="collections"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Featured Collections
            </h2>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              Curated for every lifestyle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Men's Collection",
                subtitle: "Eco-Wear & Essentials",
                img: "/assets/generated/collection-mens.dim_600x700.jpg",
                id: "mens",
              },
              {
                title: "Women's Collection",
                subtitle: "Resort & Ready-to-Wear",
                img: "/assets/generated/collection-womens.dim_600x700.jpg",
                id: "womens",
              },
              {
                title: "Essentials",
                subtitle: "Wardrobe Foundations",
                img: "/assets/generated/collection-essentials.dim_600x700.jpg",
                id: "essentials",
              },
            ].map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                style={{ aspectRatio: "6/7" }}
                data-ocid={`collections.card.${i + 1}`}
              >
                <img
                  src={col.img}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/70 text-xs tracking-widest uppercase mb-1">
                    {col.subtitle}
                  </p>
                  <h3 className="font-display font-bold text-white text-2xl uppercase leading-tight">
                    {col.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LATEST ARRIVALS */}
        <section
          id="new-arrivals"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Latest Arrivals
            </h2>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              New pieces, dropped weekly
            </p>
          </motion.div>

          <div
            className="flex flex-wrap justify-center gap-2 mb-10"
            data-ocid="products.tab"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded-full border transition-all ${
                  activeCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
                data-ocid="products.filter.tab"
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7"
              data-ocid="products.loading_state"
            >
              {SKELETON_KEYS.map((k) => (
                <ProductSkeleton key={k} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="products.empty_state"
            >
              <p className="text-sm tracking-widest uppercase">
                No products in this category yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>

        {/* ABOUT */}
        <section id="about" className="py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4 text-accent">
                  Our Story
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6 leading-snug">
                  Fashion That Respects the Planet
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Founded in 2018, STYLECO was born from a simple belief: you
                  shouldn't have to choose between looking great and living
                  responsibly. We craft each piece from sustainably sourced
                  materials — organic cotton, recycled linen, and low-impact
                  dyes.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Our designs are timeless, not trendy. Pieces that outlast
                  seasons, that wear in beautifully, and that tell a story of
                  intentional living.
                </p>
                <Button
                  variant="outline"
                  className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase text-xs px-8 py-5"
                  data-ocid="about.secondary_button"
                >
                  Our Mission
                  <ArrowRight size={13} className="ml-2" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { label: "Products", value: "200+" },
                  { label: "Countries", value: "38" },
                  { label: "Carbon Neutral", value: "Since '22" },
                  { label: "Organic Materials", value: "100%" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-secondary rounded-xl p-6">
                    <p className="font-display font-bold text-3xl text-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ background: "oklch(var(--footer-bg))" }}
          data-ocid="newsletter.panel"
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
                style={{ color: "#C6A874" }}
              >
                Stay Connected
              </p>
              <h2
                className="font-display font-bold text-3xl md:text-4xl mb-4"
                style={{ color: "oklch(0.95 0.005 88)" }}
              >
                Get Early Access
              </h2>
              <p
                className="mb-10 text-sm leading-relaxed"
                style={{ color: "oklch(0.65 0.006 90)" }}
              >
                Join our community for exclusive previews, seasonal lookbooks,
                and member-only offers.
              </p>

              <AnimatePresence mode="wait">
                {newsletterSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3"
                    data-ocid="newsletter.success_state"
                  >
                    <CheckCircle2 size={40} style={{ color: "#C6A874" }} />
                    <p
                      className="font-semibold text-lg"
                      style={{ color: "oklch(0.95 0.005 88)" }}
                    >
                      You're in! Welcome to STYLECO.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  >
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="flex-1 rounded-none border-0 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-accent"
                      data-ocid="newsletter.input"
                    />
                    <Button
                      type="submit"
                      disabled={subscribeMutation.isPending}
                      className="rounded-none font-bold tracking-widest uppercase text-xs px-6 bg-white text-foreground hover:bg-white/90"
                      data-ocid="newsletter.submit_button"
                    >
                      {subscribeMutation.isPending
                        ? "Subscribing..."
                        : "Subscribe"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="py-14 px-4 sm:px-6 lg:px-8 border-t"
        style={{
          background: "oklch(var(--footer-bg))",
          borderTopColor: "oklch(0.32 0.005 88)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <p
                className="font-display font-bold text-2xl tracking-[0.15em] uppercase mb-3"
                style={{ color: "oklch(0.95 0.005 88)" }}
              >
                STYLECO
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.55 0.006 90)" }}
              >
                Sustainable fashion for the conscious generation.
              </p>
            </div>

            <div>
              <p
                className="text-xs font-bold tracking-[0.18em] uppercase mb-4"
                style={{ color: "oklch(0.65 0.008 88)" }}
              >
                Shop
              </p>
              <ul className="space-y-2">
                {["Men's", "Women's", "Essentials", "New Arrivals", "Sale"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="/"
                        className="text-sm hover:opacity-80 transition-opacity"
                        style={{ color: "oklch(0.65 0.006 90)" }}
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <p
                className="text-xs font-bold tracking-[0.18em] uppercase mb-4"
                style={{ color: "oklch(0.65 0.008 88)" }}
              >
                Company
              </p>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Sustainability",
                  "Careers",
                  "Press",
                  "Contact",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="/"
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: "oklch(0.65 0.006 90)" }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="text-xs font-bold tracking-[0.18em] uppercase mb-4"
                style={{ color: "oklch(0.65 0.008 88)" }}
              >
                Follow Us
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: "oklch(0.65 0.006 90)" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: "oklch(0.65 0.006 90)" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://pinterest.com"
                  aria-label="Pinterest"
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: "oklch(0.65 0.006 90)" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiPinterest size={20} />
                </a>
              </div>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
            style={{
              borderTop: "1px solid oklch(0.32 0.005 88)",
              color: "oklch(0.45 0.005 90)",
            }}
          >
            <p>
              &copy; {new Date().getFullYear()} STYLECO. All rights reserved.
            </p>
            <p>
              Built with <span style={{ color: "#C6A874" }}>&#9825;</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
