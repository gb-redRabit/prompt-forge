<template>
  <div :class="panelClasses">
    <!-- Header slot (optional) -->
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <!-- Main content -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Footer slot (optional) -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
type Variant = "default" | "subtle" | "strong" | "bordered";
type Padding = "none" | "sm" | "md" | "lg";

interface Props {
  variant?: Variant;
  padding?: Padding;
  headerPadding?: Padding;
  footerPadding?: Padding;
  rounded?: string;
  divided?: boolean;
  shadow?: boolean;
  gradient?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  padding: "md",
  headerPadding: "md",
  footerPadding: "md",
  rounded: "rounded-xl",
  divided: true,
  shadow: true,
  gradient: false,
});

const paddingMap: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
};

const panelClasses = computed(() => {
  const classes = [
    props.rounded,
    "backdrop-blur-xl",
    "overflow-hidden",
    "transition-all duration-300",
  ];

  // Variant styles
  switch (props.variant) {
    case "subtle":
      classes.push("bg-white/30 dark:bg-gray-800/30");
      break;
    case "strong":
      classes.push("bg-white/70 dark:bg-gray-800/70");
      break;
    case "bordered":
      classes.push(
        "bg-white/40 dark:bg-gray-800/40",
        "border-2 border-primary-500/30 dark:border-primary-500/40"
      );
      break;
    case "default":
    default:
      classes.push(
        "bg-white/50 dark:bg-gray-800/50",
        "border border-white/30 dark:border-gray-700/40"
      );
      break;
  }

  // Shadow
  if (props.shadow) {
    classes.push("shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50");
  }

  // Gradient overlay
  if (props.gradient) {
    classes.push(
      "relative",
      "before:absolute before:inset-0",
      "before:bg-gradient-to-br before:from-primary-500/5 before:via-transparent before:to-purple-500/5",
      "before:pointer-events-none"
    );
  }

  return classes.join(" ");
});

const headerClasses = computed(() => {
  const classes = [paddingMap[props.headerPadding]];

  if (props.divided) {
    classes.push(
      "border-b border-white/30 dark:border-gray-700/40",
      "bg-gradient-to-r from-primary-500/5 to-purple-500/5"
    );
  }

  return classes.join(" ");
});

const contentClasses = computed(() => {
  return paddingMap[props.padding];
});

const footerClasses = computed(() => {
  const classes = [paddingMap[props.footerPadding]];

  if (props.divided) {
    classes.push(
      "border-t border-white/30 dark:border-gray-700/40",
      "bg-white/20 dark:bg-gray-800/20"
    );
  }

  return classes.join(" ");
});
</script>
