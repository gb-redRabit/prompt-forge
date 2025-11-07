<template>
  <span :class="badgeClasses">
    <UIcon v-if="icon" :name="icon" class="w-3 h-3" />
    <slot />
    <button
      v-if="removable"
      type="button"
      @click="$emit('remove')"
      class="ml-1 -mr-1 hover:bg-white/20 dark:hover:bg-gray-900/20 rounded-full p-0.5 transition-colors"
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
    "backdrop-blur-xl",
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
      solid:
        "bg-gradient-to-r from-primary-500 to-primary-600 text-white border border-primary-600/50",
      soft: "bg-primary-500/20 text-primary-700 dark:text-primary-300 border border-primary-500/30",
      outline:
        "bg-transparent border-2 border-primary-500 text-primary-600 dark:text-primary-400",
    },
    secondary: {
      solid:
        "bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-600/50",
      soft: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30",
      outline:
        "bg-transparent border-2 border-purple-500 text-purple-600 dark:text-purple-400",
    },
    success: {
      solid:
        "bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-600/50",
      soft: "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30",
      outline:
        "bg-transparent border-2 border-green-500 text-green-600 dark:text-green-400",
    },
    warning: {
      solid:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border border-yellow-600/50",
      soft: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30",
      outline:
        "bg-transparent border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400",
    },
    error: {
      solid:
        "bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-600/50",
      soft: "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30",
      outline:
        "bg-transparent border-2 border-red-500 text-red-600 dark:text-red-400",
    },
    neutral: {
      solid:
        "bg-gradient-to-r from-gray-500 to-gray-600 text-white border border-gray-600/50",
      soft: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30",
      outline:
        "bg-transparent border-2 border-gray-500 text-gray-600 dark:text-gray-400",
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
      neutral: "shadow-lg shadow-gray-500/30",
    };
    classes.push(glowMap[props.color]);
  }

  return classes.join(" ");
});
</script>
