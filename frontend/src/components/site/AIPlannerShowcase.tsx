import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const events = ["Mehendi", "Haldi", "Sangeet", "Wedding", "Reception"];
const budgets = ["₹50k", "₹1L", "₹3L", "₹5L+"];

const milestones = [
  {
    phase: "90 days",
    title: "Skincare Foundation",
    detail: "Begin Vitamin C + retinol cycle, book trial artist",
  },
  {
    phase: "60 days",
    title: "Hair & Body Prep",
    detail: "Hair spa series, dietary protocol, jewelry trials",
  },
  {
    phase: "30 days",
    title: "Final Trials",
    detail: "Lock makeup look, final tailoring, deep cleanse facial",
  },
  {
    phase: "7 days",
    title: "The Glow",
    detail: "Hydration mist, mani-pedi, restful sleep schedule",
  },
];

export function AIPlannerShowcase() {
  const [activeEvent, setActiveEvent] = useState("Sangeet");
  const [activeBudget, setActiveBudget] = useState("₹3L");

  return (
    <section
      className="min-h-[100dvh] flex items-center px-6 bg-ivory snap-start snap-always py-16"
      id="planner"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5">
          <p className="eyebrow text-rosegold mb-4">The Neural Planner</p>
          <h2 className="text-4xl md:text-5xl font-serif italic text-plum text-balance mb-6 leading-tight">
            A bespoke beauty <br /> timeline in <span className="text-rosegold">12 seconds.</span>
          </h2>
          <p className="text-plum/70 leading-relaxed mb-8 max-w-[44ch]">
            Tell us your wedding date, your events, and your budget. Our AI generates a granular
            90/60/30/7-day protocol — skincare, hair, nails, trials, and artist pairings — tuned to
            your skin, face shape, and venue lighting.
          </p>

          <div className="space-y-6">
            <div>
              <p className="eyebrow mb-3 text-plum/40">Events</p>
              <div className="flex flex-wrap gap-2">
                {events.map((e) => (
                  <button
                    key={e}
                    onClick={() => setActiveEvent(e)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      activeEvent === e
                        ? "bg-plum text-ivory"
                        : "bg-pearl text-plum/70 hover:bg-blush"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3 text-plum/40">Budget</p>
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <button
                    key={b}
                    onClick={() => setActiveBudget(b)}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all ${
                      activeBudget === b
                        ? "bg-rosegold text-plum"
                        : "bg-pearl text-plum/70 hover:bg-champagne"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-plum text-ivory rounded-full text-sm font-medium hover:bg-plum-light transition-all"
            >
              Generate My Timeline →
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="lg:col-span-7 bg-white rounded-3xl border border-plum/5 shadow-luxe overflow-hidden"
        >
          <div className="bg-pearl px-6 py-4 flex items-center justify-between border-b border-plum/5">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-rosegold animate-pulse" />
              <span className="eyebrow text-plum/60">AI Beauty Timeline</span>
            </div>
            <span className="font-mono text-[10px] text-plum/40">v2.4 · live</span>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-end pb-6 mb-6 border-b border-plum/5">
              <div>
                <p className="eyebrow text-plum/40 mb-1">Optimizing For</p>
                <p className="font-serif italic text-2xl text-plum">
                  {activeEvent} · {activeBudget}
                </p>
              </div>
              <div className="text-right">
                <p className="eyebrow text-plum/40 mb-1">Days remaining</p>
                <p className="font-mono text-2xl font-semibold text-plum tabular-nums">142</p>
              </div>
            </div>

            <div className="space-y-3">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.phase}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="grid grid-cols-[80px_1fr] gap-4 p-4 rounded-xl hover:bg-pearl transition-colors group cursor-pointer"
                >
                  <div className="font-mono text-xs text-rosegold font-semibold pt-1">
                    {m.phase}
                  </div>
                  <div>
                    <p className="font-medium text-plum group-hover:text-rosegold transition-colors">
                      {m.title}
                    </p>
                    <p className="text-xs text-plum/50 mt-1 leading-relaxed">{m.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blush/40 rounded-xl border border-rosegold/20">
              <div className="flex items-start gap-3">
                <span className="text-rosegold text-lg">✦</span>
                <div>
                  <p className="eyebrow text-rosegold mb-1">Risk Detector</p>
                  <p className="text-sm text-plum">
                    No makeup trial booked yet — recommended at the 45-day mark.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
