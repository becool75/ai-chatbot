import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fake company website to demo the chatbot */}
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="text-xl font-bold text-slate-800">TechStore GmbH</div>
          <div className="flex gap-6 text-sm text-slate-600">
            <span>Produkte</span>
            <span>Über uns</span>
            <span>Support</span>
            <span>Kontakt</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            Willkommen bei TechStore
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Ihr Partner für moderne Technologie-Lösungen. Entdecken Sie unsere
            Produkte und Services.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Cloud Services",
              desc: "Sichere und skalierbare Cloud-Infrastruktur für Ihr Unternehmen.",
              price: "ab 99 EUR/Monat",
            },
            {
              title: "IT-Support",
              desc: "24/7 technischer Support von unserem Experten-Team.",
              price: "ab 199 EUR/Monat",
            },
            {
              title: "Cyber Security",
              desc: "Schützen Sie Ihre Daten mit unseren Sicherheitslösungen.",
              price: "ab 149 EUR/Monat",
            },
          ].map((product) => (
            <div
              key={product.title}
              className="rounded-xl border border-slate-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h3 className="mb-2 text-lg font-semibold text-slate-800">
                {product.title}
              </h3>
              <p className="mb-4 text-slate-600">{product.desc}</p>
              <p className="text-sm font-medium text-blue-600">{product.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-blue-50 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-800">
            Fragen? Unser AI-Assistent hilft Ihnen!
          </h2>
          <p className="text-slate-600">
            Klicken Sie auf den Chat-Button unten rechts, um sofort Antworten zu
            erhalten.
          </p>
        </div>

        {/* Demo info banner */}
        <div className="mt-8 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-6 text-center">
          <p className="text-sm font-medium text-blue-800">
            DEMO: Dies ist eine Beispiel-Website. Der AI-Chatbot unten rechts ist das Produkt.
          </p>
          <p className="mt-1 text-sm text-blue-600">
            <a href="/admin" className="underline">Admin-Dashboard →</a>
            {" | "}
            <a href="/settings" className="underline">Einstellungen →</a>
            {" | "}
            <a href="/embed" className="underline">Embed-Code →</a>
          </p>
        </div>
      </main>

      {/* The actual product: Chat Widget */}
      <ChatWidget />
    </div>
  );
}
