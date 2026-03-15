import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Społeczność",
    links: [
      { label: "Forum", href: "/forum" },
      { label: "Dyskusje", href: "/dyskusje" },
      { label: "Galeria", href: "/galeria" },
      { label: "Szukaj", href: "/szukaj" },
    ],
  },
  {
    title: "Informacje",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Informacje", href: "/informacje" },
      { label: "Odwołanie", href: "/odwolanie" },
    ],
  },
  {
    title: "Prawne",
    links: [
      { label: "Regulamin", href: "/regulamin" },
      { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
      { label: "Zgłoś problem", href: "/zglos-problem" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img src="/logo.png" alt="RybiaPaka.pl" className="h-6" />
            </Link>
            <p className="text-sm text-foreground-2 leading-relaxed mb-4">
              Największa społeczność wędkarska w Polsce. Dziel się pasją, wymieniaj doświadczenia.
            </p>
            <div className="flex items-center gap-3">
              <a href="mailto:rybiapaka@gmail.com" className="text-foreground-2 hover:text-primary transition-colors" title="E-mail">
                <Mail size={16} />
              </a>
              <a href="https://discord.gg/rybiapaka" target="_blank" rel="noopener noreferrer" className="text-foreground-2 hover:text-primary transition-colors" title="Discord">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
              </a>
              <a href="https://facebook.com/rybiapaka" target="_blank" rel="noopener noreferrer" className="text-foreground-2 hover:text-primary transition-colors" title="Facebook">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-foreground-2 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground-2">
            © {new Date().getFullYear()} RybiaPaka.pl — Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-xs text-foreground-2">
            Stworzone z ❤️ dla polskich wędkarzy
          </p>
        </div>
      </div>
    </footer>
  );
}
