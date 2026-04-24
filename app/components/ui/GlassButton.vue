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
        "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
      soft: "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50",
      ghost:
        "text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20",
      outline:
        "border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20",
    },
    secondary: {
      solid:
        "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
      soft: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50",
      ghost:
        "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
      outline:
        "border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
    },
    success: {
      solid:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      soft: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50",
      ghost:
        "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
      outline:
        "border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
    },
    warning: {
      solid:
        "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
      soft: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
      ghost:
        "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
      outline:
        "border border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    },
    error: {
      solid:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      soft: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50",
      ghost:
        "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
      outline:
        "border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
    neutral: {
      solid:
        "bg-gray-800 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-900 dark:hover:bg-gray-100 focus:ring-gray-500",
      soft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
      ghost:
        "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
      outline:
        "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
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
        "shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50",
      warning:
        "shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50",
      error:
        "shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50",
      neutral:
        "shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/50",
    };
    classes.push(glowMap[props.color]);
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
