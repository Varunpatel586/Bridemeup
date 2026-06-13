import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MasonryGallery, Item } from "@/components/site/MasonryGallery";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

function ExplorePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('stylists')
        .select(`
          id,
          name,
          portfolio_images,
          salons ( id, name )
        `);
      
      if (data && !error) {
        const generatedItems: Item[] = [];
        data.forEach((stylist: any) => {
          if (stylist.portfolio_images && Array.isArray(stylist.portfolio_images)) {
            stylist.portfolio_images.forEach((img: string, i: number) => {
              // Alternate aspect ratios to make masonry look dynamic
              const aspects = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[2/3]"];
              const aspect = aspects[i % aspects.length];
              generatedItems.push({
                type: "image",
                src: img,
                tag: stylist.name,
                alt: `Work by ${stylist.name}`,
                aspect,
                artistId: stylist.id,
                salonId: stylist.salons?.id
              });
            });
          }
        });
        
        // Randomize the items slightly for a Pinterest feel
        generatedItems.sort(() => Math.random() - 0.5);
        
        // Insert some promos and quotes periodically if we have enough images
        if (generatedItems.length > 3) {
            generatedItems.splice(2, 0, { type: "promo" });
            if (generatedItems.length > 6) {
              generatedItems.splice(6, 0, { type: "quote" });
            }
        }
        
        setItems(generatedItems);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-plum font-sans">
      <SiteHeader />
      <main className="pt-20">
        {loading ? (
          <div className="py-32 text-center text-plum/50">Loading aesthetics...</div>
        ) : (
          <MasonryGallery dynamicItems={items.length > 0 ? items : undefined} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
