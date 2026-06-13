import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const categories = [
  "All Moods",
  "Bridal",
  "Engagement",
  "Reception",
  "Cocktail",
  "Mehendi",
  "Haldi",
  "Sangeet",
  "Minimal",
  "Royal",
  "Modern",
];

export type Item =
  | { type: "image"; src: string; tag: string; alt: string; aspect: string; artistId?: string; salonId?: string }
  | { type: "promo" }
  | { type: "artist"; src: string; name: string; specialty: string; match: number; rating: number; reviews: number }
  | { type: "quote" };

const baseItems: Item[] = [
  { type: "image", src: "/images/gallery-embroidery.jpg", tag: "Couture Detail", alt: "Gold zardozi embroidery", aspect: "aspect-[2/3]", artistId: "artist-1" },
  { type: "promo" },
  { type: "image", src: "/images/gallery-makeup.jpg", tag: "The Look", alt: "Modern minimalist bridal makeup", aspect: "aspect-square", salonId: "salon-1" },
  { type: "image", src: "/images/gallery-mandap.jpg", tag: "Decor Muse", alt: "Floral mandap with roses and jasmine", aspect: "aspect-[3/4]", salonId: "salon-2" },
  {
    type: "artist",
    src: "/images/artist-1.jpg",
    name: "Ananya Verma",
    specialty: "Bridal Specialist",
    match: 98,
    rating: 4.9,
    reviews: 120,
  },
  { type: "image", src: "/images/gallery-mehendi.jpg", tag: "Mehendi", alt: "Bridal mehendi henna design", aspect: "aspect-[3/4]", artistId: "artist-2" },
  { type: "image", src: "/images/hero-bride.jpg", tag: "Portrait", alt: "Editorial bride portrait", aspect: "aspect-[4/5]", artistId: "artist-1" },
  { type: "quote" },
  { type: "image", src: "/images/gallery-reception.jpg", tag: "Reception", alt: "Soft blush bridal reception fabric", aspect: "aspect-[2/3]", salonId: "salon-1" },
  { type: "image", src: "/images/gallery-haldi.jpg", tag: "Haldi", alt: "Bride in haldi ceremony", aspect: "aspect-[3/4]", artistId: "artist-2" },
  { type: "image", src: "/images/gallery-couple.jpg", tag: "Vows", alt: "Couple at Delhi wedding", aspect: "aspect-[4/3]", salonId: "salon-2" },
];

const defaultItems: Item[] = [
  ...baseItems,
  { type: "image", src: "/images/gallery-makeup.jpg", tag: "Glamour", alt: "Evening makeup", aspect: "aspect-[4/5]", artistId: "artist-1" },
  { type: "image", src: "/images/hero-bride.jpg", tag: "Details", alt: "Jewelry details", aspect: "aspect-square", salonId: "salon-1" },
  { type: "image", src: "/images/gallery-embroidery.jpg", tag: "Traditional", alt: "Red lehenga", aspect: "aspect-[3/4]", artistId: "artist-2" },
  { type: "image", src: "/images/gallery-mandap.jpg", tag: "Setup", alt: "Outdoor setup", aspect: "aspect-[4/3]", salonId: "salon-2" },
  { type: "image", src: "/images/gallery-mehendi.jpg", tag: "Art", alt: "Hand art", aspect: "aspect-[2/3]", artistId: "artist-1" },
  { type: "image", src: "/images/gallery-couple.jpg", tag: "Moments", alt: "Candid moments", aspect: "aspect-[3/4]", salonId: "salon-1" },
  { type: "image", src: "/images/gallery-haldi.jpg", tag: "Vibrant", alt: "Yellow themes", aspect: "aspect-[4/5]", artistId: "artist-2" },
];

