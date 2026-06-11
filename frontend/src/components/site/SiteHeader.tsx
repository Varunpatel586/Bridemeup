import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "The Planner", to: "/planner" },
  { label: "Gallery", to: "/gallery" },
  { label: "Artists", to: "/discover" },
  { label: "Packages", to: "/packages" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-ivory/85 backdrop-blur-md border-b border-plum/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif italic text-2xl tracking-tight text-plum">
          ShaadiGlow <span className="text-rosegold">AI</span>
        </Link>
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
        <Link
          to="/auth"
          className="px-5 py-2.5 bg-plum text-ivory text-xs font-semibold rounded-full hover:bg-plum-light hover:shadow-luxe transition-all"
        >
          Book Concierge
        </Link>
      </div>
    </nav>
  );
}
