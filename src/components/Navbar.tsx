import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Megaphone, MessageSquare, Images, Search, Menu, X, User, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
};

const navItems: NavItem[] = [
  { label: "Strona Główna", href: "/", icon: Home },
  { label: "Dyskusje", href: "/dyskusje", icon: Megaphone },
  { label: "Forum", href: "/forum", icon: MessageSquare },
  { label: "Galeria", href: "/galeria", icon: Images },
  { label: "Szukaj", href: "/szukaj", icon: Search },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin, isModerator } = useUserRole();

  const isActive = (href: string) => {
    return href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src="/logo.png" alt="RybiaPaka.pl" className="h-7 transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-background-3 text-primary"
                      : "text-foreground-2 hover:text-primary hover:bg-background-3/60"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Auth buttons desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {(isAdmin || isModerator) && (
                  <Link
                    to="/administracja"
                    className="flex items-center gap-2 text-sm font-medium text-foreground-2 hover:text-foreground transition-colors"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profil"
                  className="flex items-center gap-2 text-sm font-medium text-foreground-2 hover:text-foreground transition-colors"
                >
                  <User size={16} />
                  Profil
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm font-medium text-foreground-2 hover:text-foreground transition-colors"
                >
                  <LogOut size={16} />
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/logowanie"
                  className="text-sm font-medium text-foreground-2 hover:text-foreground transition-colors"
                >
                  Zaloguj się
                </Link>
                <Link
                  to="/rejestracja"
                  className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:brightness-110 transition-all"
                >
                  Dołącz teraz
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-foreground-2 hover:text-foreground hover:bg-background-3 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background-3/95 backdrop-blur-xl border-t border-border">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                    active
                      ? "bg-background-4 text-primary"
                      : "text-foreground-2 hover:text-primary hover:bg-background-4/60"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {user ? (
                <>
                  {(isAdmin || isModerator) && (
                    <Link
                      to="/administracja"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-sm font-medium text-foreground-2 hover:text-foreground px-3 py-3 rounded-xl transition-colors"
                    >
                      <Shield size={18} />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profil"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium text-foreground-2 hover:text-foreground px-3 py-3 rounded-xl transition-colors"
                  >
                    <User size={18} />
                    Profil
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-3 text-sm font-medium text-foreground-2 hover:text-foreground px-3 py-3 rounded-xl transition-colors text-left"
                  >
                    <LogOut size={18} />
                    Wyloguj się
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/logowanie"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-center font-medium text-foreground-2 hover:text-foreground py-2 transition-colors"
                  >
                    Zaloguj się
                  </Link>
                  <Link
                    to="/rejestracja"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-center font-medium bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:brightness-110 transition-all"
                  >
                    Dołącz teraz
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
