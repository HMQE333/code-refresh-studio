import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [status, setStatus] = useState<"none" | "current" | "missing">("none");
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!highlight) return;
    const t = setTimeout(() => setHighlight(false), 700);
    return () => clearTimeout(t);
  }, [highlight]);

  useEffect(() => {
    if (status === "none") return;
    const t = setTimeout(() => setStatus("none"), 1800);
    return () => clearTimeout(t);
  }, [status]);

  const runSearch = () => {
    const term = query.trim();
    if (!term) return;

    const currentPath = location.pathname;
    const origin = window.location.origin;

    const navigateTo = (targetHref: string) => {
      const normalizedTarget = targetHref.startsWith("/") ? targetHref : `/${targetHref}`;
      setHighlight(true);
      if (currentPath === normalizedTarget) {
        setStatus("current");
        return;
      }
      navigate(normalizedTarget);
    };

    // Full URL matching site origin
    if (term.startsWith(origin)) {
      const nextHref = term.slice(origin.length) || "/";
      navigateTo(nextHref);
      return;
    }

    // External URL check
    if (/^https?:\/\//i.test(term)) {
      try {
        const url = new URL(term);
        if (url.origin === origin) {
          navigateTo(`${url.pathname}${url.search}${url.hash}`);
          return;
        }
      } catch {
        // ignore invalid URL
      }
    }

    // Direct path
    if (term.startsWith("/")) {
      navigateTo(term);
      return;
    }

    // Known route names
    if (/^administracja(\/|$)/i.test(term)) {
      navigateTo(`/${term}`);
      return;
    }

    // Default: go to search page
    setHighlight(true);
    const params = new URLSearchParams();
    params.set("q", term);
    navigate(`/szukaj?${params.toString()}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 rounded-xl border border-border bg-background-3/60 px-3 py-1.5 cursor-text transition-colors hover:border-primary/30"
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Szukaj..."
          ref={inputRef}
          className={cn(
            "w-24 min-w-0 bg-transparent border-none outline-none text-xs placeholder:text-muted-foreground focus:w-36 transition-all",
            highlight ? "text-primary" : "text-foreground"
          )}
        />
      </div>

      {status !== "none" && (
        <div className="absolute top-full mt-2 left-0 right-0 min-w-[200px] rounded-xl border border-border bg-card p-3 shadow-xl z-50 animate-toast">
          <p className="text-xs font-medium text-foreground mb-0.5">
            {status === "current"
              ? "Jesteś na stronie zawierającej tę frazę"
              : "Nie znaleziono takiej frazy"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {status === "current"
              ? "Fraza pasuje do bieżącej podstrony."
              : "Spróbuj innego słowa."}
          </p>
        </div>
      )}
    </div>
  );
}
