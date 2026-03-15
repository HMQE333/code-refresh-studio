import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Megaphone, MessageSquare, Images, Menu, X, Search, Fish } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Strona Główna", href: "/", icon: Home },
  { label: "Dyskusje", href: "/dyskusje", icon: Megaphone },
  { label: "Forum", href: "/forum", icon: MessageSquare },
  { label: "Galeria", href: "/galeria", icon: Images },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <Link to="/" className="flex items-center gap-2 group">
            <Fish className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-lg font-semibold text-foreground">
              Rybia<span className="text-primary">Paka</span>
              <span className="text-foreground-2 text-xs">.pl</span>
            </span>
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
