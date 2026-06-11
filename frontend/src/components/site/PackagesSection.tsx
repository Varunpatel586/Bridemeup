import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const packages = [
  {
    tier: "Discovery",
    name: "Engagement",
    price: "₹25k",
    features: ["Trial Makeup", "Hairstyling", "AI Moodboard", "Nails"],
  },
  {
    tier: "Signature",
    name: "Signature Bridal",
    price: "₹75k",
    featured: true,
    features: [
      "Master Bridal Artist",
      "Wedding + Trial Makeup",
      "Hair Styling",
      "Concierge Support",
      "Full Timeline Sync",
    ],
  },
  {
    tier: "Couture",
    name: "Complete Wedding",
    price: "₹1.8L",
    features: ["3 Main Events", "Makeup + Hair + Nails", "Skin Prep AI", "Trial Sessions"],
  },
  {
    tier: "Royal",
    name: "Imperial Gold",
    price: "₹4.5L",
    features: ["Destination Support", "On-site Concierge", "Premium Artists", "All Events"],
  },
];

export function PackagesSection() {
  return (
    <section className="py-24 bg-pearl relative overflow-hidden" id="packages">
      <div className="absolute top-0 right-0 w-1/3 h-full shimmer-gold opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <p className="eyebrow text-rosegold mb-3">Luxe Collections</p>
          <h2 className="text-4xl md:text-5xl font-serif italic text-plum mb-4">
            Bespoke for every chapter.
          </h2>
          <p className="text-plum/50 max-w-lg mx-auto">
            From a single trial to a full destination affair — orchestrated end-to-end.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className={`p-8 rounded-2xl flex flex-col transition-all hover:-translate-y-1 ${
                p.featured
                  ? "bg-plum text-ivory shadow-luxe lg:scale-105 z-10"
                  : "bg-ivory border border-plum/5 hover:shadow-luxe"
              }`}
            >
              {p.featured && (
                <div className="inline-block self-start px-3 py-1 bg-rosegold text-plum text-[9px] font-bold rounded-full mb-4 uppercase tracking-tighter">
                  Most Coveted
                </div>
              )}
              <p className={`eyebrow mb-2 ${p.featured ? "text-rosegold" : "text-rosegold"}`}>
                {p.tier}
              </p>
              <h4 className={`text-xl font-serif mb-6 ${p.featured ? "text-ivory" : "text-plum"}`}>
                {p.name}
              </h4>
              <ul className="space-y-3 mb-8 flex-grow">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`text-xs flex items-center gap-2 ${
                      p.featured ? "text-ivory/80" : "text-plum/80"
                    }`}
                  >
                    <span className="size-1 bg-rosegold rounded-full shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div
                className={`font-mono text-2xl mb-6 ${
                  p.featured ? "text-rosegold" : "text-plum"
                }`}
              >
                {p.price}
                <span
                  className={`text-[10px] ml-1 ${
                    p.featured ? "text-ivory/40" : "text-plum/40"
                  }`}
                >
                  /event
                </span>
              </div>
              <Link
                to="/packages"
                className={`w-full py-3 rounded-full eyebrow text-center transition-all ${
                  p.featured
                    ? "bg-rosegold text-plum hover:bg-champagne"
                    : "border border-plum/15 text-plum hover:bg-plum hover:text-ivory"
                }`}
              >
                {p.featured ? "Book Experience" : "Select"}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
