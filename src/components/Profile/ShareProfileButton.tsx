import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareProfileButtonProps {
  username: string;
}

export default function ShareProfileButton({ username }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      const url = `${window.location.origin}/profil/${encodeURIComponent(username)}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <Button variant="outline" size="sm" onClick={copy} className="gap-1.5">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
      {copied ? "Skopiowano!" : "Udostępnij"}
    </Button>
  );
}
