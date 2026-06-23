import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useEffect, useState } from "react";
import { Star, MapPin } from "lucide-react";
import * as HoverCard from "@radix-ui/react-hover-card";

const MOCK_SALONS = [
  {
    id: "salon-1",
    name: "Lumière Artistry",
    address: "South Extension II, New Delhi",
    rating: 4.9,
    reviews_count: 342,
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000",
    ],
  },
  {
    id: "salon-2",
    name: "The Velvet Room",
    address: "Vasant Vihar, New Delhi",
    rating: 4.8,
    reviews_count: 215,
    images: [
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=1000",
    ],
  },
];

export const Route = createFileRoute("/salons/")({
  component: SalonsDirectory,
});

function SalonsDirectory() {
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) => {
      supabase
        .from("salons")
        .select("*")
        .then(({ data, error }) => {
          if (error) {
            console.error("Failed to fetch salons", error);
          } else {
            setSalons(data || []);
          }
          setLoading(false);
        });
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#C5A880] tracking-widest uppercase text-sm animate-pulse">
          Loading Directory...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <SiteHeader />
      <main className="flex-1 pt-20 pb-8 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#C5A880] tracking-widest uppercase mb-2">
            The Directory
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">Luxury Bridal Salons</h1>
          <p className="text-[#1A1A1A]/60 max-w-2xl">
            Discover Delhi's most prestigious salons and freelance artists, curated for your perfect
            day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salons.map((salon) => (
            <HoverCard.Root key={salon.id} openDelay={200} closeDelay={100}>
              <HoverCard.Trigger asChild>
                <Link
                  to={`/salons/$id`}
                  params={{ id: salon.id }}
                  className="group block bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden relative bg-neutral-100">
                    <img
                      src={
                        salon.images?.[0] ||
                        salon.image_url ||
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000"
                      }
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                      <Star className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                      {salon.rating}{" "}
                      <span className="text-[#1A1A1A]/50">({salon.reviews_count})</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-medium mb-2">{salon.name}</h2>
                    <div className="flex items-center gap-2 text-[#1A1A1A]/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      {salon.address}
                    </div>
                  </div>
                </Link>
              </HoverCard.Trigger>
              <HoverCard.Content
                side="right"
                sideOffset={15}
                align="start"
                className="z-50 w-72 bg-white rounded-xl shadow-2xl p-5 border border-plum/10 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif italic text-xl text-plum">{salon.name}</h3>
                  <p className="text-sm text-plum/70">{salon.address}</p>
                  <div className="h-px bg-plum/5 my-2" />
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                    <span className="font-medium text-sm text-plum">{salon.rating}</span>
                    <span className="text-sm text-plum/50">({salon.reviews_count} reviews)</span>
                  </div>
                  <p className="text-xs text-plum/60 mt-2">
                    Top rated artists: Ananya Verma, Rohit Singh
                  </p>
                  <p className="text-xs font-semibold text-rosegold mt-1">
                    Specialties: Bridal Makeup, Mehendi, Hairstyle
                  </p>
                  <p className="text-[10px] text-plum/40 mt-3 text-center uppercase tracking-widest">
                    Click to view artists & book
                  </p>
                </div>
              </HoverCard.Content>
            </HoverCard.Root>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
