import { Lock, ServerCog, Handshake, CheckCircle2 } from "lucide-react";

type PolicySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const sections: PolicySection[] = [
  {
    title: "Polityka Prywatności",
    paragraphs: [
      "Niniejsza Polityka Prywatności opisuje zasady przetwarzania danych osobowych Użytkowników korzystających z naszego forum internetowego, zgodnie z obowiązującym prawem Rzeczypospolitej Polskiej oraz Rozporządzeniem (UE) 2016/679 (RODO).",
    ],
  },
  {
    title: "Administrator Danych Osobowych",
    paragraphs: [
      "Administratorem danych osobowych jest Jakub Przewłocki prowadzący serwis forum.",
      "Kontakt z Administratorem: rybiapaka@gmail.com.",
    ],
  },
  {
    title: "Zakres Przetwarzanych Danych",
    paragraphs: ["W ramach korzystania z forum mogą być zbierane następujące dane:"],
    bullets: [
      "Dane podawane przy rejestracji: adres e-mail oraz nazwa użytkownika.",
      "Dane profilowe: imię, pseudonim, zdjęcie profilowe.",
      "Dane techniczne: adres IP, informacje o przeglądarce, znacznik czasu wizyty.",
      "Pliki cookies: identyfikatory sesji i preferencje.",
      "Dane dotyczące aktywności: treści postów, komentarzy, wiadomości.",
    ],
  },
  {
    title: "Cele Przetwarzania Danych",
    paragraphs: ["Dane osobowe przetwarzamy w następujących celach:"],
    bullets: [
      "Rejestracja i utrzymanie konta Użytkownika.",
      "Świadczenie usług forum i obsługa Użytkowników.",
      "Utrzymanie bezpieczeństwa serwisu.",
      "Cele statystyczne i analityczne.",
      "Realizacja obowiązków prawnych.",
    ],
  },
  {
    title: "Prawa Użytkownika",
    paragraphs: ["Każdemu Użytkownikowi przysługują prawa:"],
    bullets: [
      "Prawo dostępu do danych.",
      "Prawo do sprostowania danych.",
      'Prawo do usunięcia danych (\u201Eprawo do bycia zapomnianym\u201D).',
      "Prawo do ograniczenia przetwarzania.",
      "Prawo do przenoszenia danych.",
      "Prawo sprzeciwu wobec przetwarzania.",
      "Prawo do wycofania zgody.",
    ],
  },
  {
    title: "Pliki Cookies",
    paragraphs: [
      "Nasze forum używa plików cookies. Cookies techniczne są niezbędne do prawidłowego funkcjonowania forum.",
      "Nie wykorzystujemy cookies marketingowych ani reklamowych stron trzecich.",
    ],
  },
  {
    title: "Bezpieczeństwo Danych",
    paragraphs: [
      "Stosujemy odpowiednie środki techniczne i organizacyjne mające na celu ochronę danych: protokół SSL/TLS, zabezpieczenie baz danych, regularne aktualizacje, kopie zapasowe.",
    ],
  },
  {
    title: "Kontakt z Administratorem",
    paragraphs: [
      "E-mail: rybiapaka@gmail.com.",
      "Formularz kontaktowy na forum oraz wiadomość prywatna do konta Administratora.",
    ],
  },
  {
    title: "Zmiany Polityki Prywatności",
    paragraphs: [
      "Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności. O zmianach Użytkownicy zostaną poinformowani z wyprzedzeniem.",
      "Polityka Prywatności obowiązuje od dnia 1 stycznia 2026 r.",
    ],
  },
];

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 page-transition">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Polityka Prywatności</h1>

        {/* Summary cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Lock size={20} className="text-primary mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground">Bezpieczeństwo</h3>
            <p className="text-xs text-muted-foreground mt-1">SSL/TLS, szyfrowanie, kopie zapasowe</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <ServerCog size={20} className="text-primary mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground">Serwery w UE</h3>
            <p className="text-xs text-muted-foreground mt-1">Dane nie opuszczają EOG</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Handshake size={20} className="text-primary mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground">Bez marketingu</h3>
            <p className="text-xs text-muted-foreground mt-1">Zero cookies reklamowych</p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-muted-foreground mb-2 leading-relaxed">{p}</p>
              ))}
              {section.bullets && (
                <ul className="mt-2 space-y-1.5 pl-4">
                  {section.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
