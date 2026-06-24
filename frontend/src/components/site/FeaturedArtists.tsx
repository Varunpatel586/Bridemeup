import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Search, SlidersHorizontal, Filter } from "lucide-react";

export function FeaturedArtists() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("match_desc");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");

  const specialties = useMemo(() => {
    const specs = new Set(artists.map(a => a.specialty.split(" Specialist")[0]));
    return ["All", ...Array.from(specs)];
  }, [artists]);

  const filteredAndSortedArtists = useMemo(() => {
    let result = [...artists];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.specialty.toLowerCase().includes(q)
      );
    }

    if (specialtyFilter !== "All") {
      result = result.filter(a => a.specialty.startsWith(specialtyFilter));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "match_desc":
          return b.match - a.match;
        case "rating_desc":
          return b.rating - a.rating;
        case "price_asc":
          return parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, ""));
        case "price_desc":
          return parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, ""));
        default:
          return 0;
      }
    });

    return result;
  }, [artists, searchQuery, sortBy, specialtyFilter]);

  useEffect(() => {
    async function loadArtists() {
      const { data, error } = await supabase
        .from("stylists")
        .select("*, salons(name, address, rating, reviews_count)");

      if (data && !error) {
        const formattedArtists = data.map((stylist: any) => {
          // Extract the first domain rating key as specialty, or default to Bridal Specialist
          const domains = stylist.domain_ratings ? Object.keys(stylist.domain_ratings) : [];
          const topDomain = domains.length > 0 ? domains[0] : "Bridal";

          return {
            id: stylist.id,
            name: stylist.name,
            specialty: `${topDomain} Specialist · ${stylist.salons?.name || "Premium Salon"}`,
            location: stylist.salons?.address?.split(",")[0] || "Delhi", // Just take the first part of address
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
    <section
      className="px-6 bg-pearl/60 pt-4 pb-16"
      id="artists"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
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

        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/50 p-4 rounded-xl border border-plum/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/50" />
            <input
              type="text"
              placeholder="Search by name, location, or specialty..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-plum/10 rounded-lg focus:ring-2 focus:ring-rosegold/30 outline-none transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-plum/50" />
            <select
              className="bg-white border border-plum/10 py-2 px-4 rounded-lg focus:ring-2 focus:ring-rosegold/30 outline-none text-sm cursor-pointer"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              {specialties.map(spec => (
                <option key={spec as string} value={spec as string}>{spec === "All" ? "All Specialties" : spec as string}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-plum/50" />
            <select
              className="bg-white border border-plum/10 py-2 px-4 rounded-lg focus:ring-2 focus:ring-rosegold/30 outline-none text-sm cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="match_desc">Best Match</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-plum/50">Loading curated artists...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredAndSortedArtists.length > 0 ? (
              filteredAndSortedArtists.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: [0.19, 1, 0.22, 1] }}
                className="group bg-white rounded-2xl overflow-hidden border border-plum/5 hover:shadow-luxe transition-all flex flex-col"
              >
                <Link
                  to="/stylists/$id"
                  params={{ id: a.id }}
                  className="block relative aspect-[4/5] overflow-hidden"
                >
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
                          <h3 className="font-serif italic text-lg text-plum hover:text-rosegold transition-colors">
                            {a.name}
                          </h3>
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
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-plum/50">
                No artists found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
