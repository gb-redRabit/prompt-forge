export interface LocalizedText {
  en?: string;
  pl?: string;
}

export interface PromptTemplate {
  id?: number | string;
  name: string | LocalizedText;
  description?: string | LocalizedText;
  category?: string;
  categories?: string[];
  tags?: string[];
  content: string | LocalizedText;
  placeholder_keys?: string[];
  placeholders?: Record<string, any>;
  difficulty?: "easy" | "medium" | "hard";
  estimatedTime?: number;
  examples?: string[];
  tips?: string | LocalizedText;
  relatedPrompts?: string[];
  author?: string;
  version?: string;
  updatedAt?: string;
  featured?: boolean;
  premium?: boolean;
}

export interface PromptCategory {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  icon: string;
  count?: number;
}

export interface PromptVariable {
  key: string;
  label: LocalizedText;
  type: "text" | "textarea" | "number" | "select" | "multiselect";
  required?: boolean;
  default?: string | number;
  options?: Array<{
    value: string;
    label: LocalizedText;
  }>;
  placeholder?: LocalizedText;
  description?: LocalizedText;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: LocalizedText;
  };
}

export interface PromptExecution {
  id: string;
  templateId?: string | number;
  variables: Record<string, any>;
  result: string;
  timestamp: number;
  duration?: number;
  tokens?: number;
  model?: string;
}
