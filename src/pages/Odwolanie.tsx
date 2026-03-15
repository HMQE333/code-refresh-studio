import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

export default function OdwolaniePage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Jak złożyć odwołanie
          </h1>

          <ol className="space-y-3 text-sm text-muted-foreground mb-8 list-decimal list-inside">
            <li>Skontaktuj się z nami przez formularz lub e-mail.</li>
            <li>Podaj e-mail konta, nick (jeśli posiadasz) oraz krótki opis sytuacji.</li>
            <li>Wytłumacz, dlaczego uważasz decyzję za niesłuszną i dołącz dowody.</li>
          </ol>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
            >
              Przejdź do kontaktu
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:rybiapaka@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <Mail className="w-4 h-4" />
              rybiapaka@gmail.com
            </a>
          </div>

          <div className="rounded-xl border border-border bg-secondary/50 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Co warto podać</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Adres e-mail przypisany do konta.</li>
              <li>• Twój nick lub nazwa użytkownika.</li>
              <li>• Opis zdarzenia i kontekst.</li>
              <li>• Dowody: zrzuty ekranu, linki, data zdarzenia.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
