import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "../../lib/utils";
import { buttonVariants } from "../../components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * Tone controls how we apply dark styles.
   * - "system": follow Tailwind's `dark` class on root (default)
   * - "dark": force dark tones for this instance only
   * - "light": force light tones for this instance only
   */
  tone?: "system" | "dark" | "light";
  /** Optional border and elevation around the calendar. */
  framed?: boolean;
};

// Chevron personalizado para v9 (reemplaza IconLeft/IconRight de v8)
function LucideChevron(props: {
  className?: string;
  orientation?: "up" | "down" | "left" | "right";
  size?: number;
  disabled?: boolean;
}) {
  const cls = cn(
    "h-4 w-4",
    // mejor contraste en dark
    "text-foreground/80 dark:text-foreground",
    props.className
  );
  if (props.orientation === "left") return <ChevronLeft className={cls} />;
  if (props.orientation === "right") return <ChevronRight className={cls} />;
  return <span className={cls} aria-hidden />;
}

function Wrapper({
  tone = "system",
  framed = false,
  className,
  children,
}: React.PropsWithChildren<{
  tone?: "system" | "dark" | "light";
  framed?: boolean;
  className?: string;
}>) {
  const toneClass = tone === "dark" ? "dark" : tone === "light" ? "force-light" : undefined;
  return (
    <div
      className={cn(
        toneClass,
        framed &&
          cn(
            "rounded-2xl border p-2",
            "border-border/60 bg-card/80 backdrop-blur",
            "shadow-sm dark:border-border/40 dark:bg-neutral-950/70"
          ),
        className
      )}
    >
      {children}
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  tone = "system",
  framed = false,
  ...props
}: CalendarProps) {
  // Trae los nombres por defecto de v9 y sobreescribe solo lo que necesitas
  const defaults = getDefaultClassNames();

  return (
    <Wrapper tone={tone} framed={framed} className={className}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          "p-3",
          // base con buen contraste y fondo en popover
          "bg-popover text-popover-foreground rounded-xl border border-border shadow-md"
        )}
        classNames={{
          ...defaults,

          // layout
          months: "flex flex-col sm:flex-row gap-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: cn("text-sm font-semibold", "text-foreground/90 dark:text-foreground"),
          nav: "space-x-1 flex items-center",

          // botones de navegación (más visibles en dark)
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-90 hover:opacity-100",
            "border-border/70 dark:border-border/60",
            "hover:bg-accent/50 dark:hover:bg-accent/40"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",

          // tabla/encabezados
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: cn(
            "rounded-md w-9 font-medium text-[0.8rem]",
            "text-foreground/80 dark:text-foreground/90"
          ),
          row: "flex w-full mt-2",

          // ⚠️ Nombres v9
          day: cn(
            "h-9 w-9 text-center text-sm p-0 relative",
            "first:[&:has([aria-selected])]:rounded-l-md",
            "last:[&:has([aria-selected])]:rounded-r-md",
            "[&:has([aria-selected].outside)]:bg-accent/40",
            "[&:has([aria-selected])]:bg-accent/60"
          ),
          day_button: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            // asegurar texto visible en dark
            "text-popover-foreground",
            // estados accesibles
            "hover:bg-accent/40 dark:hover:bg-accent/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
          ),
          range_end: "range_end",
          selected: cn(
            "bg-primary text-primary-foreground",
            "hover:bg-primary hover:text-primary-foreground",
            "focus:bg-primary focus:text-primary-foreground",
            // borde suave para mejorar contraste en fondos oscuros
            "ring-1 ring-primary/60"
          ),
          today: cn(
            "bg-accent text-accent-foreground",
            // halo sutil para distinguir hoy en dark
            "ring-1 ring-primary/40"
          ),
          outside: cn(
            // aumentar contraste y evitar opacidad excesiva
            "text-muted-foreground/80 opacity-100",
            "aria-selected:bg-accent/40 aria-selected:text-muted-foreground"
          ),
          disabled: "text-muted-foreground/50 opacity-70",
          range_middle: "aria-selected:bg-accent/80 aria-selected:text-accent-foreground",
          hidden: "invisible",

          // permite que sigas pasando overrides desde fuera
          ...classNames,
        }}
        components={{
          Chevron: LucideChevron,
        }}
        {...props}
      />
    </Wrapper>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };