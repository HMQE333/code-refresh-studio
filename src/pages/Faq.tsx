import { Link } from "react-router-dom";
import {
  HelpCircle,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  UserPlus,
  Camera,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    title: "Jak założyć konto?",
    description: "Kliknij Zarejestruj, podaj e-mail i hasło, a potem uzupełnij profil.",
    icon: UserPlus,
    tag: "Konto",
  },
  {
    title: "Jak ustawić avatar?",
    description: "Wejdź w Profil -> Ustawienia i wybierz plik lub podaj link do obrazu.",
    icon: Sparkles,
    tag: "Profil",
  },
  {
    title: "Jak dodać wątek na forum?",
    description: "Otwórz Forum, wybierz dział i kliknij przycisk dodania nowego wątku.",
    icon: MessageCircle,
    tag: "Forum",
  },
  {
    title: "Jak dodać zdjęcie do galerii?",
    description: "W Galerii wybierz Dodaj zdjęcie, uzupełnij opis i opublikuj wpis.",
    icon: Camera,
    tag: "Galeria",
  },
  {
    title: "Jak zgłosić problem?",
    description: "Skorzystaj z formularza Zgłoś problem w stopce lub w zakładce Kontakt.",
    icon: HelpCircle,
    tag: "Wsparcie",
  },
  {
    title: "Bezpieczeństwo i dane",
    description: "Dbamy o bezpieczeństwo konta, ale nie podawaj danych prywatnych w postach.",
    icon: ShieldCheck,
    tag: "Bezpieczeństwo",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 page-transition">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Najczęściej zadawane pytania</h1>

        <div className="grid gap-4">
          {FAQ_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 interactive-card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                    <h2 className="text-lg font-semibold text-foreground mt-2">{item.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center rounded-2xl border border-border bg-card p-8">
          <p className="text-foreground font-semibold mb-2">Nadal potrzebujesz pomocy?</p>
          <p className="text-sm text-muted-foreground mb-4">
            Napisz do nas, a podpowiemy najlepsze rozwiązanie.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all interactive-press"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </div>
  );
}
