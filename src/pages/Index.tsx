import { useState, useEffect } from "react";
import { ChurchSchedule, ZonaType } from "@/types/church";
import { parseChurchData } from "@/utils/parseChurchData";
import { ChurchCard } from "@/components/ChurchCard";
import { Filters } from "@/components/Filters";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [churches, setChurches] = useState<ChurchSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZona, setSelectedZona] = useState<ZonaType | "todas">("todas");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await parseChurchData();
      setChurches(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredChurches = churches.filter(church => {
    const matchesZona = selectedZona === "todas" || church.zona === selectedZona;
    const matchesSearch = !searchQuery || 
      church.igreja.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.bairro.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesZona && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                missaquando?
              </h1>
              <p className="mt-2 text-base md:text-lg text-muted-foreground">
                Encontre horários de Missas, Confissões e Adorações em João Pessoa
              </p>
            </div>
            
            <Filters
              selectedZona={selectedZona}
              onZonaChange={setSelectedZona}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Carregando horários...</p>
            </div>
          </div>
        ) : filteredChurches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Nenhuma igreja encontrada com os filtros selecionados.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-muted-foreground text-center">
              Exibindo {filteredChurches.length} {filteredChurches.length === 1 ? 'igreja' : 'igrejas'}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChurches.map((church, index) => (
                <ChurchCard key={`${church.igreja}-${index}`} church={church} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Dados atualizados regularmente • Para sugestões e correções, entre em contato</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
