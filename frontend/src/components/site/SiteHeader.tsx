import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

const navLinks = [
  { label: "AI Analysis", to: "/ai-analysis" },
  { label: "The Planner", to: "/planner" },
  { label: "Explore", to: "/explore" },
  { label: "Salons", to: "/salons" },
  { label: "Artists", to: "/discover" },
  { label: "Packages", to: "/packages" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / body scroll lock
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-ivory/95 backdrop-blur-md border-b border-plum/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif italic text-2xl tracking-tight text-plum"
            onClick={() => setMenuOpen(false)}
          >
            ShaadiGlow <span className="text-rosegold">AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 eyebrow text-plum/80">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-rosegold transition-colors"
                activeProps={{ className: "text-rosegold" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side: Dashboard + Burger */}
          <div className="flex items-center gap-3">
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="px-5 py-2.5 bg-plum text-ivory text-xs font-semibold rounded-full hover:bg-plum-light hover:shadow-luxe transition-all"
            >
              {user ? "Dashboard" : "Login"}
            </Link>

            {/* Burger button — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-full hover:bg-plum/5 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-[1.5px] bg-plum rounded-full transition-all duration-300 ${
                  menuOpen ? "w-5 rotate-45 translate-y-[6.5px]" : "w-5"
                }`}
              />
              <span
                className={`block h-[1.5px] bg-plum rounded-full transition-all duration-300 ${
                  menuOpen ? "w-0 opacity-0" : "w-4"
                }`}
              />
              <span
                className={`block h-[1.5px] bg-plum rounded-full transition-all duration-300 ${
                  menuOpen ? "w-5 -rotate-45 -translate-y-[6.5px]" : "w-5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-ivory/95 backdrop-blur-md border-t border-plum/5 px-6 pt-4 pb-8 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="eyebrow text-plum/70 hover:text-rosegold py-3 border-b border-plum/5 last:border-0 transition-colors"
                activeProps={{ className: "eyebrow text-rosegold py-3 border-b border-plum/5 last:border-0" }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Backdrop overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-plum/10 backdrop-blur-[2px] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
