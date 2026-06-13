import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { WeddingCountdown } from "./WeddingCountdown";
import { supabase } from "@/integrations/supabase/client";

export function Hero() {
  const navigate = useNavigate();

  const handleStartPlanning = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      navigate({ to: '/salons' });
    } else {
      navigate({ to: '/auth', search: { redirect: '/salons' } });
    }
  };
  return (
    <header className="relative pt-12 pb-24 px-6 overflow-hidden">
      {/* subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-blush/30 via-ivory to-ivory pointer-events-none" />
      <div className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-rosegold/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-8 bg-rosegold" />
            <span className="eyebrow text-rosegold">Waitlist Open • Delhi 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.95] italic text-balance mb-8 text-plum">
            Your Bridal <br />
            <span className="text-rosegold">Masterpiece</span>, <br />
            Planned by AI.
          </h1>
          <p className="max-w-[42ch] text-lg text-plum/70 leading-relaxed mb-10 text-pretty">
            The hush of dawn, the scent of rose petals, and a flawless timeline. Delhi's premier
            AI bridal beauty concierge — for the modern bride who wants every detail to feel
            inevitable.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={handleStartPlanning}
              className="group px-8 py-4 bg-plum text-ivory rounded-full font-medium hover:ring-4 ring-plum/10 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              Start Planning
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <WeddingCountdown />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
          className="relative"
        >
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-plum/5 shadow-luxe">
            <img
              src="/images/hero-bride.jpg"
              alt="Editorial portrait of a Delhi bride in ivory silk with champagne gold embroidery"
              width={1024}
              height={1280}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/30 via-transparent to-transparent" />
          </div>

          {/* Floating AI suggestion card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute -bottom-8 -left-6 p-6 bg-white shadow-luxe rounded-2xl border border-plum/5 max-w-[260px] animate-float"
          >
            <p className="eyebrow text-rosegold mb-2">AI Suggestion</p>
            <p className="text-sm italic font-serif text-plum leading-relaxed">
              "Subtle champagne gold lids with a deep plum lip for your Sangeet."
            </p>
            <div className="flex items-center gap-1 mt-3">
              <span className="size-1.5 rounded-full bg-rosegold" />
              <span className="size-1.5 rounded-full bg-rosegold" />
              <span className="size-1.5 rounded-full bg-rosegold/30" />
            </div>
          </motion.div>

          {/* Floating match score */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute top-6 -right-4 px-5 py-3 bg-plum text-ivory rounded-full shadow-luxe"
          >
            <p className="eyebrow text-rosegold">AI Match</p>
            <p className="font-mono text-lg font-semibold">98%</p>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
