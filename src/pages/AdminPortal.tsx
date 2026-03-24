import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Church, UserPlus, Edit2, Search } from "lucide-react";
import { EditChurchModal } from "@/components/portal/EditChurchModal";
import { DelegationModal } from "@/components/portal/DelegationModal";
import { ChurchSchedule } from "@/types/church";
import { Input } from "@/components/ui/input";

type Role = "super_admin" | "editor" | null;

interface DbChurch extends ChurchSchedule {
  id: string;
  [key: string]: any;
}

const AdminPortal = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<Role>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  
  const [churches, setChurches] = useState<DbChurch[]>([]);
  const [loadingChurches, setLoadingChurches] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [editingChurch, setEditingChurch] = useState<DbChurch | null>(null);
  const [delegatingChurch, setDelegatingChurch] = useState<DbChurch | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (!error && data) {
        setRole(data.role as Role);
      } else if (error) {
        console.error("Erro ao buscar a role na tabela profiles:", error);
      }
      setLoadingRole(false);
    };

    fetchRole();
  }, [user]);

  const loadChurches = async (currentRole: Role) => {
    if (!currentRole) return;
    setLoadingChurches(true);
    
    if (currentRole === "super_admin") {
      const { data, error } = await supabase
        .from("churches")
        .select("*")
        .order("igreja");
        
      if (!error && data) {
        setChurches(data as unknown as DbChurch[]);
      }
    } else if (currentRole === "editor") {
      const { data, error } = await supabase
        .from("church_editors")
        .select(`
          churches (*)
        `)
        .eq("user_id", user?.id);
        
      if (!error && data) {
        const delegated = data.map((d: any) => d.churches).filter(Boolean);
        delegated.sort((a: any, b: any) => a.igreja.localeCompare(b.igreja));
        setChurches(delegated as unknown as DbChurch[]);
      } else {
        console.error("Erro ao buscar igrejas delegadas:", error);
      }
    }
    
    setLoadingChurches(false);
  };

  useEffect(() => {
    if (role && !loadingRole) {
      loadChurches(role);
    }
  }, [role, loadingRole]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredChurches = churches.filter(c => 
    c.igreja.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.bairro.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-1">
              Logado como: <span className="font-medium text-foreground">{user?.email}</span>
              {role && (
                <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                  {role === "super_admin" ? "Super Admin" : "Editor"}
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sair
          </Button>
        </div>

        {/* Content */}
        {!role ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Acesso Restrito</h2>
            <p className="text-muted-foreground mt-2">Seu usuário não possui um perfil administrativo configurado.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar igreja por nome ou bairro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loadingChurches ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChurches.map((church) => (
                  <div key={church.id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Church className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground leading-tight">{church.igreja}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{church.bairro} • {church.zona}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-border flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setEditingChurch(church)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      
                      {role === "super_admin" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setDelegatingChurch(church)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Delegar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredChurches.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    Nenhuma igreja encontrada.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {editingChurch && (
        <EditChurchModal
          church={editingChurch as any}
          isOpen={true}
          onClose={() => setEditingChurch(null)}
          onSaved={() => {
            if (role) loadChurches(role);
          }}
        />
      )}

      {delegatingChurch && (
        <DelegationModal
          churchId={delegatingChurch.id}
          churchName={delegatingChurch.igreja}
          isOpen={true}
          onClose={() => setDelegatingChurch(null)}
        />
      )}
    </div>
  );
};

export default AdminPortal;
