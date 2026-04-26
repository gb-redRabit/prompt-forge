<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
type Variant = "default" | "subtle" | "strong";
type Padding = "none" | "sm" | "md" | "lg" | "xl";

interface Props {
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
  gradient?: boolean;
  border?: boolean;
  shadow?: boolean;
  rounded?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  padding: "md",
  hover: false,
  gradient: false,
  border: true,
  shadow: true,
  rounded: "rounded-xl",
});

const cardClasses = computed(() => {
  const classes = [props.rounded, "overflow-hidden"];

  // Variant styles
  switch (props.variant) {
    case "subtle":
      classes.push(
        "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
      );
      break;
    case "strong":
      classes.push(
        "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
      );
      break;
    case "default":
    default:
      classes.push(
        "bg-white dark:bg-slate-900",
        props.border ? "border border-slate-200 dark:border-slate-800" : ""
      );
      break;
  }

  // Padding
  switch (props.padding) {
    case "none":
      break;
    case "sm":
      classes.push("p-3");
      break;
    case "md":
      classes.push("p-4 md:p-6");
      break;
    case "lg":
      classes.push("p-6 md:p-8");
      break;
    case "xl":
      classes.push("p-8 md:p-10");
      break;
  }

  // Shadow
  if (props.shadow) {
    classes.push("shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50");
  }

  // Gradient overlay (optional decorative effect)
  if (props.gradient) {
    classes.push(
      "relative",
      "before:absolute before:inset-0 before:rounded-[inherit]",
      "before:bg-gradient-to-br before:from-primary-500/10 before:to-purple-500/10",
      "before:pointer-events-none"
    );
  }

  // Hover effects
  if (props.hover) {
    classes.push(
      "transition-all duration-300",
      "hover:shadow-xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/30",
      "hover:scale-[1.02]",
      "cursor-pointer"
    );
  }

  return classes.filter(Boolean).join(" ");
});
</script>

<style scoped>
.rounded-inherit {
  border-radius: inherit;
}
</style>
