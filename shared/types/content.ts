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

export interface LocalizedText {
  pl: string;
  en: string;
}

export interface Prompt {
  id: number | string;
  /** Localized display name */
  name?: LocalizedText;
  /** Localized description */
  description?: LocalizedText;
  /** Localized prompt text */
  template?: LocalizedText;
  /** Legacy flat fields (older data) */
  title?: string;
  pl?: string;
  en?: string;
  type?: string;
  placeholder_keys?: readonly string[];
  tags?: readonly string[];
  categories?: readonly string[];
  author?: string;
  createdAt?: number;
}
