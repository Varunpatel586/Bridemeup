import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// Default wedding date: 142 days from now-ish for nice demo
export function WeddingCountdown({ target }: { target?: Date }) {
  const targetDate =
    target ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 142 + 1000 * 60 * 60 * 12);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, targetDate.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return (
    <div className="flex items-center gap-3 px-6 py-4 border border-plum/10 rounded-full bg-pearl/80 backdrop-blur-sm">
      <span className="font-mono text-[10px] tracking-widest text-plum/50">T–MINUS</span>
      <span className="font-mono text-sm font-semibold tracking-tight tabular-nums text-plum">
        {pad(days)}:{pad(hours)}:{pad(mins)}:{pad(secs)}
      </span>
    </div>
  );
}
