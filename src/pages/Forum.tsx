import { useState } from "react";
import { Search, Plus, ThumbsUp, MessageSquare, Clock, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const sortOptions = [
  { id: "popular", label: "Popularne", icon: TrendingUp },
  { id: "newest", label: "Najnowsze", icon: Clock },
  { id: "comments", label: "Najwięcej komentarzy", icon: MessageSquare },
];

const mockThreads = [
  { id: 1, title: "Jaki kołowrotek do spinningu na szczupaka?", content: "Szukam czegoś w budżecie do 300zł, żeby dobrze pracował z wędką 2.4m...", author: "Wędkarz123", date: "2 godz. temu", tags: ["Spinning", "Sprzęt"], likes: 24, comments: 18 },
  { id: 2, title: "Najlepsze zanęty na karpia wiosną", content: "Jak co roku zaczynam sezon karpiowy i zastanawiam się co w tym roku sprawdzi się najlepiej...", author: "KarpLover", date: "5 godz. temu", tags: ["Karpiowanie", "Zanęty"], likes: 41, comments: 32 },
  { id: 3, title: "Regulamin łowiska Staw Młyński — zmiany 2025", content: "Czy ktoś wie jakie nowe zasady obowiązują od tego sezonu? Słyszałem że zmienili limity...", author: "Splawik_Pro", date: "12 godz. temu", tags: ["Łowiska", "Regulaminy"], likes: 15, comments: 8 },
  { id: 4, title: "Mój rekordowy sandacz 🐟", content: "Wczoraj na Wiśle udało mi się złowić sandacza 78cm! Guma 12cm w kolorze motoroil...", author: "NightAngler", date: "1 dzień temu", tags: ["Spinning", "Trofea"], likes: 89, comments: 45 },
  { id: 5, title: "Feeder na rzece — jaki koszyk?", content: "Planuję sesję na Bugu, nurt dosyć silny. Jakie koszyczki polecacie? 80g czy 120g?", author: "FeederMaster", date: "1 dzień temu", tags: ["Feeder", "Sprzęt"], likes: 12, comments: 22 },
  { id: 6, title: "Najśmieszniejszy moment na rybach 😂", content: "Opowiedzcie o swoich najzabawniejszych przygodach nad wodą. Ja zacznę — kiedyś zasnąłem na fotelu...", author: "MemFisher", date: "2 dni temu", tags: ["Memy", "Off-topic"], likes: 156, comments: 98 },
];

export default function ForumPage() {
  const [activeSort, setActiveSort] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Forum</h1>
            <p className="text-muted-foreground mt-1">Przeglądaj wątki i dołącz do dyskusji</p>
          </div>
          <Button className="gap-2 self-start">
            <Plus className="w-4 h-4" />
            Utwórz wątek
          </Button>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj wątków..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {sortOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveSort(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSort === opt.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thread List */}
        <div className="space-y-3">
          {mockThreads.map((thread) => (
            <article
              key={thread.id}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 interactive-press cursor-pointer"
            >
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 mt-1 shrink-0">
                  <AvatarFallback className="bg-secondary text-foreground text-sm">
                    {thread.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-primary">{thread.author}</span>
                    <span className="text-xs text-muted-foreground">• {thread.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1 leading-snug">{thread.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{thread.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {thread.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" /> {thread.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {thread.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
