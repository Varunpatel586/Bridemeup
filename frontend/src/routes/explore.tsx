import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MasonryGallery } from "@/components/site/MasonryGallery";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <div className="min-h-screen bg-ivory text-plum font-sans">
      <SiteHeader />
      <main className="pt-20">
        <MasonryGallery />
      </main>
      <SiteFooter />
    </div>
  );
}
