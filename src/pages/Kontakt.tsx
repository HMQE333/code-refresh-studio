import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MessageCircle,
  PhoneCall,
  Send,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const supportChannels = [
  {
    title: "Wsparcie społeczności",
    icon: MessageCircle,
    accent: "text-primary",
    bg: "bg-primary/10",
    description: "Dołącz do czatu i uzyskaj szybkie odpowiedzi od zespołu i społeczności.",
    action: "Otwórz czat",
    href: "/dyskusje",
  },
  {
    title: "E-mail",
    icon: Mail,
    accent: "text-blue-400",
    bg: "bg-blue-400/10",
    description: "Napisz do nas, jeśli sprawa wymaga kilku zdań więcej.",
    action: "rybiapaka@gmail.com",
    href: "mailto:rybiapaka@gmail.com",
  },
  {
    title: "Partnerstwa",
    icon: PhoneCall,
    accent: "text-amber-300",
    bg: "bg-amber-300/10",
    description: "Wspólne akcje, sponsoring, wydarzenia – pogadajmy!",
    action: "Napisz do nas",
    href: "/kontakt",
  },
];

const faq = [
  {
    title: "Jak szybko odpisujemy?",
    description: "Na czacie zwykle w ciągu 5–15 minut, e-mailowo do 24h w dni robocze.",
    icon: Clock,
  },
  {
    title: "Bezpieczeństwo i zgłoszenia",
    description: "Nadużycia, spam lub problemy z kontem możesz zgłosić z poziomu formularza.",
    icon: ShieldCheck,
  },
  {
    title: "Czy możecie pomóc w sprzęcie?",
    description: "Jasne. Napisz, jakie łowisko/sprzęt, a damy rekomendacje lub podlinkujemy dyskusje.",
    icon: Sparkles,
  },
];

export default function KontaktPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 2800);
    }, 900);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 page-transition relative overflow-hidden">
      {/* Contact glow backgrounds */}
      <div className="contact-glow contact-glow-1" />
      <div className="contact-glow contact-glow-2" />
      <div className="contact-grid" />

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Kontakt</h1>

        {/* Support channels */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {supportChannels.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="group rounded-2xl border border-border bg-card/80 p-5 hover:border-primary/30 interactive-card"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={item.accent} />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                <span className="text-xs text-primary font-medium">{item.action}</span>
              </Link>
            );
          })}
        </div>

        {/* Contact form */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Formularz kontaktowy</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Imię"
                className="w-full rounded-xl border border-border bg-background-3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full rounded-xl border border-border bg-background-3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <input
                placeholder="Temat"
                className="w-full rounded-xl border border-border bg-background-3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <textarea
                placeholder="Twoja wiadomość..."
                rows={4}
                className="w-full rounded-xl border border-border bg-background-3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold py-3 text-sm hover:brightness-110 transition-all disabled:opacity-50 interactive-press"
              >
                <Send size={16} />
                {status === "sent" ? "Wysłano ✓" : status === "sending" ? "Wysyłanie..." : "Wyślij wiadomość"}
              </button>
            </form>
          </div>

          {/* FAQ side */}
          <div className="space-y-4">
            {faq.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5 interactive-card">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
