import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

function parsePrice(priceStr: string): number {
  const numStr = priceStr.replace(/[^0-9.]/g, "");
  let multiplier = 1;
  if (priceStr.toLowerCase().includes("k")) multiplier = 1000;
  if (priceStr.toLowerCase().includes("l")) multiplier = 100000;
  return parseFloat(numStr) * multiplier;
}

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function PackagesSection() {
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);

  // Preload the script on mount to avoid popup blocking in strict browsers like Firefox
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const handlePayment = async (pkg: typeof packages[0]) => {
    setLoadingPkg(pkg.name);
    try {
      // It's safe to call loadScript again if it's already loading/loaded, but we mostly just need to make sure `window.Razorpay` is there.
      if (!(window as any).Razorpay) {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
          alert("Razorpay SDK failed to load. Are you using an adblocker?");
          return;
        }
      }

      const amount = parsePrice(pkg.price);

      // Create Order
      const result = await fetch("http://localhost:8000/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_name: pkg.name, amount }),
      });

      if (!result.ok) {
        let errMsg = "Server error.";
        try {
          const errData = await result.json();
          errMsg = errData.detail || errMsg;
        } catch (e) { }
        alert(`Could not create order: ${errMsg}`);
        return;
      }

      const data = await result.json();

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Bridemeup",
        description: `Test Transaction for ${pkg.name}`,
        order_id: data.order_id,
        handler: function (response: any) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4a1c40", // plum color
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error(err);
      alert(`Error initiating payment: ${err.message || err}`);
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <section
      className="flex-1 flex items-center justify-center w-full bg-pearl relative overflow-hidden snap-start snap-always py-8"
      id="packages"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full shimmer-gold opacity-10 pointer-events-none" />
      <div className="w-full max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 lg:px-8 relative">
        <div className="text-center mb-8">
          <p className="eyebrow text-rosegold mb-2">Luxe Collections</p>
          <h2 className="text-3xl md:text-4xl font-serif italic text-plum mb-2">
            Bespoke for every chapter.
          </h2>
          <p className="text-plum/50 max-w-lg mx-auto">
            From a single trial to a full destination affair — orchestrated end-to-end.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className={`p-6 rounded-2xl flex flex-col transition-all hover:-translate-y-1 ${p.featured
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
              <h4 className={`text-xl font-serif mb-4 ${p.featured ? "text-ivory" : "text-plum"}`}>
                {p.name}
              </h4>
              <ul className="space-y-2 mb-6 flex-grow">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`text-xs flex items-center gap-2 ${p.featured ? "text-ivory/80" : "text-plum/80"
                      }`}
                  >
                    <span className="size-1 bg-rosegold rounded-full shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div
                className={`font-mono text-2xl mb-6 ${p.featured ? "text-rosegold" : "text-plum"}`}
              >
                {p.price}
                <span
                  className={`text-[10px] ml-1 ${p.featured ? "text-ivory/40" : "text-plum/40"}`}
                >
                  /event
                </span>
              </div>
              <button
                onClick={() => handlePayment(p)}
                disabled={loadingPkg === p.name}
                className={`w-full py-3 rounded-full eyebrow text-center transition-all ${p.featured
                  ? "bg-rosegold text-plum hover:bg-champagne"
                  : "border border-plum/15 text-plum hover:bg-plum hover:text-ivory"
                  } disabled:opacity-50`}
              >
                {loadingPkg === p.name ? "Processing..." : p.featured ? "Book Experience" : "Select"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