export function MasonryGallery({ limit, dynamicItems }: { limit?: number, dynamicItems?: Item[] }) {
  const [active, setActive] = useState("All Moods");

  const sourceItems = dynamicItems && dynamicItems.length > 0 ? dynamicItems : defaultItems;
  const displayItems = limit ? sourceItems.slice(0, limit) : sourceItems;

  return (
    <section className="py-24 px-6 bg-ivory" id="gallery">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-xl">
            <p className="eyebrow text-rosegold mb-3">Visual Muse</p>
            <h2 className="text-4xl md:text-5xl font-serif italic text-plum mb-4">Discover your aesthetic.</h2>
            <p className="text-plum/60 leading-relaxed">
              A curated world of Delhi couture. Our AI learns your taste with every save and
              translates it into your personal beauty DNA.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 max-w-2xl">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-[11px] font-medium transition-all ${active === c
                    ? "bg-plum text-ivory border border-plum"
                    : "border border-plum/10 text-plum/70 hover:border-plum/30 hover:bg-pearl"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {displayItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className="break-inside-avoid"
            >
              {item.type === "image" && (
                item.artistId || item.salonId ? (
                  <Link
                    to={item.artistId ? "/stylists/$id" : "/salons/$id"}
                    params={item.artistId ? { id: item.artistId } : { id: item.salonId! }}
                    className="relative group cursor-pointer block"
                  >
                    <div
                      className={`w-full ${item.aspect} rounded-xl overflow-hidden ring-1 ring-plum/5 transition-all group-hover:ring-rosegold/30`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-plum/70 via-plum/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-5">
                      <div className="flex items-center justify-between w-full">
                        <p className="eyebrow text-ivory">{item.tag}</p>
                        <span className="px-3 py-1 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-plum text-[10px] font-bold uppercase">
                          Book {item.artistId ? 'Artist' : 'Salon'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative group cursor-pointer">
                    <div
                      className={`w-full ${item.aspect} rounded-xl overflow-hidden ring-1 ring-plum/5 transition-all group-hover:ring-rosegold/30`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-plum/70 via-plum/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-5">
                      <div className="flex items-center justify-between w-full">
                        <p className="eyebrow text-ivory">{item.tag}</p>
                        <span className="size-9 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-plum text-sm">
                          ♥
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}

              {item.type === "promo" && (
                <div className="p-8 bg-plum text-ivory rounded-xl shadow-luxe">
                  <p className="eyebrow text-rosegold">Neural Planner</p>
                  <h3 className="text-2xl font-serif italic mt-4 mb-6 leading-snug">
                    Generate your bespoke bridal timeline in 12 seconds.
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="h-px bg-ivory/10 w-full" />
                    <div className="flex justify-between text-[11px] opacity-60">
                      <span>Budget</span>
                      <span className="font-mono">₹15,00,000+</span>
                    </div>
                    <div className="flex justify-between text-[11px] opacity-60">
                      <span>Venue</span>
                      <span>Leela Palace, Delhi</span>
                    </div>
                    <div className="flex justify-between text-[11px] opacity-60">
                      <span>Match Score</span>
                      <span className="font-mono text-rosegold">98%</span>
                    </div>
                  </div>
                  <Link
                    to="/planner"
                    className="block w-full py-3 bg-rosegold text-plum text-[11px] font-bold rounded-lg uppercase tracking-widest text-center hover:bg-champagne transition-colors"
                  >
                    Open AI Panel
                  </Link>
                </div>
              )}

              {item.type === "artist" && (
                <div className="p-5 bg-white border border-plum/5 rounded-xl shadow-card hover:border-rosegold/30 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item.src}
                      alt={item.name}
                      loading="lazy"
                      className="size-12 rounded-full object-cover border border-plum/5"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-plum">{item.name}</h4>
                      <p className="text-[10px] text-plum/50">{item.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <div className="px-2 py-0.5 bg-rosegold/10 text-rosegold text-[9px] font-bold rounded uppercase tracking-tighter">
                      AI Match {item.match}%
                    </div>
                    <div className="text-[10px] font-medium text-plum/70">
                      ★ {item.rating} ({item.reviews})
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="h-16 bg-pearl rounded-md overflow-hidden">
                      <img src="/images/gallery-makeup.jpg" alt="" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-16 bg-pearl rounded-md overflow-hidden">
                      <img src="/images/gallery-embroidery.jpg" alt="" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <Link
                    to="/discover"
                    className="block w-full py-2 border border-plum/10 rounded-lg text-[10px] font-bold uppercase text-center hover:bg-plum hover:text-ivory transition-all"
                  >
                    View Portfolio
                  </Link>
                </div>
              )}

              {item.type === "quote" && (
                <div className="p-8 bg-blush rounded-xl border border-rosegold/10">
                  <span className="font-serif text-5xl text-rosegold leading-none">"</span>
                  <p className="font-serif italic text-lg text-plum leading-snug mt-2">
                    She made me feel like the bride I'd seen in my head since I was twelve.
                  </p>
                  <p className="eyebrow text-plum/40 mt-6">— Aanya, married Dec '25</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
