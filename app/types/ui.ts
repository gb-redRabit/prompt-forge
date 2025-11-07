/**
 * UI Components Type Definitions
 * Zgodne z Nuxt 4.12 best practices
 */

// ==================== Colors ====================
export type ColorPreset =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "purple"
  | "pink"
  | "blue"
  | "green"
  | "teal"
  | "orange";

// ==================== Variants ====================
export type Variant = "default" | "subtle" | "strong" | "bordered";
export type ButtonVariant = "solid" | "soft" | "ghost" | "outline";
export type BadgeVariant = "solid" | "soft" | "outline";

// ==================== Sizes ====================
export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type Padding = "none" | "sm" | "md" | "lg" | "xl";

// ==================== Glass Card ====================
export interface GlassCardProps {
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
  gradient?: boolean;
  border?: boolean;
  shadow?: boolean;
  rounded?: string;
}

// ==================== Glass Button ====================
export interface GlassButtonProps {
  variant?: ButtonVariant;
  size?: Exclude<Size, "xs">;
  color?: Exclude<
    ColorPreset,
    "purple" | "pink" | "blue" | "green" | "teal" | "orange"
  >;
  icon?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  gradient?: boolean;
  glow?: boolean;
  fullWidth?: boolean;
}

// ==================== Glass Panel ====================
export interface GlassPanelProps {
  variant?: Variant;
  padding?: Padding;
  headerPadding?: Padding;
  footerPadding?: Padding;
  rounded?: string;
  divided?: boolean;
  shadow?: boolean;
  gradient?: boolean;
}

// ==================== Glass Badge ====================
export interface GlassBadgeProps {
  size?: Exclude<Size, "xl">;
  color?: Exclude<
    ColorPreset,
    "purple" | "pink" | "blue" | "green" | "teal" | "orange"
  >;
  variant?: BadgeVariant;
  icon?: string;
  removable?: boolean;
  pill?: boolean;
  glow?: boolean;
}

// ==================== Background Effects ====================
export type IntensityLevel = "low" | "medium" | "high";

export interface BackgroundEffectsProps {
  orbCount?: number;
  animated?: boolean;
  intensity?: IntensityLevel;
  colors?: ColorPreset[];
  enableMouseFollow?: boolean;
  enableGradientMesh?: boolean;
}

export interface IntensityConfig {
  orbOpacity: number;
  blurAmount: number;
  meshOpacity: number;
  noiseOpacity: number;
}
