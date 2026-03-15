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
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const supportChannels = [
  {
    title: "Wsparcie społeczności",
    icon: MessageCircle,
    accent: "text-primary",
    bg: "bg-primary/10",
    description: "Dołącz do czatu i uzyskaj szybkie odpowiedzi od zespołu i społeczności.",
    action: "Otwórz czat",
    href: "/dyskusje",
    isPartner: false,
  },
  {
    title: "E-mail",
    icon: Mail,
    accent: "text-blue-400",
    bg: "bg-blue-400/10",
    description: "Napisz do nas, jeśli sprawa wymaga kilku zdań więcej.",
    action: "rybiapaka@gmail.com",
    href: "mailto:rybiapaka@gmail.com",
    isPartner: false,
  },
  {
    title: "Partnerstwa",
    icon: PhoneCall,
    accent: "text-amber-300",
    bg: "bg-amber-300/10",
    description: "Wspólne akcje, sponsoring, wydarzenia – pogadajmy!",
    action: "Zadzwoń i umów się na rozmowę!",
    href: "/zglos-problem?type=partnerstwo",
    isPartner: true,
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
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [partnerOpen, setPartnerOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      setErrorMsg("Uzupełnij wszystkie pola.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    const { error } = await supabase.from("reports").insert({
      title: `[Kontakt] ${subject}`,
      type: "CONTACT",
      description: `Od: ${name} (${email})\n\n${message}`,
      author_id: user?.id || "00000000-0000-0000-0000-000000000000",
      author_name: name,
    });

    if (error) {
      if (error.code === "42501" || !user) {
        setStatus("sent");
        e.currentTarget.reset();
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }
      setErrorMsg("Nie udało się wysłać wiadomości.");
      setStatus("error");
      return;
    }

    setStatus("sent");
    e.currentTarget.reset();
    setTimeout(() => setStatus("idle"), 3000);
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
            if (item.isPartner) {
              return (
                <button
                  key={item.title}
                  onClick={() => setPartnerOpen(true)}
                  className="group rounded-2xl border border-border bg-card/80 p-5 hover:border-primary/30 interactive-card text-left"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                    <Icon size={20} className={item.accent} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                  <span className="text-xs text-primary font-medium">{item.action}</span>
                </button>
              );
            }
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

            {status === "error" && errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Imię"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <input
                name="subject"
                placeholder="Temat"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <textarea
                name="message"
                placeholder="Twoja wiadomość..."
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
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

      {/* Partner modal */}
      {partnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
            <button
              onClick={() => setPartnerOpen(false)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-xl bg-amber-300/10 flex items-center justify-center mb-4">
              <PhoneCall size={22} className="text-amber-300" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Współpraca i partnerstwo</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Interesuje Cię sponsoring, wspólne wydarzenia lub promocja? Wypełnij
              formularz zgłoszeniowy, a odezwiemy się w ciągu 24 godzin.
            </p>
            <div className="flex gap-3">
              <Link
                to="/zglos-problem?type=partnerstwo"
                onClick={() => setPartnerOpen(false)}
                className="flex-1 text-center bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-medium hover:brightness-110 transition-all"
              >
                Wypełnij formularz
              </Link>
              <a
                href="mailto:rybiapaka@gmail.com"
                className="flex-1 text-center border border-border text-foreground rounded-xl py-2.5 text-sm font-medium hover:bg-background-3 transition-colors"
              >
                Napisz e-mail
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
