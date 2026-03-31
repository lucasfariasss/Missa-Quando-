import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChurchSchedule } from "@/types/church";
import { Church, MapPin, Instagram, Phone, ScrollText, ChevronDown, ChevronUp, Navigation } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card 
      className={`break-inside-avoid overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elevated)] border-border/50 cursor-pointer ${
        isExpanded ? "shadow-[var(--shadow-elevated)] ring-1 ring-primary/20" : ""
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
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
              {church.distanceToUser !== undefined && (
                <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
                  {church.distanceToUser.toFixed(1)} km
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0 transition-transform duration-200"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
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

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <CardContent className={hasAnySchedule ? "space-y-6 pt-6 border-t border-border/30 bg-background/50" : "pt-4 pb-4 border-t border-border/30 bg-background/50"}>
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

          {church.noticias && (
            <div className="px-6 pb-6 pt-0 bg-background/50 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <ScrollText className="h-4 w-4" />
                <span>Notícias da semana</span>
              </div>
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap bg-primary/5 p-4 rounded-lg border border-primary/10">
                {church.noticias}
              </div>
            </div>
          )}

          <div className="px-6 pb-6 bg-background/50">
            <Button
              variant="default"
              className="w-full gap-2 transition-all duration-300 shadow-sm hover:shadow"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${church.igreja} ${church.bairro}`)}`, '_blank');
              }}
            >
              <Navigation className="h-4 w-4" />
              Abrir no Google Maps
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};