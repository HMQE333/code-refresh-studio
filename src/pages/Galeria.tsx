import { useState } from "react";
import { Heart, X, Camera } from "lucide-react";

const categories = ["Wszystkie", "Łowiska", "Ryby", "Sprzęt", "Przyroda"];

const mockPhotos = [
  { id: 1, title: "Zachód słońca nad jeziorem", author: "FotoWędkarz", likes: 42, category: "Łowiska", color: "from-amber-800 to-orange-600" },
  { id: 2, title: "Karp 12kg — rekord sezonu!", author: "KarpLover", likes: 128, category: "Ryby", color: "from-emerald-800 to-green-600" },
  { id: 3, title: "Nowy zestaw feederowy", author: "FeederMaster", likes: 23, category: "Sprzęt", color: "from-slate-700 to-zinc-500" },
  { id: 4, title: "Mglisty poranek na rzece", author: "NatureShot", likes: 67, category: "Przyroda", color: "from-blue-800 to-cyan-600" },
  { id: 5, title: "Sandacz 78cm z Wisły", author: "NightAngler", likes: 95, category: "Ryby", color: "from-teal-800 to-emerald-500" },
  { id: 6, title: "Stanowisko na nocną sesję", author: "Splawik_Pro", likes: 34, category: "Łowiska", color: "from-indigo-800 to-purple-600" },
  { id: 7, title: "Kolekcja przynęt gumowych", author: "SpinningKing", likes: 19, category: "Sprzęt", color: "from-rose-800 to-pink-500" },
  { id: 8, title: "Czapla nad stawem", author: "NatureShot", likes: 51, category: "Przyroda", color: "from-green-800 to-lime-600" },
  { id: 9, title: "Sum 120cm — potwór!", author: "CatfishHunter", likes: 204, category: "Ryby", color: "from-yellow-800 to-amber-500" },
];

export default function GaleriaPage() {
  const [activeCategory, setActiveCategory] = useState("Wszystkie");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === "Wszystkie"
    ? mockPhotos
    : mockPhotos.filter((p) => p.category === activeCategory);

  const lightboxPhoto = mockPhotos.find((p) => p.id === lightbox);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Galeria</h1>
          <p className="text-muted-foreground">Najlepsze zdjęcia naszej społeczności wędkarskiej</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightbox(photo.id)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer interactive-press"
            >
              {/* Placeholder gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${photo.color} flex items-center justify-center`}>
                <Camera className="w-12 h-12 text-white/20" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-sm">{photo.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/70 text-xs">{photo.author}</span>
                  <span className="flex items-center gap-1 text-white/70 text-xs">
                    <Heart className="w-3.5 h-3.5" /> {photo.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`aspect-[16/10] bg-gradient-to-br ${lightboxPhoto.color} flex items-center justify-center`}>
              <Camera className="w-20 h-20 text-white/20" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-bold text-lg">{lightboxPhoto.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-white/70 text-sm">
                <span>{lightboxPhoto.author}</span>
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {lightboxPhoto.likes}</span>
              </div>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
