<template>
  <div class="background-effects" :style="zIndexStyle('BACKGROUND_EFFECTS')">
    <!-- Gradient Mesh Background -->
    <div class="gradient-mesh" :style="meshStyle">
      <div
        v-for="(orb, index) in gradientOrbs"
        :key="`gradient-${index}`"
        class="gradient-orb"
        :style="orb.style"
      ></div>
    </div>

    <!-- Floating Orbs - renderuj tylko gdy style są gotowe -->
    <div v-if="orbStyles.length > 0" class="floating-orbs">
      <div
        v-for="(style, index) in orbStyles"
        :key="`float-${index}`"
        class="floating-orb"
        :style="style"
        :data-index="index"
      ></div>
    </div>

    <!-- Mouse Follow Orb (optional) -->
    <div
      v-if="enableMouseFollow && mouseOrb.visible"
      class="mouse-orb"
      :style="mouseOrb.style"
    ></div>

    <!-- Noise Texture Overlay -->
    <div class="noise-overlay" :style="{ opacity: noiseOpacity }"></div>
  </div>
</template>

<script setup lang="ts">
type ColorPreset =
  | "primary"
  | "purple"
  | "pink"
  | "blue"
  | "green"
  | "teal"
  | "orange";

interface Props {
  orbCount?: number;
  animated?: boolean;
  intensity?: "low" | "medium" | "high";
  colors?: ColorPreset[];
  enableMouseFollow?: boolean;
  enableGradientMesh?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  orbCount: 8,
  animated: true,
  intensity: "medium",
  colors: () => ["primary", "purple", "pink", "blue", "green"],
  enableMouseFollow: false,
  enableGradientMesh: true,
});

const { zIndexStyle } = useZIndex();

// Color mapping - różne kolory dla różnych orbów
const colorMap: Record<ColorPreset, string> = {
  primary: "rgba(59, 130, 246, 0.25)", // blue
  purple: "rgba(139, 92, 246, 0.25)", // violet
  pink: "rgba(236, 72, 153, 0.25)", // pink
  blue: "rgba(99, 102, 241, 0.25)", // indigo
  green: "rgba(34, 197, 94, 0.25)", // green
  teal: "rgba(20, 184, 166, 0.25)", // teal
  orange: "rgba(249, 115, 22, 0.25)", // orange
};

// Intensity settings
const intensityMap = {
  low: {
    orbOpacity: 0.1,
    blurAmount: 80,
    meshOpacity: 0.02,
    noiseOpacity: 0.01,
  },
  medium: {
    orbOpacity: 0.15,
    blurAmount: 60,
    meshOpacity: 0.05,
    noiseOpacity: 0.03,
  },
  high: {
    orbOpacity: 0.2,
    blurAmount: 40,
    meshOpacity: 0.08,
    noiseOpacity: 0.05,
  },
};

const currentIntensity = computed(() => intensityMap[props.intensity]);
const noiseOpacity = computed(() => currentIntensity.value.noiseOpacity);

