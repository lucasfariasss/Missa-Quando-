import { useState, useEffect } from "react";
import { ChurchSchedule, ZonaType } from "@/types/church";
import { parseChurchData } from "@/utils/parseChurchData";
import { ChurchCard } from "@/components/ChurchCard";
import { Filters } from "@/components/Filters";
import { Loader2 } from "lucide-react";

const HAVERSINE_R = 6371; // Earth radius in km

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return HAVERSINE_R * c;
}

const FALLBACK_LAT = -7.11532;
const FALLBACK_LNG = -34.86105;

const BAIRRO_COORDS: Record<string, { lat: number; lng: number }> = {
  "tambaú": { lat: -7.1147, lng: -34.8219 },
  "tambau": { lat: -7.1147, lng: -34.8219 },
  "cabo branco": { lat: -7.1325, lng: -34.8021 },
  "bancários": { lat: -7.1691, lng: -34.8436 },
  "bancarios": { lat: -7.1691, lng: -34.8436 },
  "mangabeira": { lat: -7.1783, lng: -34.8616 },
  "bessa": { lat: -7.0656, lng: -34.8322 },
  "manaíra": { lat: -7.0931, lng: -34.8275 },
  "manaira": { lat: -7.0931, lng: -34.8275 },
  "centro": { lat: -7.1189, lng: -34.8825 },
  "torre": { lat: -7.1300, lng: -34.8647 },
  "cristo": { lat: -7.1528, lng: -34.8775 },
  "cristo redentor": { lat: -7.1528, lng: -34.8775 },
  "cruz das armas": { lat: -7.1422, lng: -34.9003 },
  "geisel": { lat: -7.1856, lng: -34.8731 },
  "valentina": { lat: -7.2100, lng: -34.8600 },
  "altiplano": { lat: -7.1425, lng: -34.8200 },
  "castelo branco": { lat: -7.1419, lng: -34.8466 },
  "brisamar": { lat: -7.1085, lng: -34.8251 },
  "miramar": { lat: -7.1158, lng: -34.8324 },
  "tambauzinho": { lat: -7.1205, lng: -34.8402 },
  "expedicionários": { lat: -7.1278, lng: -34.8504 },
  "bairro dos estados": { lat: -7.1054, lng: -34.8543 },
  "jaguaribe": { lat: -7.1287, lng: -34.8752 }
};

function getChurchMockCoordinates(church: ChurchSchedule) {
  let hash = 0;
  for (let i = 0; i < church.igreja.length; i++) {
    hash = church.igreja.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const normalBairro = church.bairro?.toLowerCase().trim();
  if (normalBairro && BAIRRO_COORDS[normalBairro]) {
    const latOffset = (Math.abs(hash) % 100) / 10000 - 0.005; 
    const lngOffset = (Math.abs(hash >> 4) % 100) / 10000 - 0.005;
    return { 
      lat: BAIRRO_COORDS[normalBairro].lat + latOffset, 
      lng: BAIRRO_COORDS[normalBairro].lng + lngOffset 
    };
  }

  // Fallback baseado na zona
  let baseLat = -7.11532;
  let baseLng = -34.86105;
  const zonaLower = church.zona?.toLowerCase();
  
  if (zonaLower === "leste") {
    baseLat = -7.1200; baseLng = -34.8250;
  } else if (zonaLower === "sul") {
    baseLat = -7.1650; baseLng = -34.8500;
  } else if (zonaLower === "norte") {
    baseLat = -7.0600; baseLng = -34.8400;
  } else if (zonaLower === "oeste") {
    baseLat = -7.1300; baseLng = -34.8900;
  }

  const latOffset = (Math.abs(hash) % 100) / 4000 - 0.0125;
  const lngOffset = (Math.abs(hash >> 4) % 100) / 4000 - 0.0125;
  return { lat: baseLat + latOffset, lng: baseLng + lngOffset };
}

const Index = () => {
  const [churches, setChurches] = useState<ChurchSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZona, setSelectedZona] = useState<ZonaType | "todas">("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<
    "missa" | "confissao" | "adoracao" | null
  >(null);
  
  const [sortByDistance, setSortByDistance] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (sortByDistance && !userLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          },
          () => {
            setUserLocation({ lat: FALLBACK_LAT, lng: FALLBACK_LNG });
          }
        );
      } else {
        setUserLocation({ lat: FALLBACK_LAT, lng: FALLBACK_LNG });
      }
    }
  }, [sortByDistance, userLocation]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await parseChurchData();
      setChurches(data);
      setLoading(false);
    };
    loadData();
  }, []);

  function hasActivityOnDay(church: ChurchSchedule, day: string) {
    return (
      church.missasSemanais[day] ||
      church.confissao[day] ||
      church.adoracao[day]
    );
  }

  const days = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

  function hasActivityType(
    church: ChurchSchedule,
    type: "missa" | "confissao" | "adoracao",
  ) {
    const activity =
      type === "missa"
        ? church.missasSemanais
        : type === "confissao"
          ? church.confissao
          : church.adoracao;

    return days.some((day) => activity[day]);
  }

  function hasActivityOnSpecificDay(
    church: ChurchSchedule,
    activity: "missa" | "confissao" | "adoracao",
    day: string,
  ) {
    const source =
      activity === "missa"
        ? church.missasSemanais
        : activity === "confissao"
          ? church.confissao
          : church.adoracao;

    const value = source[day];

    return value && value.trim() !== "";
  }

  const filteredChurches = churches.filter((church) => {
    const matchesZona =
      selectedZona === "todas" || church.zona === selectedZona;

    const matchesSearch =
      !searchQuery ||
      church.igreja.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.bairro.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDay = true;
    let matchesActivity = true;

    if (selectedDay && selectedActivity) {
      matchesActivity = hasActivityOnSpecificDay(
        church,
        selectedActivity,
        selectedDay,
      );
    } else if (selectedDay) {
      matchesDay = hasActivityOnDay(church, selectedDay);
    } else if (selectedActivity) {
      matchesActivity = hasActivityType(church, selectedActivity);
    }

    return matchesZona && matchesSearch && matchesDay && matchesActivity;
  });

  if (sortByDistance && userLocation) {
    filteredChurches.sort((a, b) => {
      const coordsA = (a.lat && a.lng) ? { lat: a.lat, lng: a.lng } : getChurchMockCoordinates(a);
      const coordsB = (b.lat && b.lng) ? { lat: b.lat, lng: b.lng } : getChurchMockCoordinates(b);
      
      const distA = calculateDistance(userLocation.lat, userLocation.lng, coordsA.lat, coordsA.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, coordsB.lat, coordsB.lng);
      
      a.distanceToUser = distA;
      b.distanceToUser = distB;

      return distA - distB;
    });
  } else {
    filteredChurches.forEach((c) => {
      c.distanceToUser = undefined;
    });
  }

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
                Encontre horários de Missas, Confissões e Adorações em João
                Pessoa
              </p>
            </div>

            <Filters
              selectedZona={selectedZona}
              onZonaChange={setSelectedZona}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
              selectedActivity={selectedActivity}
              onActivityChange={setSelectedActivity}
              sortByDistance={sortByDistance}
              onSortByDistanceChange={setSortByDistance}
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
              Exibindo {filteredChurches.length}{" "}
              {filteredChurches.length === 1 ? "igreja" : "igrejas"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filteredChurches.map((church) => (
                <div key={`${church.igreja}-${church.bairro}`} className="w-full">
                  <ChurchCard church={church} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Dados atualizados regularmente • Para sugestões e correções, entre
            em contato
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
