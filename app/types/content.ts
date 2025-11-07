export interface Prompt {
  placeholderValues: any;
  id?: number;
  type?: string;
  name?: {
    en: string;
    pl: string;
  };
  description?: {
    en: string;
    pl: string;
  };
  template?: {
    en: string;
    pl: string;
  };
  placeholder_keys?: readonly string[]; // Zmiana na readonly
  tags?: readonly string[]; // Zmiana na readonly
  categories?: readonly string[];
}

export interface OptionItem {
  value: string;
  label?: {
    en?: string;
    pl?: string;
  };
  meta?: Record<string, unknown>;
}

export interface TagItem {
  pl: string;
  en: string;
  neg_pl: string;
  neg_en: string;
  category: string;
  nsfw: boolean;
  weight?: number; // Optional: tag weight (0-3)
  emphasis?: number; // Optional: emphasis level (0-3)
}

export type Options = Record<string, OptionItem[]>;
export type Tags = TagItem[];

export type OptionsCollection = Options;
export type TagsCollection = Tags;
export interface OptionsData {
  [key: string]: readonly OptionItem[]; // Zmiana na readonly
}
