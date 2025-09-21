import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Log útil para monitoreo / debugging
  useEffect(() => {
    console.error("404: route not found →", location.pathname);
    document.title = "Página no encontrada — ROGÜ";
  }, [location.pathname]);

  return (
    <main
      role="main"
      className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-20"
    >
      {/* Fondo sutil con tu gradiente */}
      <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-[0.6] pointer-events-none" />

      <section
        aria-labelledby="nf-title"
        className="w-full max-w-2xl text-center"
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-card-custom mb-6">
          <span className="text-2xl font-display">😕</span>
        </div>

        <h1
          id="nf-title"
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3"
        >
          Página no encontrada
        </h1>

        <p className="text-muted-foreground text-lg mb-2">
          No pudimos encontrar la ruta:
        </p>
        <code className="inline-block bg-card border border-border rounded-lg px-3 py-1 text-sm mb-6">
          {location.pathname}
        </code>

        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Puede que el enlace esté roto o que la página haya sido movida.
          Comprueba la URL o vuelve a la página principal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 border border-border bg-card text-foreground hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 bg-gradient-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </Link>
        </div>

        {/* Sugerencias rápidas */}
        <div className="mt-10 text-sm text-muted-foreground">
          <span>Sugerencia: </span>
          <Link
            to="/venues"
            className="underline hover:text-primary transition-colors"
          >
            Explora canchas disponibles
          </Link>
          <span> o </span>
          <Link
            to="/contact"
            className="underline hover:text-primary transition-colors"
          >
            contáctanos
          </Link>
          .
        </div>
      </section>
    </main>
  );
};

export default NotFound;
