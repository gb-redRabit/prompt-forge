<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    class="cursor-pointer"
  >
    <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
    <UIcon v-else-if="icon && iconPosition === 'left'" :name="icon" />
    <slot />
    <UIcon v-if="icon && iconPosition === 'right'" :name="icon" />
  </button>
</template>

<script setup lang="ts">
type Variant = "solid" | "soft" | "ghost" | "outline";
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Color =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "neutral";

interface Props {
  variant?: Variant;
  size?: Size;
  color?: Color;
  icon?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  gradient?: boolean;
  glow?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
  size: "md",
  color: "primary",
  iconPosition: "left",
  disabled: false,
  loading: false,
  type: "button",
  gradient: false,
  glow: false,
  fullWidth: false,
});

const buttonClasses = computed(() => {
  const classes = [
    "inline-flex items-center justify-center gap-2",
    "font-semibold",
    "rounded-lg",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
  ];

  // Full width
  if (props.fullWidth) {
    classes.push("w-full");
  }

  // Size
  switch (props.size) {
    case "xs":
      classes.push("px-2.5 py-1.5 text-xs");
      break;
    case "sm":
      classes.push("px-3 py-2 text-sm");
      break;
    case "md":
      classes.push("px-4 py-2.5 text-sm");
      break;
    case "lg":
      classes.push("px-5 py-3 text-base");
      break;
    case "xl":
      classes.push("px-6 py-3.5 text-base");
      break;
  }

  // Color & Variant combinations
  const colorMap: Record<Color, any> = {
    primary: {
      solid:
        "bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400",
      soft: "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20",
      ghost:
        "text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10",
      outline:
        "border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10",
    },
    secondary: {
      solid:
        "bg-purple-600 text-white hover:bg-purple-500 focus:ring-purple-400 dark:bg-purple-500 dark:hover:bg-purple-400",
      soft: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20",
      ghost:
        "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10",
      outline:
        "border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10",
    },
    success: {
      solid:
        "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-400",
      soft: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
      ghost:
        "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
      outline:
        "border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
    },
    warning: {
      solid:
        "bg-amber-500 text-white hover:bg-amber-400 focus:ring-amber-400",
      soft: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20",
      ghost:
        "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10",
      outline:
        "border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10",
    },
    error: {
      solid:
        "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-400",
      soft: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20",
      ghost:
        "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10",
      outline:
        "border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10",
    },
    neutral: {
      solid:
        "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-white focus:ring-slate-500",
      soft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
      ghost:
        "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
      outline:
        "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
    },
  };
 
  classes.push(colorMap[props.color][props.variant]);

  // Glow effect (shadow matching color)
  if (props.glow) {
    const glowMap: Record<Color, string> = {
      primary:
        "shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/50",
      secondary:
        "shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50",
      success:
        "shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50",
      warning:
        "shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50",
      error:
        "shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50",
      neutral:
        "shadow-lg shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/50",
    };
    classes.push(glowMap[props.color], "animate-pulse-glow");
  }

  // Disabled state
  if (props.disabled || props.loading) {
    classes.push("opacity-50 cursor-not-allowed");
  } else {
    classes.push("hover:scale-105 active:scale-95");
  }

  return classes.join(" ");
});
</script>
