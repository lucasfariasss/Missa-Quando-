import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZonaType } from "@/types/church";

interface FiltersProps {
  selectedZona: ZonaType | "todas";
  onZonaChange: (zona: ZonaType | "todas") => void;

  searchQuery: string;
  onSearchChange: (query: string) => void;

  selectedDay: string | null;
  onDayChange: (day: string | null) => void;

  selectedActivity: "missa" | "confissao" | "adoracao" | null;
  onActivityChange: (
    activity: "missa" | "confissao" | "adoracao" | null,
  ) => void;

  sortByDistance: boolean;
  onSortByDistanceChange: (sort: boolean) => void;
}

export const Filters = ({
  selectedZona,
  onZonaChange,
  searchQuery,
  onSearchChange,
  selectedDay,
  onDayChange,
  selectedActivity,
  onActivityChange,
  sortByDistance,
  onSortByDistanceChange,
}: FiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-5xl">
      {/* Busca */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4 sm:mb-0 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por Bairro ou Igreja..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-card border-border/60 focus:border-primary w-full"
            />
          </div>
          <button
            onClick={() => onSortByDistanceChange(!sortByDistance)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
              sortByDistance 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card text-foreground border-border/60 hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">
              {sortByDistance ? "Ordenado por dist." : "Ordenar por dist."}
            </span>
            <span className="sm:hidden">Distância</span>
          </button>
        </div>
      </div>

      {/* Selects container */}
      <div className="flex flex-wrap gap-4 w-full sm:w-auto">
        {/* Zona */}
      <div className="sm:w-40">
        <Select value={selectedZona} onValueChange={onZonaChange}>
          <SelectTrigger className="bg-card border-border/60 focus:border-primary">
            <SelectValue placeholder="Zona" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="todas">Todas as Zonas</SelectItem>
            <SelectItem value="leste">Leste</SelectItem>
            <SelectItem value="norte">Norte</SelectItem>
            <SelectItem value="oeste">Oeste</SelectItem>
            <SelectItem value="sul">Sul</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dia */}
      <div className="sm:w-40">
        <Select
          value={selectedDay ?? "todos"}
          onValueChange={(value) =>
            onDayChange(value === "todos" ? null : value)
          }
        >
          <SelectTrigger className="bg-card border-border/60 focus:border-primary">
            <SelectValue placeholder="Dia" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="todos">Todos os dias</SelectItem>
            <SelectItem value="seg">Segunda</SelectItem>
            <SelectItem value="ter">Terça</SelectItem>
            <SelectItem value="qua">Quarta</SelectItem>
            <SelectItem value="qui">Quinta</SelectItem>
            <SelectItem value="sex">Sexta</SelectItem>
            <SelectItem value="sab">Sábado</SelectItem>
            <SelectItem value="dom">Domingo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Atividade */}
      <div className="sm:w-44">
        <Select
          value={selectedActivity ?? "todas"}
          onValueChange={(value) =>
            onActivityChange(
              value === "todas"
                ? null
                : (value as "missa" | "confissao" | "adoracao"),
            )
          }
        >
          <SelectTrigger className="bg-card border-border/60 focus:border-primary">
            <SelectValue placeholder="Atividade" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="todas">Todas atividades</SelectItem>
            <SelectItem value="missa">Missa</SelectItem>
            <SelectItem value="confissao">Confissão</SelectItem>
            <SelectItem value="adoracao">Adoração</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>
    </div>
  );
};
