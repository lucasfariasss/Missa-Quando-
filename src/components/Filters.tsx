import { Search } from "lucide-react";
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
}: FiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-5xl">
      {/* Busca */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por Bairro ou Igreja..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border/60 focus:border-primary"
          />
        </div>
      </div>

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
  );
};
