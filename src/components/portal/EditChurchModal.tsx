import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

interface Church {
  id: string;
  igreja: string;
  bairro: string;
  zona: string;
  contatos: string | null;
  instagram: string | null;
  missa_seg: string | null;
  missa_ter: string | null;
  missa_qua: string | null;
  missa_qui: string | null;
  missa_sex: string | null;
  missa_sab: string | null;
  missa_dom: string | null;
  confissao_seg: string | null;
  confissao_ter: string | null;
  confissao_qua: string | null;
  confissao_qui: string | null;
  confissao_sex: string | null;
  confissao_sab: string | null;
  confissao_dom: string | null;
  adoracao_seg: string | null;
  adoracao_ter: string | null;
  adoracao_qua: string | null;
  adoracao_qui: string | null;
  adoracao_sex: string | null;
  adoracao_sab: string | null;
  adoracao_dom: string | null;
}

interface EditChurchModalProps {
  church: Church;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
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

export const EditChurchModal = ({ church, isOpen, onClose, onSaved }: EditChurchModalProps) => {
  const [form, setForm] = useState<Church>({ ...church });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ ...church });
  }, [church]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Church, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value || null }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, ...updateData } = form;
    const { error } = await supabase.from("churches").update(updateData).eq("id", id);

    if (error) {
      toast.error("Erro ao salvar alterações.");
      console.error(error);
    } else {
      toast.success("Igreja atualizada com sucesso!");
      onSaved();
      onClose();
    }
    setSaving(false);
  };

  const renderField = (label: string, field: keyof Church) => (
    <div key={field}>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type="text"
        value={form[field] ?? ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );

  const renderScheduleSection = (title: string, prefix: "missa" | "confissao" | "adoracao") => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-primary">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DAYS.map((day) => {
          const field = `${prefix}_${day.key}` as keyof Church;
          return (
            <div key={field}>
              <label className="block text-xs text-muted-foreground mb-0.5">{day.label}</label>
              <input
                type="text"
                value={form[field] ?? ""}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder="—"
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">Editar Igreja</h3>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Dados básicos */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Dados Básicos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("Nome da Igreja", "igreja")}
              {renderField("Bairro", "bairro")}
              {renderField("Zona", "zona")}
              {renderField("Contatos", "contatos")}
              {renderField("Instagram", "instagram")}
            </div>
          </div>

          {/* Horários */}
          {renderScheduleSection("Horários de Missas", "missa")}
          {renderScheduleSection("Horários de Confissão", "confissao")}
          {renderScheduleSection("Horários de Adoração", "adoracao")}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-card px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
