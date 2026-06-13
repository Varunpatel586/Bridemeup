import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PackagesSection } from "@/components/site/PackagesSection";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Beauty Packages — ShaadiGlow AI" },
      { name: "description", content: "Curated bridal beauty packages for every chapter of your celebration." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-ivory text-plum">
      <SiteHeader />
      <PackagesSection />
      <div className="text-center pb-20">
        <Link to="/" className="eyebrow text-plum hover:text-rosegold border-b border-plum/20 pb-1">← Back home</Link>
      </div>
      <SiteFooter />
    </div>
  ),
});
