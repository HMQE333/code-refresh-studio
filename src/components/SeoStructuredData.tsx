import { useEffect } from "react";

interface SeoProps {
  title?: string;
  description?: string;
}

export default function SeoStructuredData({ title, description }: SeoProps) {
  useEffect(() => {
    if (title) document.title = `${title} — RybiaPaka.pl`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
  }, [title, description]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RybiaPaka.pl",
    url: window.location.origin,
    description: "Największa społeczność wędkarska w Polsce",
    potentialAction: {
      "@type": "SearchAction",
      target: `${window.location.origin}/szukaj?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
