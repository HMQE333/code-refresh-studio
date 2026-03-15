import { CheckCircle2, Sparkles, Clock, Shield } from "lucide-react";

type Section = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const sections: Section[] = [
  {
    title: "Regulamin Forum",
    paragraphs: [
      "Niniejszy regulamin określa zasady korzystania z internetowego forum dyskusyjnego o tematyce wędkarskiej oraz prawa i obowiązki zarejestrowanych użytkowników Forum i podmiotu zarządzającego Forum.",
      "Korzystanie z Forum jest dobrowolne. Rejestracja na Forum jest wymagana do uzyskania pełnego dostępu do funkcji Forum.",
    ],
  },
  {
    title: "Definicje",
    paragraphs: ["Poniższe pojęcia użyte w Regulaminie oznaczają:"],
    bullets: [
      "Forum – internetowe forum dyskusyjne o tematyce wędkarskiej.",
      "Administrator – podmiot zarządzający i prowadzący Forum.",
      "Użytkownik – osoba fizyczna, która dokonała rejestracji konta na Forum.",
      "Konto Użytkownika – indywidualny profil Użytkownika w ramach Forum.",
      "Moderator – osoba wyznaczona przez Administratora, nadzorująca dyskusje.",
    ],
  },
  {
    title: "Rejestracja i konto użytkownika",
    paragraphs: [
      "Rejestracja następuje poprzez wypełnienie formularza rejestracyjnego. Użytkownik zobowiązany jest podać dane prawdziwe i aktualne.",
      "Jedna osoba fizyczna może posiadać co najwyżej jedno Konto Użytkownika na Forum.",
    ],
  },
  {
    title: "Zasady korzystania z Forum",
    paragraphs: ["Użytkownik zobowiązany jest korzystać z Forum w sposób zgodny z prawem. Zabronione są w szczególności:"],
    bullets: [
      "Destabilizacja pracy serwisu.",
      "Spam i niechciane treści.",
      "Naruszanie dóbr osobistych, mowa nienawiści.",
      "Podszywanie się pod inne osoby.",
      "Działalność komercyjna bez zgody Administratora.",
    ],
  },
  {
    title: "Moderacja i sankcje",
    paragraphs: [
      "Administrator i Moderatorzy sprawują nadzór nad przestrzeganiem Regulaminu.",
    ],
    bullets: [
      "Upomnienie prywatne lub ostrzeżenie formalne.",
      "Czasowa blokada konta.",
      "Stała blokada konta w przypadku poważnych naruszeń.",
    ],
  },
  {
    title: "Ochrona danych osobowych",
    paragraphs: [
      "Dane przetwarzane są zgodnie z RODO oraz ustawą o ochronie danych osobowych.",
      "Szczegóły przetwarzania danych znajdują się w Polityce Prywatności.",
    ],
  },
  {
    title: "Reklamacje i kontakt",
    paragraphs: [
      "Kontakt z Administratorem: rybiapaka@gmail.com.",
      "Administrator rozpatruje reklamacje niezwłocznie, nie później niż w ciągu 14 dni.",
    ],
  },
  {
    title: "Postanowienia końcowe",
    paragraphs: [
      "Prawem właściwym jest prawo Rzeczypospolitej Polskiej.",
      "Regulamin obowiązuje od dnia 1 stycznia 2026 r.",
    ],
  },
];

const quickRules = [
  "Szanuj innych, zero personalnych ataków.",
  "Nie duplikuj tematów - sprawdź, czy podobny wątek już istnieje.",
  "Oznaczaj NSFW i kontrowersyjne treści.",
  "Przestrzegaj prawa autorskiego i podawaj źródła.",
];

export default function RegulaminPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 page-transition">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Regulamin</h1>

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

        {/* Quick rules */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Shield size={20} className="text-primary mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground mb-1">Zgłoszenia</h3>
            <p className="text-xs text-muted-foreground">Korzystaj z formularza w dziale Zgłoś problem.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Clock size={20} className="text-primary mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground mb-1">Aktualizacje</h3>
            <p className="text-xs text-muted-foreground">Nowe zmiany trafiają do sekcji Informacje.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Sparkles size={20} className="text-primary mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground mb-1">Dobry ton</h3>
            <p className="text-xs text-muted-foreground">Pisz z szacunkiem, konkretnie, bez floodu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
