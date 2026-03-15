import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index.tsx";
import Logowanie from "./pages/Logowanie.tsx";
import Rejestracja from "./pages/Rejestracja.tsx";
import Faq from "./pages/Faq.tsx";
import Kontakt from "./pages/Kontakt.tsx";
import Informacje from "./pages/Informacje.tsx";
import Regulamin from "./pages/Regulamin.tsx";
import PolitykaPrywatnosci from "./pages/PolitykaPrywatnosci.tsx";
import Dyskusje from "./pages/Dyskusje.tsx";
import Forum from "./pages/Forum.tsx";
import Galeria from "./pages/Galeria.tsx";
import OdzyskajHaslo from "./pages/OdzyskajHaslo.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/logowanie" element={<Logowanie />} />
              <Route path="/rejestracja" element={<Rejestracja />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/informacje" element={<Informacje />} />
              <Route path="/regulamin" element={<Regulamin />} />
              <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
              <Route path="/dyskusje" element={<Dyskusje />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/odzyskaj-haslo" element={<OdzyskajHaslo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
