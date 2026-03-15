import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ReportReason = {
  value: string;
  label: string;
  description: string;
};

const reportReasons: ReportReason[] = [
  { value: "bug", label: "Zgłoś błąd strony", description: "Znalazłem/am błąd lub problem techniczny" },
  { value: "user", label: "Zgłoś użytkownika", description: "Użytkownik narusza regulamin lub zasady społeczności" },
  { value: "suggestion", label: "Zaproponuj sugestię", description: "Mam pomysł na ulepszenie platformy" },
  { value: "content", label: "Nieodpowiednia treść", description: "Post lub komentarz zawiera niedozwolone treści" },
  { value: "spam", label: "Spam lub reklama", description: "Wykryłem/am spam lub niedozwoloną reklamę" },
  { value: "other", label: "Inne", description: "Inny powód zgłoszenia" },
];

export default function ZglosProblemPage() {
  const [reportType, setReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const quickReasons = useMemo(() => reportReasons.slice(0, 4), []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const reason = String(data.get("reportType") ?? "").trim();
    const title = String(data.get("reportTitle") ?? "").trim();

    if (!reason || !title) {
      setError("Uzupełnij rodzaj i tytuł zgłoszenia.");
      return;
    }

    setStatus("submitting");
    // Mock — no backend
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Strona główna</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-foreground">Zgłoś problem</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">Wsparcie</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium border border-border text-muted-foreground">Bez nachodzenia</span>
          </div>

          <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Zgłoszenie trafia bezpośrednio do moderatorów
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Opisz problem, a my zajmiemy się resztą
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Formularz jak na forum: jasne kategorie, przejrzyste pola i szybka wysyłka.
            Dodaj link, zaszyfruj szczegóły i wrzuć zrzut ekranu, by przyspieszyć reakcję.
          </p>

          <div className="flex flex-wrap gap-2 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Odpowiedź w 24h</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Priorytet dla bezpieczeństwa</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Współpraca z moderatorami</span>
          </div>
        </div>

        {/* Side info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-primary font-medium mb-1">Najnowsze</div>
            <div className="text-lg font-bold text-foreground">Zgłoszenia</div>
            <p className="text-xs text-muted-foreground mt-1">Sprawdzamy jak nowe wątki: każde zgłoszenie ma opiekuna i status jak w dyskusji.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-primary font-medium mb-1">Średni czas reakcji</div>
            <div className="text-lg font-bold text-foreground">Czas reakcji</div>
            <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
              <li>• Ping do moderatora</li>
              <li>• Odpowiedź na mail / DM</li>
              <li>• Aktualizacja statusu jak w wątku</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center">
            <p className="text-xs text-muted-foreground">Wypełnij detale jak w wątku na forum — klarownie i bez ścisku.</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {status === "success" && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Dziękujemy, dodaliśmy zgłoszenie do kolejki.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Quick reason pills */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Rodzaj zgłoszenia</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReasons.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReportType(r.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      reportType === r.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <select
                name="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Wybierz rodzaj...</option>
                {reportReasons.map((r) => (
                  <option key={r.value} value={r.value}>{r.label} — {r.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Tytuł zgłoszenia</label>
              <Input
                name="reportTitle"
                placeholder="Krótki opis problemu..."
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Szczegółowy opis</label>
              <Textarea name="content" placeholder="Opisz sytuację, dodaj kontekst..." rows={5} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Link do kontekstu (opcjonalnie)</label>
              <Input name="context" placeholder="https://rybiapaka.pl/forum/..." />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Link do zrzutu ekranu (opcjonalnie)</label>
              <Input name="attachmentUrl" placeholder="https://imgur.com/..." />
            </div>

            {/* Info */}
            <div className="rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Jak moderujemy?</p>
              <p>1) Automatyczny podgląd, 2) szybki ping moderatora, 3) odpowiedź na mail/DM.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setReportType("");
                  setReportTitle("");
                  setError(null);
                }}
                className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
              >
                Wyczyść
              </button>
              <Button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Wysyłanie..." : "Wyślij zgłoszenie"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
