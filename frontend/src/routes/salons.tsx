import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useEffect, useState } from "react";
import { Star, MapPin } from "lucide-react";

const MOCK_SALONS = [
    {
        id: "salon-1",
        name: "Lumière Artistry",
        address: "South Extension II, New Delhi",
        rating: 4.9,
        reviews_count: 342,
        images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000"],
    },
    {
        id: "salon-2",
        name: "The Velvet Room",
        address: "Vasant Vihar, New Delhi",
        rating: 4.8,
        reviews_count: 215,
        images: ["https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=1000"],
    }
];

export const Route = createFileRoute("/salons")({
  component: SalonsDirectory,
});

function SalonsDirectory() {
  const [salons, setSalons] = useState(MOCK_SALONS);

  useEffect(() => {
      // In real app, fetch /api/salons
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <SiteHeader />
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
            <p className="text-sm font-medium text-[#C5A880] tracking-widest uppercase mb-2">The Directory</p>
            <h1 className="text-4xl md:text-5xl font-light mb-4">Luxury Bridal Salons</h1>
            <p className="text-[#1A1A1A]/60 max-w-2xl">
              Discover Delhi's most prestigious salons and freelance artists, curated for your perfect day.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {salons.map((salon) => (
                <Link 
                    key={salon.id} 
                    to={`/salons/$id`} 
                    params={{ id: salon.id }}
                    className="group block bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                    <div className="aspect-[4/3] overflow-hidden relative">
                        <img 
                            src={salon.images[0]} 
                            alt={salon.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                            <Star className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                            {salon.rating} <span className="text-[#1A1A1A]/50">({salon.reviews_count})</span>
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
            ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
