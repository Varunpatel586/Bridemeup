import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function FeaturedArtists() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtists() {
      const { data, error } = await supabase
        .from('stylists')
        .select('*, salons(name, address, rating, reviews_count)');
      
      if (data && !error) {
        const formattedArtists = data.map((stylist: any) => {
          // Extract the first domain rating key as specialty, or default to Bridal Specialist
          const domains = stylist.domain_ratings ? Object.keys(stylist.domain_ratings) : [];
          const topDomain = domains.length > 0 ? domains[0] : "Bridal";
          
          return {
            id: stylist.id,
            name: stylist.name,
            specialty: `${topDomain} Specialist · ${stylist.salons?.name || "Premium Salon"}`,
            location: stylist.salons?.address?.split(',')[0] || "Delhi", // Just take the first part of address
            rating: stylist.salons?.rating || 4.9,
            reviews: stylist.salons?.reviews_count || 120,
            price: "₹" + (Math.floor(Math.random() * 50) + 20) + "k", // Mocking price since it's in packages
            match: Math.floor(Math.random() * 10) + 90, // Mock AI match score 90-99
            img: stylist.profile_image || "/images/artist-1.jpg",
          };
        });
        setArtists(formattedArtists);
      }
      setLoading(false);
    }
    loadArtists();
  }, []);

  return (
    <section className="py-24 px-6 bg-pearl/60" id="artists">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="eyebrow text-rosegold mb-3">The Masters</p>
            <h2 className="text-4xl md:text-5xl font-serif italic text-plum mb-3">
              Vetted artistry, matched to you.
            </h2>
            <p className="text-plum/60 max-w-lg">
              Every artist is hand-selected and AI-matched to your skin tone, face shape, and
              wedding theme.
            </p>
          </div>
          <Link
            to="/discover"
            className="self-start md:self-end eyebrow text-plum hover:text-rosegold transition-colors border-b border-plum/20 hover:border-rosegold pb-1"
          >
            View All {artists.length > 0 ? artists.length : "..."} Artists →
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-plum/50">Loading curated artists...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {artists.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: [0.19, 1, 0.22, 1] }}
                className="group bg-white rounded-2xl overflow-hidden border border-plum/5 hover:shadow-luxe transition-all flex flex-col"
              >
                <Link to="/stylists/$id" params={{ id: a.id }} className="block relative aspect-[4/5] overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-ivory/90 backdrop-blur-sm rounded-full eyebrow text-rosegold">
                    AI Match {a.match}%
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-plum/90 backdrop-blur text-ivory rounded-full text-xs font-mono">
                    {a.price}/event
                  </div>
                </Link>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to="/stylists/$id" params={{ id: a.id }}>
                          <h3 className="font-serif italic text-lg text-plum hover:text-rosegold transition-colors">{a.name}</h3>
                        </Link>
                        <p className="text-[10px] text-plum/50 mt-1 line-clamp-1">{a.specialty}</p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs font-semibold text-plum">★ {a.rating}</p>
                        <p className="text-[9px] text-plum/40">{a.reviews} reviews</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-plum/50 mb-4">📍 {a.location}</p>
                  </div>
                  <Link
                    to="/stylists/$id"
                    params={{ id: a.id }}
                    className="block text-center w-full py-2 border border-plum/15 rounded-full text-[10px] uppercase tracking-widest font-bold text-plum hover:bg-plum hover:text-ivory transition-all"
                  >
                    View Portfolio
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
