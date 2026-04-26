<template>
  <span :class="badgeClasses">
    <UIcon v-if="icon" :name="icon" class="w-3 h-3" />
    <slot />
    <button
      v-if="removable"
      type="button"
      @click="$emit('remove')"
      class="ml-1 -mr-1 hover:bg-white/20 dark:hover:bg-slate-900/20 rounded-full p-0.5 transition-colors"
    >
      <UIcon name="i-heroicons-x-mark-20-solid" class="w-3 h-3" />
    </button>
  </span>
</template>

<script setup lang="ts">
type Size = "xs" | "sm" | "md" | "lg";
type Color =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "neutral";
type Variant = "solid" | "soft" | "outline";

interface Props {
  size?: Size;
  color?: Color;
  variant?: Variant;
  icon?: string;
  removable?: boolean;
  pill?: boolean;
  glow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "primary",
  variant: "soft",
  removable: false,
  pill: false,
  glow: false,
});

defineEmits<{
  remove: [];
}>();

const badgeClasses = computed(() => {
  const classes = [
    "inline-flex items-center gap-1.5",
    "font-semibold",
    "transition-all duration-200",
  ];

  // Shape
  if (props.pill) {
    classes.push("rounded-full");
  } else {
    classes.push("rounded-lg");
  }

  // Size
  switch (props.size) {
    case "xs":
      classes.push("px-2 py-0.5 text-xs");
      break;
    case "sm":
      classes.push("px-2.5 py-1 text-xs");
      break;
    case "md":
      classes.push("px-3 py-1.5 text-sm");
      break;
    case "lg":
      classes.push("px-4 py-2 text-base");
      break;
  }

  // Color & Variant
  const colorMap: Record<Color, Record<Variant, string>> = {
    primary: {
      solid: "bg-primary-600 text-white",
      soft: "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
      outline: "bg-transparent border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400",
    },
    secondary: {
      solid: "bg-purple-600 text-white",
      soft: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      outline: "bg-transparent border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
    },
    success: {
      solid: "bg-green-600 text-white",
      soft: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      outline: "bg-transparent border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
    },
    warning: {
      solid: "bg-yellow-500 text-white",
      soft: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      outline: "bg-transparent border border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400",
    },
    error: {
      solid: "bg-red-600 text-white",
      soft: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      outline: "bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
    },
    neutral: {
      solid: "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900",
      soft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      outline: "bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400",
    },
  };
 
  classes.push(colorMap[props.color][props.variant]);

  // Glow effect
  if (props.glow) {
    const glowMap: Record<Color, string> = {
      primary: "shadow-lg shadow-primary-500/30",
      secondary: "shadow-lg shadow-purple-500/30",
      success: "shadow-lg shadow-green-500/30",
      warning: "shadow-lg shadow-yellow-500/30",
      error: "shadow-lg shadow-red-500/30",
      neutral: "shadow-lg shadow-slate-500/30",
    };
    classes.push(glowMap[props.color]);
  }

  return classes.join(" ");
});
</script>
