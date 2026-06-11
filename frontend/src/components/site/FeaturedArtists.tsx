import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";

const artists = [
  {
    name: "Ananya Verma",
    specialty: "Bridal Makeup · Royal Heritage",
    location: "Sunder Nagar",
    rating: 4.9,
    reviews: 142,
    price: "₹85k",
    match: 98,
    img: artist1,
  },
  {
    name: "Vikram Singh",
    specialty: "Hairstyling · Structural Couture",
    location: "Mehrauli",
    rating: 4.8,
    reviews: 96,
    price: "₹45k",
    match: 94,
    img: artist2,
  },
  {
    name: "Sana Mehra",
    specialty: "Mehendi · Modern Minimalist",
    location: "Hauz Khas",
    rating: 5.0,
    reviews: 78,
    price: "₹28k",
    match: 92,
    img: artist3,
  },
];

export function FeaturedArtists() {
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
            View All 240 Artists →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {artists.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
              className="group bg-white rounded-2xl overflow-hidden border border-plum/5 hover:shadow-luxe transition-all"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
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
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-serif italic text-2xl text-plum">{a.name}</h3>
                    <p className="text-xs text-plum/50 mt-1">{a.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-plum">★ {a.rating}</p>
                    <p className="text-[10px] text-plum/40">{a.reviews} reviews</p>
                  </div>
                </div>
                <p className="text-xs text-plum/50 mb-5">📍 {a.location}, Delhi</p>
                <Link
                  to="/discover"
                  className="block text-center w-full py-3 border border-plum/15 rounded-full eyebrow text-plum hover:bg-plum hover:text-ivory transition-all"
                >
                  View Portfolio
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
