export interface TagItem {
  pl: string;
  en: string;
  category: string;
  nsfw?: boolean;
  neg_pl?: string;
  neg_en?: string;
  weight?: number;
  emphasis?: number;
  custom?: boolean;
}

export interface OptionItem {
  id: string;
  pl: string;
  en: string;
  category: string;
  value?: string;
}

export interface Prompt {
  id: string;
  title: string;
  pl: string;
  en: string;
  tags?: string[];
  categories?: string[];
  author?: string;
  createdAt: number;
}
