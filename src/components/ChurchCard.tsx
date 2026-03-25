import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChurchSchedule } from "@/types/church";
import { Church, MapPin, Instagram, Phone } from "lucide-react";

interface ChurchCardProps {
  church: ChurchSchedule;
}

const DAYS = [
  { key: "seg", label: "Segunda" },
  { key: "ter", label: "Terça" },
  { key: "qua", label: "Quarta" },
  { key: "qui", label: "Quinta" },
  { key: "sex", label: "Sexta" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
];

const ZONE_LABELS: Record<string, string> = {
  leste: "Leste",
  norte: "Norte",
  oeste: "Oeste",
  sul: "Sul",
};

export const ChurchCard = ({ church }: ChurchCardProps) => {
  const hasAnySchedule =
    DAYS.some((day) => church.missasSemanais?.[day.key]) ||
    DAYS.some((day) => church.confissao?.[day.key]) ||
    DAYS.some((day) => church.adoracao?.[day.key]);

  const renderScheduleSection = (
    title: string,
    schedule: Record<string, string | undefined>,
    icon: React.ReactNode,
  ) => {
    const hasSchedule = DAYS.some(
      (day) => schedule[day.key as keyof typeof schedule],
    );
    if (!hasSchedule) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          {icon}
          <span>{title}</span>
        </div>
        <div className="space-y-1 pl-6">
          {DAYS.map((day) => {
            const time = schedule[day.key as keyof typeof schedule];
            if (!time) return null;
            return (
              <div key={day.key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{day.label}:</span>
                <span className="font-medium text-foreground">{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="break-inside-avoid overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elevated)] border-border/50">
      <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="flex items-start gap-2 text-lg leading-tight">
              <Church className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
              <span>{church.igreja}</span>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                {church.bairro}
              </Badge>
              {church.zona && (
                <Badge variant="secondary" className="gap-1">
                  {ZONE_LABELS[church.zona] || church.zona}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {(church.contatos || church.instagram) && (
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-muted-foreground">
            {church.contatos && (
              <a
                href={`tel:${church.contatos}`}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Phone className="h-3 w-3" />
                {church.contatos}
              </a>
            )}
            {church.instagram && (
              <a
                href={
                  church.instagram.startsWith("http")
                    ? church.instagram
                    : `https://instagram.com/${church.instagram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Instagram className="h-3 w-3" />@
                {church.instagram.replace(/[@\[\]()]/g, "")}
              </a>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className={hasAnySchedule ? "space-y-6 pt-6" : "pt-4 pb-4"}>
        {hasAnySchedule ? (
          <>
            {renderScheduleSection(
              "MISSAS",
              church.missasSemanais,
              <Church className="h-4 w-4" />,
            )}

            {renderScheduleSection(
              "CONFISSÃO",
              church.confissao,
              <span className="text-xs">🙏</span>,
            )}

            {renderScheduleSection(
              "ADORAÇÃO",
              church.adoracao,
              <span className="text-xs">✨</span>,
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Horários ainda não informados
          </p>
        )}
      </CardContent>
    </Card>
  );
};