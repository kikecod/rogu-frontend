import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ArrowLeft,
  FileText,
  Shield,
  AlertCircle,
  CreditCard,
  ClipboardList,
  ServerCog,
  Copyright,
  Gavel,
  Newspaper,
  Printer
} from "lucide-react";

/**
 * Página de Términos y Condiciones (versión mejorada)
 *
 * ✅ Accesible y semántica (main, header, nav, article, section)
 * ✅ ÍNDICE con enlaces ancla y resaltado del apartado activo
 * ✅ Anclas estables (ids) para compartir secciones específicas
 * ✅ Botón de impresión
 * ✅ Estructura basada en datos para facilitar mantenimientos
 * ✅ Marcado schema.org/TermsOfService para SEO
 */

type TermsProps = {
  /** Texto de última actualización. Ej: "Enero 2024" */
  lastUpdated?: string;
};

const sections = [
  {
    id: "aceptacion",
    title: "1. Aceptación de los Términos",
    icon: Shield,
    content: (
      <p className="text-muted-foreground">
        Al acceder y utilizar la plataforma <strong>ROGÜ</strong>, usted acepta estar sujeto a estos Términos y
        Condiciones de Uso. Si no está de acuerdo con alguna parte, no debe utilizar el servicio.
      </p>
    ),
  },
  {
    id: "servicio",
    title: "2. Descripción del Servicio",
    icon: ClipboardList,
    content: (
      <>
        <p className="text-muted-foreground">
          <strong>ROGÜ</strong> es una plataforma digital que facilita la reserva de espacios deportivos. Nuestros
          servicios incluyen:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Búsqueda y visualización de canchas disponibles</li>
          <li>Reservas en línea con confirmación instantánea</li>
          <li>Procesamiento de pagos seguros</li>
          <li>Gestión de reservas y códigos QR de acceso</li>
          <li>Atención al cliente y soporte técnico</li>
        </ul>
      </>
    ),
  },
  {
    id: "cuentas",
    title: "3. Registro y Cuenta de Usuario",
    icon: ServerCog,
    content: (
      <>
        <p className="text-muted-foreground">
          Para utilizar nuestros servicios, debe crear una cuenta con información precisa y actualizada. Usted es
          responsable de:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Mantener la confidencialidad de sus credenciales</li>
          <li>Todas las actividades que ocurran bajo su cuenta</li>
          <li>Notificar uso no autorizado de inmediato</li>
          <li>Proporcionar información veraz y mantenerla al día</li>
        </ul>
      </>
    ),
  },
  {
    id: "pagos",
    title: "4. Reservas y Pagos",
    icon: CreditCard,
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">4.1 Proceso de Reserva</h4>
          <p className="text-muted-foreground">
            Las reservas se confirman una vez completado el pago. Los precios muestran impuestos y cargos aplicables
            cuando corresponda.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">4.2 Políticas de Cancelación</h4>
          <p className="text-muted-foreground">
            Puede cancelar con al menos <strong>2 horas</strong> de anticipación para reembolso total. Cancelaciones tardías
            pueden generar penalización según la política del establecimiento.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">4.3 Métodos de Pago</h4>
          <p className="text-muted-foreground">
            Aceptamos tarjetas de crédito/débito y pagos digitales. Los pagos se procesan de forma segura a través de
            proveedores certificados que cumplen estándares PCI-DSS.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "uso",
    title: "5. Uso de la Plataforma",
    icon: FileText,
    content: (
      <>
        <p className="text-muted-foreground">Al utilizar ROGÜ, usted se compromete a:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Usar el servicio solo para fines legítimos</li>
          <li>No interferir con el funcionamiento de la plataforma</li>
          <li>Respetar los derechos de otros usuarios</li>
          <li>Cumplir las reglas específicas de cada establecimiento</li>
          <li>No realizar actividades fraudulentas o engañosas</li>
        </ul>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "6. Responsabilidades y Limitaciones",
    icon: AlertCircle,
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">6.1 Limitación de Responsabilidad</h4>
          <p className="text-muted-foreground">
            ROGÜ actúa como intermediario entre usuarios y propietarios de canchas. No somos responsables por las
            condiciones físicas de las instalaciones ni por lesiones que puedan ocurrir durante su uso.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">6.2 Disponibilidad del Servicio</h4>
          <p className="text-muted-foreground">
            Trabajamos para mantener disponibilidad continua, pero no garantizamos servicio ininterrumpido. Podremos
            realizar mantenimientos programados con aviso razonable.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "propiedad",
    title: "7. Propiedad Intelectual",
    icon: Copyright,
    content: (
      <p className="text-muted-foreground">
        Todos los contenidos de la plataforma, incluyendo textos, gráficos, logos, iconos, imágenes, clips de audio,
        descargas digitales y software, son propiedad de ROGÜ o de sus proveedores y están protegidos por leyes de
        derechos de autor y otras normas aplicables.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "8. Modificaciones de los Términos",
    icon: Newspaper,
    content: (
      <p className="text-muted-foreground">
        Podemos modificar estos términos en cualquier momento. Las modificaciones entran en vigor al publicarse en la
        plataforma. El uso continuado del servicio implica aceptación de las actualizaciones.
      </p>
    ),
  },
  {
    id: "jurisdiccion",
    title: "9. Ley Aplicable y Jurisdicción",
    icon: Gavel,
    content: (
      <p className="text-muted-foreground">
        Estos términos se rigen por las leyes del país o jurisdicción donde opere el establecimiento reservado, salvo
        que la normativa aplicable disponga lo contrario. Cualquier disputa se someterá a los tribunales competentes de
        dicha jurisdicción.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "10. Contacto",
    icon: AlertCircle,
    content: (
      <div className="space-y-1">
        <p className="text-muted-foreground">
          Si tiene preguntas sobre estos Términos y Condiciones, contáctenos en
          {" "}
          <a href="mailto:legal@rogu.com" className="text-primary hover:underline">
            legal@rogu.com
          </a>
          .
        </p>
        <p className="text-xs text-muted-foreground">
          *Este documento es informativo y no constituye asesoramiento legal.
        </p>
      </div>
    ),
  },
] as const;

const Terms: React.FC<TermsProps> = ({ lastUpdated = "Enero 2024" }) => {
  // Resalta el apartado activo en el índice según el hash de la URL
  const [activeId, setActiveId] = React.useState<string>(
    typeof window !== "undefined" ? window.location.hash.replace("#", "") : sections[0].id
  );

  React.useEffect(() => {
    const onHashChange = () => setActiveId(window.location.hash.replace("#", ""));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <main className="min-h-screen bg-background" itemScope itemType="https://schema.org/TermsOfService">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="Volver al inicio">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint} aria-label="Imprimir términos">
              <Printer className="w-4 h-4 mr-2" /> Imprimir
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary-foreground" aria-hidden />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-2" itemProp="name">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-muted-foreground" itemProp="dateModified">
            Última actualización: {lastUpdated}
          </p>
        </section>

        {/* Layout con índice + contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Índice */}
          <nav
            className="lg:col-span-4 xl:col-span-3 h-max sticky top-6 bg-card border rounded-2xl p-4"
            aria-label="Contenido"
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Contenido</h2>
            <ol className="space-y-1">
              {sections.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={[
                      "block rounded-md px-3 py-2 text-sm transition",
                      activeId === id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    ].join(" ")}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Contenido */}
          <article className="lg:col-span-8 xl:col-span-9 space-y-8" itemProp="termsOfService">
            {sections.map(({ id, title, icon: Icon, content }) => (
              <Card id={id} key={id} className="card-modern scroll-mt-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {Icon ? <Icon className="w-5 h-5 text-primary" aria-hidden /> : null}
                    <span>{title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">{content}</CardContent>
              </Card>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
};

export default Terms;
