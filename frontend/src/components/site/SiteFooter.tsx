export function SiteFooter() {
  return (
    <footer className="bg-plum text-ivory py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-ivory/10 pb-16">
        <div className="col-span-2">
          <h5 className="font-serif italic text-4xl mb-6">
            ShaadiGlow <span className="text-rosegold">AI</span>
          </h5>
          <p className="text-ivory/50 text-sm max-w-sm leading-relaxed">
            Redefining Delhi's bridal heritage through technical elegance and modern artistry.
            Every bride deserves a masterpiece.
          </p>
        </div>
        <div className="space-y-4">
          <p className="eyebrow text-rosegold">Inquiries</p>
          <ul className="text-sm space-y-2">
            <li className="text-ivory/70 hover:text-ivory cursor-pointer transition-colors">
              concierge@shaadiglow.ai
            </li>
            <li className="text-ivory/70 hover:text-ivory cursor-pointer transition-colors">
              +91 11 4050 9999
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="eyebrow text-rosegold">Studio</p>
          <p className="text-sm text-ivory/70 leading-relaxed">
            Sunder Nagar
            <br />
            New Delhi 110003
            <br />
            By Appointment Only
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="eyebrow text-ivory/30">© 2026 ShaadiGlow AI. All rights reserved.</p>
        <div className="flex gap-8 eyebrow">
          <a href="#" className="text-ivory/60 hover:text-rosegold transition-colors">
            Terms
          </a>
          <a href="#" className="text-ivory/60 hover:text-rosegold transition-colors">
            Privacy
          </a>
          <a href="#" className="text-ivory/60 hover:text-rosegold transition-colors">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
