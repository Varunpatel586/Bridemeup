import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AIPlannerShowcase } from "@/components/site/AIPlannerShowcase";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Bridal Planner — ShaadiGlow AI" },
      { name: "description", content: "Your personalized 90/60/30/7-day bridal beauty timeline." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-ivory text-plum">
      <SiteHeader />
      <AIPlannerShowcase />
      <div className="text-center pb-20">
        <Link to="/" className="eyebrow text-plum hover:text-rosegold border-b border-plum/20 pb-1">← Back home</Link>
      </div>
      <SiteFooter />
    </div>
  ),
});
