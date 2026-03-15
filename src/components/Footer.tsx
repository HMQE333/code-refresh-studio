import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Społeczność",
    links: [
      { label: "Forum", href: "/forum" },
      { label: "Dyskusje", href: "/dyskusje" },
      { label: "Galeria", href: "/galeria" },
    ],
  },
  {
    title: "Informacje",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Informacje", href: "/informacje" },
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
            <p className="text-sm text-foreground-2 leading-relaxed">
              Największa społeczność wędkarska w Polsce. Dziel się pasją, wymieniaj doświadczenia.
            </p>
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
          <div className="flex items-center gap-4">
            <a href="mailto:kontakt@rybiapaka.pl" className="text-foreground-2 hover:text-primary transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
