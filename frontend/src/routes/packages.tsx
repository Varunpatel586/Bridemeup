import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PackagesSection } from "@/components/site/PackagesSection";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Beauty Packages — ShaadiGlow AI" },
      {
        name: "description",
        content: "Curated bridal beauty packages for every chapter of your celebration.",
      },
    ],
  }),
  component: () => (
    <div className="min-h-[100dvh] bg-ivory text-plum flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex flex-col">
        <PackagesSection />
        <div className="text-center pb-8">
          <Link to="/" className="eyebrow text-plum hover:text-rosegold border-b border-plum/20 pb-1">
            ← Back home
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  ),
});
