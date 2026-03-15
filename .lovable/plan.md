

## Kolejne kroki: brakujace strony z oryginalnego projektu

### Status obecny

Mamy juz: Strona glowna (wszystkie sekcje), Logowanie, Rejestracja, FAQ, Kontakt, Informacje, Regulamin, Polityka Prywatnosci, NotFound.

### Brakujace strony (z oryginalnego repo)

| Strona | Zlozonosc | Priorytet |
|--------|-----------|-----------|
| **Dyskusje** (`/dyskusje`) | Srednia -- siatka kanalow tematycznych | Wysoki (w nawigacji) |
| **Forum** (`/forum`) | Wysoka -- lista watkow, filtry, sortowanie | Wysoki (w nawigacji) |
| **Galeria** (`/galeria`) | Wysoka -- grid zdjec, kategorie, lightbox | Wysoki (w nawigacji) |
| **Odzyskaj haslo** (`/odzyskaj-haslo`) | Niska -- prosty formularz email | Sredni |
| **Zglos problem** (`/zglos-problem`) | Srednia -- formularz z dropdown powodow | Niski |
| **Szukaj** (`/szukaj`) | Wysoka -- wymaga backendu | Niski |
| **Profil** (`/profil`) | Wysoka -- wymaga auth | Niski |
| **Admin/Administracja** | Bardzo wysoka -- wymaga backendu | Pozniej |

### Plan na te runde -- 4 strony

#### 1. Strona Dyskusje (`/dyskusje`)
- Sekcja hero z tytulem i opisem
- Siatka 10 kanalow tematycznych (Spinning, Karpiowanie, Feeder, Method feeder, Splawik, Muchowe, Podlodowe, Morskie, Memy, Gry) -- kazdy z ikona Lucide, gradientem i opisem
- Klikniecie prowadzi do `/dyskusje/[id]` (placeholder)
- Plik: `src/pages/Dyskusje.tsx`

#### 2. Strona Forum (`/forum`)
- Pasek wyszukiwania + filtry sortowania (Popularne, Najnowsze, Najwiecej komentarzy, Wyrozniaj)
- Lista mockowanych watkow (PostCard) z: avatar, autor, data, tytul, tresc, tagi, liczba lajkow i komentarzy
- Przycisk "Utworz watek" (mock)
- Plik: `src/pages/Forum.tsx`

#### 3. Strona Galeria (`/galeria`)
- Pasek kategorii (Wszystkie, Lowiska, Ryby, Sprzet, Przyroda)
- Grid zdjec placeholder z overlayem (tytul, autor, lajki)
- Prosty lightbox modal po kliknieciu
- Plik: `src/pages/Galeria.tsx`

#### 4. Strona Odzyskaj haslo (`/odzyskaj-haslo`)
- Formularz z polem email
- Stany: idle, submitting, success (z potwierdzeniem wyslania)
- Obsluga bledow (brak emaila, niepoprawny format)
- Styl identyczny z Logowanie/Rejestracja
- Plik: `src/pages/OdzyskajHaslo.tsx`

#### 5. Routing
- Dodanie 4 nowych tras w `src/App.tsx`

### Pliki do utworzenia/edycji

| Plik | Akcja |
|------|-------|
| `src/pages/Dyskusje.tsx` | Utworz |
| `src/pages/Forum.tsx` | Utworz |
| `src/pages/Galeria.tsx` | Utworz |
| `src/pages/OdzyskajHaslo.tsx` | Utworz |
| `src/App.tsx` | Dodaj 4 trasy |

