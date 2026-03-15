import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BanNotice from "@/components/BanNotice";
import SeoStructuredData from "@/components/SeoStructuredData";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Logowanie from "./pages/Logowanie.tsx";
import Rejestracja from "./pages/Rejestracja.tsx";
import Faq from "./pages/Faq.tsx";
import Kontakt from "./pages/Kontakt.tsx";
import Informacje from "./pages/Informacje.tsx";
import Regulamin from "./pages/Regulamin.tsx";
import PolitykaPrywatnosci from "./pages/PolitykaPrywatnosci.tsx";
import Dyskusje from "./pages/Dyskusje.tsx";
import ChannelChat from "./pages/ChannelChat.tsx";
import Forum from "./pages/Forum.tsx";
import ThreadDetail from "./pages/ThreadDetail.tsx";
import Galeria from "./pages/Galeria.tsx";
import OdzyskajHaslo from "./pages/OdzyskajHaslo.tsx";
import ResetHasla from "./pages/ResetHasla.tsx";
import ZglosProblem from "./pages/ZglosProblem.tsx";
import Odwolanie from "./pages/Odwolanie.tsx";
import ErrorAuth from "./pages/ErrorAuth.tsx";
import Profil from "./pages/Profil.tsx";
import Szukaj from "./pages/Szukaj.tsx";
import Admin from "./pages/Admin.tsx";
import Wiadomosci from "./pages/Wiadomosci.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/logowanie" element={<PageTransition><Logowanie /></PageTransition>} />
        <Route path="/rejestracja" element={<PageTransition><Rejestracja /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
        <Route path="/kontakt" element={<PageTransition><Kontakt /></PageTransition>} />
        <Route path="/informacje" element={<PageTransition><Informacje /></PageTransition>} />
        <Route path="/regulamin" element={<PageTransition><Regulamin /></PageTransition>} />
        <Route path="/polityka-prywatnosci" element={<PageTransition><PolitykaPrywatnosci /></PageTransition>} />
        <Route path="/dyskusje" element={<PageTransition><Dyskusje /></PageTransition>} />
        <Route path="/dyskusje/:channelId" element={<PageTransition><ChannelChat /></PageTransition>} />
        <Route path="/forum" element={<PageTransition><Forum /></PageTransition>} />
        <Route path="/forum/:threadId" element={<PageTransition><ThreadDetail /></PageTransition>} />
        <Route path="/galeria" element={<PageTransition><Galeria /></PageTransition>} />
        <Route path="/odzyskaj-haslo" element={<PageTransition><OdzyskajHaslo /></PageTransition>} />
        <Route path="/reset-hasla" element={<PageTransition><ResetHasla /></PageTransition>} />
        <Route path="/zglos-problem" element={<PageTransition><ZglosProblem /></PageTransition>} />
        <Route path="/odwolanie" element={<PageTransition><Odwolanie /></PageTransition>} />
        <Route path="/errorauth" element={<PageTransition><ErrorAuth /></PageTransition>} />
        <Route path="/profil" element={<PageTransition><Profil /></PageTransition>} />
        <Route path="/profil/:username" element={<PageTransition><Profil /></PageTransition>} />
        <Route path="/szukaj" element={<PageTransition><Szukaj /></PageTransition>} />
        <Route path="/wiadomosci" element={<PageTransition><Wiadomosci /></PageTransition>} />
        <Route path="/administracja" element={<PageTransition><Admin /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SeoStructuredData
            title="Społeczność wędkarska"
            description="RybiaPaka.pl — największa społeczność wędkarska w Polsce. Forum, galeria, dyskusje na żywo."
          />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <BanNotice />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