// Gradient Mesh Background Orbs (3-5 large stationary orbs)
const gradientOrbs = computed(() => {
  if (!props.enableGradientMesh) return [];

  const orbCount = Math.min(
    5,
    Math.max(3, Math.floor(props.colors.length / 2))
  );
  return Array.from({ length: orbCount }, (_, index) => {
    const positions: Array<Record<string, string>> = [
      { top: "-10%", left: "-10%", delay: "0s" },
      { bottom: "-10%", right: "-10%", delay: "-10s" },
      {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        delay: "-20s",
      },
      { top: "20%", right: "10%", delay: "-15s" },
      { bottom: "20%", left: "10%", delay: "-25s" },
    ];

    const position = positions[index] || positions[0]!;
    const size = 500 + index * 50;
    const colorPreset = props.colors[index % props.colors.length];
    const color = colorMap[colorPreset!] || colorMap.primary;

    return {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color.replace("0.15", String(currentIntensity.value.orbOpacity * 2))}, transparent)`,
        filter: `blur(${currentIntensity.value.blurAmount}px)`,
        opacity: currentIntensity.value.orbOpacity * 2,
        animationDelay: props.animated ? position.delay : "0s",
        animationDuration: props.animated ? "30s" : "0s",
        ...position,
      },
    };
  });
});

// Mesh style
const meshStyle = computed(() => ({
  opacity: currentIntensity.value.meshOpacity,
}));

// Deterministyczne style dla floating orbów
const orbStyles = ref<Array<Record<string, string>>>([]);

// Mouse follow orb
const mouseOrb = ref({
  visible: false,
  style: {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
});

let rafId: number | null = null;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// Generowanie stylów tylko po stronie klienta
onMounted(() => {
  // Generate floating orbs
  orbStyles.value = Array.from({ length: props.orbCount }, (_, index) => {
    const size = 200 + Math.random() * 300;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = 15 + Math.random() * 20;
    const delay = Math.random() * -20;
    const colorPreset = props.colors[index % props.colors.length];
    const color = colorMap[colorPreset!] || colorMap.primary;

    return {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      top: `${top}%`,
      background: color.replace(
        "0.15",
        String(currentIntensity.value.orbOpacity)
      ),
      filter: `blur(${currentIntensity.value.blurAmount}px)`,
      opacity: String(currentIntensity.value.orbOpacity),
      animationDuration: props.animated ? `${duration}s` : "0s",
      animationDelay: `${delay}s`,
    };
  });

  // Mouse follow effect
  if (props.enableMouseFollow) {
    window.addEventListener("mousemove", handleMouseMove);
    startMouseAnimation();
  }
});

onUnmounted(() => {
  if (props.enableMouseFollow) {
    window.removeEventListener("mousemove", handleMouseMove);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  }
});

const handleMouseMove = (e: MouseEvent) => {
  targetX = e.clientX;
  targetY = e.clientY;
  if (!mouseOrb.value.visible) {
    mouseOrb.value.visible = true;
  }
};

const startMouseAnimation = () => {
  const animate = () => {
    // Smooth lerp (linear interpolation)
    const lerp = 0.1;
    currentX += (targetX - currentX) * lerp;
    currentY += (targetY - currentY) * lerp;

    mouseOrb.value.style = {
      left: `${currentX}px`,
      top: `${currentY}px`,
      transform: "translate(-50%, -50%)",
    };

    rafId = requestAnimationFrame(animate);
  };

  animate();
};
</script>

<style scoped>
.background-effects {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 5; /* Z_INDEX.BACKGROUND_EFFECTS */
}

/* Gradient Mesh */
.gradient-mesh {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.02) 0%,
    rgba(139, 92, 246, 0.02) 25%,
    rgba(236, 72, 153, 0.02) 50%,
    rgba(59, 130, 246, 0.02) 75%,
    rgba(168, 85, 247, 0.02) 100%
  );
  transition: opacity 0.5s ease;
}

/* Gradient Orbs (Large Stationary) */
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  animation: gradient-shift 30s ease-in-out infinite;
  will-change: transform;
}

@keyframes gradient-shift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30%, -20%) scale(1.1);
  }
  66% {
    transform: translate(-20%, 30%) scale(0.9);
  }
}

/* Floating Orbs (Small Animated) */
.floating-orbs {
  position: absolute;
  inset: 0;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  animation: float-orb infinite ease-in-out;
  will-change: transform;
}

@keyframes float-orb {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -30px) scale(1.05);
  }
  50% {
    transform: translate(-15px, 20px) scale(0.95);
  }
  75% {
    transform: translate(25px, 15px) scale(1.02);
  }
}

/* Mouse Follow Orb */
.mouse-orb {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.15),
    transparent 70%
  );
  filter: blur(50px);
  opacity: 0.3;
  pointer-events: none;
  will-change: transform;
  transition: opacity 0.3s ease;
}

/* Noise Overlay */
.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
  transition: opacity 0.5s ease;
}

/* Dark mode adjustments */
:global(.dark) .gradient-mesh {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.08) 0%,
    rgba(139, 92, 246, 0.08) 25%,
    rgba(236, 72, 153, 0.08) 50%,
    rgba(59, 130, 246, 0.08) 75%,
    rgba(168, 85, 247, 0.08) 100%
  );
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb,
  .floating-orb,
  .mouse-orb {
    animation: none;
  }
}

/* Performance optimizations */
@media (max-width: 768px) {
  .floating-orb {
    display: none;
  }

  .gradient-orb {
    filter: blur(60px);
  }
}
</style>
