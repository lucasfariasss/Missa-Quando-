import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

interface Editor {
  id: string;
  email: string;
}

interface DelegationModalProps {
  churchId: string;
  churchName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DelegationModal = ({ churchId, churchName, isOpen, onClose }: DelegationModalProps) => {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [selectedEditor, setSelectedEditor] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAvailableEditors = async () => {
      setLoading(true);
      setSelectedEditor("");

      // Buscar editores que ainda NÃO estão vinculados a esta igreja
      const { data: allEditors, error: editorsError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("role", "editor");

      if (editorsError) {
        console.error(editorsError);
        toast.error("Erro ao carregar editores.");
        setLoading(false);
        return;
      }

      const { data: existingDelegations, error: delegationsError } = await supabase
        .from("church_editors")
        .select("user_id")
        .eq("church_id", churchId);

      if (delegationsError) {
        console.error(delegationsError);
        toast.error("Erro ao verificar delegações existentes.");
        setLoading(false);
        return;
      }

      const delegatedIds = new Set((existingDelegations || []).map((d) => d.user_id));
      const available = (allEditors || []).filter((e) => !delegatedIds.has(e.id));

      setEditors(available);
      setLoading(false);
    };

    fetchAvailableEditors();
  }, [isOpen, churchId]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedEditor) {
      toast.error("Selecione um editor.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("church_editors")
      .insert({ user_id: selectedEditor, church_id: churchId });

    if (error) {
      // Fallback: tratar erro de UNIQUE constraint
      if (error.code === "23505") {
        toast.error("Este usuário já possui acesso a esta igreja.");
      } else {
        toast.error("Erro ao delegar acesso.");
        console.error(error);
      }
    } else {
      toast.success("Acesso delegado com sucesso!");
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Delegar Edição</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{churchName}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : editors.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum editor disponível para delegação.
            </p>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Selecione o editor
              </label>
              <select
                value={selectedEditor}
                onChange={(e) => setSelectedEditor(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Escolha um editor...</option>
                {editors.map((editor) => (
                  <option key={editor.id} value={editor.id}>
                    {editor.email}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving || loading || editors.length === 0 || !selectedEditor}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
