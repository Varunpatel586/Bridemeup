import { motion } from "framer-motion";
import couple from "@/assets/gallery-couple.jpg";
import bride from "@/assets/hero-bride.jpg";
import haldi from "@/assets/gallery-haldi.jpg";

const stories = [
  {
    img: bride,
    bride: "Aanya & Rohan",
    venue: "Leela Palace · Delhi",
    quote:
      "ShaadiGlow's AI flagged a missed trial 60 days out. The artist they paired me with felt like a sister by the wedding day.",
    events: 4,
    artists: 3,
  },
  {
    img: couple,
    bride: "Priya & Arjun",
    venue: "Taj Mahal Hotel · Mumbai",
    quote:
      "Three cities, six events, zero stress. The timeline alone saved me twenty calls. I still re-read my AI mood board.",
    events: 6,
    artists: 5,
  },
  {
    img: haldi,
    bride: "Ishita & Veer",
    venue: "Suryagarh · Jaisalmer",
    quote:
      "I told the planner I wanted 'modern royal' and it just understood. Every artist they suggested was my aesthetic.",
    events: 5,
    artists: 4,
  },
];

export function SuccessStories() {
  return (
    <section className="py-24 px-6 bg-ivory" id="stories">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="eyebrow text-rosegold mb-3">Real Brides</p>
          <h2 className="text-4xl md:text-5xl font-serif italic text-plum mb-4">
            Transformations, not transactions.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.article
              key={s.bride}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 ring-1 ring-plum/5">
                <img
                  src={s.img}
                  alt={s.bride}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/80 via-plum/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-ivory">
                  <p className="font-serif italic text-2xl">{s.bride}</p>
                  <p className="eyebrow text-ivory/70 mt-1">{s.venue}</p>
                </div>
              </div>
              <p className="font-serif italic text-plum/80 leading-relaxed mb-4 text-pretty">
                "{s.quote}"
              </p>
              <div className="flex gap-6 eyebrow text-plum/50">
                <span>{s.events} events</span>
                <span>{s.artists} artists</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
