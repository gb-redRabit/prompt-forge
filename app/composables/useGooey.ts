/**
 * useGooey - Composable dla efektu lepkości (gooey)
 * Tworzy SVG filter i zapewnia CSS classes dla gooey animations
 *
 * Inspiracja: https://css-tricks.com/gooey-effect/
 * Zasada: SVG filter z feGaussianBlur + feColorMatrix tworzy efekt "rozmazania i sklejenia"
 */

export interface GooeyOptions {
  /** Intensywność blur (1-20, default: 10) */
  intensity?: number;
  /** Kolor efektu (hex, rgb, rgba) */
  color?: string;
  /** ID filtra (unique per instance) */
  id?: string;
}

export const useGooey = (options: GooeyOptions = {}) => {
  const {
    intensity = 10,
    color = "currentColor",
    id = `gooey-${Math.random().toString(36).substr(2, 9)}`,
  } = options;

  /**
   * SVG Filter Definition
   * feGaussianBlur: Rozmywa elementy
   * feColorMatrix: Zwiększa kontrast (19) i przycina alfa (-9) co tworzy "sklejenie"
   * feComposite: Łączy oryginał z efektem
   */
  const svgFilter = computed(
    () => `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute; width: 0; height: 0;">
      <defs>
        <filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${intensity}" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" 
            result="gooey" 
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
        </filter>
      </defs>
    </svg>
  `
  );

  /**
   * CSS Class dla aplikacji filtra
   * Używaj na parent container
   */
  const filterClass = `filter-gooey-${id}`;

  /**
   * Inline style dla aplikacji filtra
   * Alternative do class
   */
  const filterStyle = computed(() => ({
    filter: `url(#${id})`,
  }));

  /**
   * Helper function: Inject SVG do DOM
   * Wywoływać w onMounted
   */
  const injectSvg = () => {
    if (process.client && !document.getElementById(id)) {
      const container = document.createElement("div");
      container.innerHTML = svgFilter.value;
      document.body.appendChild(container.firstElementChild as Node);
    }
  };

  /**
   * Helper function: Remove SVG z DOM
   * Wywoływać w onUnmounted
   */
  const removeSvg = () => {
    if (process.client) {
      const svg = document.getElementById(id)?.parentElement;
      if (svg) {
        svg.remove();
      }
    }
  };

  return {
    /** Unique ID filtra */
    filterId: id,
    /** SVG filter jako string */
    svgFilter,
    /** CSS class name */
    filterClass,
    /** Inline style object */
    filterStyle,
    /** Inject SVG do DOM */
    injectSvg,
    /** Remove SVG z DOM */
    removeSvg,
  };
};

/**
 * Przykład użycia:
 *
 * <script setup>
 * const gooey = useGooey({ intensity: 10 });
 *
 * onMounted(() => {
 *   gooey.injectSvg();
 * });
 *
 * onUnmounted(() => {
 *   gooey.removeSvg();
 * });
 * </script>
 *
 * <template>
 *   <div :style="gooey.filterStyle">
 *     <!-- Elements with gooey effect -->
 *     <button class="blob">Click</button>
 *     <div class="blob">Hover</div>
 *   </div>
 * </template>
 *
 * <style>
 * .blob {
 *   background: #6366f1;
 *   border-radius: 50%;
 *   transition: transform 0.3s;
 * }
 * .blob:hover {
 *   transform: scale(1.2);
 * }
 * </style>
 */
