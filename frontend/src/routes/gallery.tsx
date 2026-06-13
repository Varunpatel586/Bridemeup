import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MasonryGallery } from "@/components/site/MasonryGallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Bridal Inspiration Gallery — ShaadiGlow AI" },
      { name: "description", content: "Curated bridal looks: bridal, mehendi, sangeet, haldi, reception and more." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-ivory text-plum">
      <SiteHeader />
      <MasonryGallery />
      <div className="text-center pb-20">
        <Link to="/" className="eyebrow text-plum hover:text-rosegold border-b border-plum/20 pb-1">← Back home</Link>
      </div>
      <SiteFooter />
    </div>
  ),
});
