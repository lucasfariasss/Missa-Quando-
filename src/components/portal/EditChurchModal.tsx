import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, X, Upload, Trash2, Image as ImageIcon } from "lucide-react";

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
  noticias: string | null;
  image_url: string | null;
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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({ ...church });
  }, [church]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Church, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value || null }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validação básica
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione um arquivo de imagem.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 2MB.");
        return;
      }

      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${church.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("church-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("church-photos")
        .getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image_url: null }));
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

          {/* Gerenciamento de Imagem */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Foto da Igreja</h4>
            <div className="flex flex-col gap-4">
              {form.image_url ? (
                <div className="relative group w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                  <img 
                    src={form.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={handleRemoveImage}
                      className="p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform"
                      title="Remover imagem"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Clique para fazer upload da foto</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Imagens até 2MB</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Horários */}
          {renderScheduleSection("Horários de Missas", "missa")}
          {renderScheduleSection("Horários de Confissão", "confissao")}
          {renderScheduleSection("Horários de Adoração", "adoracao")}

          {/* Notícias */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Notícias da Semana</h4>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Atualizações e avisos da paróquia</label>
              <textarea
                value={form.noticias ?? ""}
                onChange={(e) => handleChange("noticias", e.target.value)}
                placeholder="Ex: Teremos missa extra na quarta-feira às 19h..."
                rows={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
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
