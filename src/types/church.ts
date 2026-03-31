export interface ChurchSchedule {
  igreja: string;
  bairro: string;
  zona: string;
  contatos: string;
  instagram: string;
  noticias?: string;
  lat?: number;
  lng?: number;
  distanceToUser?: number;

  // Missas Semanais
  missasSemanais: {
    seg?: string;
    ter?: string;
    qua?: string;
    qui?: string;
    sex?: string;
    sab?: string;
    dom?: string;
  };

  // Confissão
  confissao: {
    seg?: string;
    ter?: string;
    qua?: string;
    qui?: string;
    sex?: string;
    sab?: string;
    dom?: string;
  };

  // Adoração
  adoracao: {
    seg?: string;
    ter?: string;
    qua?: string;
    qui?: string;
    sex?: string;
    sab?: string;
    dom?: string;
  };
}

export type ZonaType = "leste" | "norte" | "oeste" | "sul" | "";
