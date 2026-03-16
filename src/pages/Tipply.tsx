import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TIPPLY_URL = "https://tipply.pl/@rybiapaka";

export default function Tipply() {
  const navigate = useNavigate();

  useEffect(() => {
    window.location.href = TIPPLY_URL;
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-muted-foreground">Przekierowywanie do Tipply...</p>
        <a
          href={TIPPLY_URL}
          className="text-sm text-primary hover:underline"
        >
          Kliknij tutaj, jeśli nie nastąpiło automatyczne przekierowanie
        </a>
      </div>
    </div>
  );
}
