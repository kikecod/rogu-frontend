import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import logoRogu from "../../assets/logo_rogu.png";
export const Footer = () => {
  return (
    <footer
      role="contentinfo"
      className="bg-background text-foreground mt-auto border-t border-border"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo de la marca */}
              <img
                src={logoRogu}
                alt="Logo ROGÜ"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white dark:bg-transparent"
                draggable={false}
              />
              <span className="font-display font-bold text-2xl text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[hsl(var(--primary))] dark:to-[hsl(var(--accent))]">
                ROGÜ
              </span>
            </div>

            <p className="text-muted-foreground max-w-md leading-relaxed">
              ROGÜ es la plataforma líder para reservar espacios deportivos.
              Conectamos deportistas con las mejores canchas de la ciudad.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg p-1 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg p-1 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg p-1 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Deportes */}
          <nav aria-label="Deportes">
            <h3 className="font-semibold text-foreground mb-4">Deportes</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/venues?sport=soccer"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Fútbol
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?sport=basketball"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Básquetbol
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?sport=tennis"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Tenis
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?sport=volleyball"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Voleibol
                </Link>
              </li>
            </ul>
          </nav>

          {/* Empresa */}
          <nav aria-label="Empresa">
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Términos
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded px-1"
                >
                  Privacidad
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-10 pt-8 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} ROGÜ. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};