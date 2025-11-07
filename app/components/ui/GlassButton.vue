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
    "backdrop-blur-xl",
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
        "bg-gradient-to-r from-primary-500 to-primary-600 text-white border border-primary-600/50 hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500",
      soft: "bg-primary-500/20 text-primary-700 dark:text-primary-300 border border-primary-500/30 hover:bg-primary-500/30 focus:ring-primary-500",
      ghost:
        "text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 focus:ring-primary-500",
      outline:
        "border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 focus:ring-primary-500",
    },
    secondary: {
      solid:
        "bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-600/50 hover:from-purple-600 hover:to-purple-700 focus:ring-purple-500",
      soft: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 focus:ring-purple-500",
      ghost:
        "text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 focus:ring-purple-500",
      outline:
        "border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 focus:ring-purple-500",
    },
    success: {
      solid:
        "bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-600/50 hover:from-green-600 hover:to-green-700 focus:ring-green-500",
      soft: "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30 hover:bg-green-500/30 focus:ring-green-500",
      ghost:
        "text-green-600 dark:text-green-400 hover:bg-green-500/10 focus:ring-green-500",
      outline:
        "border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500/10 focus:ring-green-500",
    },
    warning: {
      solid:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border border-yellow-600/50 hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500",
      soft: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 focus:ring-yellow-500",
      ghost:
        "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10 focus:ring-yellow-500",
      outline:
        "border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10 focus:ring-yellow-500",
    },
    error: {
      solid:
        "bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-600/50 hover:from-red-600 hover:to-red-700 focus:ring-red-500",
      soft: "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 hover:bg-red-500/30 focus:ring-red-500",
      ghost:
        "text-red-600 dark:text-red-400 hover:bg-red-500/10 focus:ring-red-500",
      outline:
        "border-2 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-500/10 focus:ring-red-500",
    },
    neutral: {
      solid:
        "bg-gradient-to-r from-gray-600 to-gray-700 text-white border border-gray-700/50 hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500",
      soft: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30 hover:bg-gray-500/30 focus:ring-gray-500",
      ghost:
        "text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 focus:ring-gray-500",
      outline:
        "border-2 border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 focus:ring-gray-500",
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
