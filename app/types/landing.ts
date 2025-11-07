/**
 * Landing Page Type Definitions
 * Zgodne z Nuxt 4.12 best practices
 */

// ==================== Full Page Scroll ====================
export interface DotItem {
  id: string;
  label: string;
}

export interface FullPageDotsProps {
  items: DotItem[];
  containerId?: string;
  durationMs?: number;
  wheelTrigger?: number;
  wheelDecayMs?: number;
  enableWheel?: boolean;
  enableMouseDrag?: boolean;
  wheelImmediateThreshold?: number;
}

// ==================== Landing Hero ====================
export interface LandingHeroProps {
  isContentLoaded: boolean;
  promptsCount: number;
  optionsCount: number;
  tagsCount: number;
}

export interface LandingHeroEmits {
  (e: "get-started"): void;
  (e: "learn-more"): void;
}

// ==================== Landing Features ====================
export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

// ==================== Landing How It Works ====================
export interface StepItem {
  number: number;
  title: string;
  description: string;
  icon: string;
}

// ==================== Landing FAQ ====================
export interface FAQItem {
  question: string;
  answer: string;
}

export interface LandingFAQEmits {
  (e: "contact"): void;
}

// ==================== Landing CTA ====================
export interface LandingCTAEmits {
  (e: "get-started"): void;
  (e: "learn-more"): void;
}

// ==================== Interactive Demo ====================
export type DemoState = "empty" | "processing" | "success" | "error";

export interface DemoStateProps {
  state: DemoState;
  inputText?: string;
  outputText?: string;
  errorMessage?: string;
}

export interface DemoExample {
  id: string;
  label: string;
  text: string;
  category?: string;
}
