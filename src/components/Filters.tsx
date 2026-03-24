import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZonaType } from "@/types/church";

interface FiltersProps {
  selectedZona: ZonaType | "todas";
  onZonaChange: (zona: ZonaType | "todas") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Filters = ({ selectedZona, onZonaChange, searchQuery, onSearchChange }: FiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
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
      
      <div className="sm:w-48">
        <Select value={selectedZona} onValueChange={onZonaChange}>
          <SelectTrigger className="bg-card border-border/60 focus:border-primary">
            <SelectValue placeholder="Filtrar por Zona" />
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
    </div>
  );
};
