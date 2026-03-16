import { useEffect } from "react";

interface SeoProps {
  title?: string;
  description?: string;
}

const SITE_NAME = "RybiaPaka.pl";
const SITE_ALTERNATE_NAME = "Rybia Paka";
const SITE_LOGO_PATH = "/logo.png";

export default function SeoStructuredData({ title, description }: SeoProps) {
  useEffect(() => {
    if (title) document.title = `${title} — ${SITE_NAME}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
  }, [title, description]);

  const siteUrl = window.location.origin;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAME,
        url: siteUrl,
        logo: `${siteUrl}${SITE_LOGO_PATH}`,
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl,
        description: "Największa społeczność wędkarska w Polsce",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/szukaj?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
