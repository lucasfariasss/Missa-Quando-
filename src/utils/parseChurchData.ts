import { supabase } from '@/integrations/supabase/client';
import { ChurchSchedule } from '@/types/church';

export const parseChurchData = async (): Promise<ChurchSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('churches')
      .select('*')
      .order('igreja');

    if (error) {
      console.error('Error fetching church data:', error);
      return [];
    }

    if (!data) return [];

    return data.map((row) => ({
      igreja: row.igreja,
      bairro: row.bairro || '',
      zona: row.zona || '',
      contatos: row.contatos || '',
      instagram: row.instagram || '',
      missasSemanais: {
        seg: row.missa_seg || undefined,
        ter: row.missa_ter || undefined,
        qua: row.missa_qua || undefined,
        qui: row.missa_qui || undefined,
        sex: row.missa_sex || undefined,
        sab: row.missa_sab || undefined,
        dom: row.missa_dom || undefined,
      },
      confissao: {
        seg: row.confissao_seg || undefined,
        ter: row.confissao_ter || undefined,
        qua: row.confissao_qua || undefined,
        qui: row.confissao_qui || undefined,
        sex: row.confissao_sex || undefined,
        sab: row.confissao_sab || undefined,
        dom: row.confissao_dom || undefined,
      },
      adoracao: {
        seg: row.adoracao_seg || undefined,
        ter: row.adoracao_ter || undefined,
        qua: row.adoracao_qua || undefined,
        qui: row.adoracao_qui || undefined,
        sex: row.adoracao_sex || undefined,
        sab: row.adoracao_sab || undefined,
        dom: row.adoracao_dom || undefined,
      },
    }));
  } catch (error) {
    console.error('Error fetching church data:', error);
    return [];
  }
};
