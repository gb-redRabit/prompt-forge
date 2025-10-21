<template>
  <nav
    class="fixed right-3 top-1/2 transform -translate-y-1/2 z-50"
    role="navigation"
    aria-label="Sekcje strony"
  >
    <ul class="space-y-2">
      <li v-for="(item, idx) in items" :key="idx">
        <button
          class="dot-btn"
          :class="activeIndex === idx ? 'active' : 'inactive'"
          :aria-current="activeIndex === idx ? 'true' : 'false'"
          :aria-label="`Przejdź do sekcji ${idx + 1}: ${item.label}`"
          v-bind="getId(idx) ? { 'aria-controls': getId(idx) } : {}"
          @click="
            () => {
              goTo(idx);
              focusSection(idx);
            }
          "
        ></button>
      </li>
    </ul>

    <div class="sr-only" aria-live="polite">{{ liveText }}</div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

interface DotItem {
  id: string;
  label: string;
}

const props = defineProps<{
  items: DotItem[];
  containerId?: string; // id tracka/pojemnika, domyślnie 'fullpage-track'
  durationMs?: number; // czas animacji przejścia
  wheelTrigger?: number; // skumulowany próg deltaY do wywołania zmiany
  wheelDecayMs?: number; // czas wygaszania akumulatora wheel
  enableWheel?: boolean; // czy obsługiwać wheel
  enableMouseDrag?: boolean; // czy obsługiwać drag myszką
  wheelImmediateThreshold?: number; // natychmiastowy próg (px) dla pojedynczego delty
}>();

const emit = defineEmits<{
  (e: "change", idx: number): void;
}>();

const activeIndex = ref(0);
const containerId = props.containerId || "fullpage-track";
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const duration = props.durationMs ?? (prefersReduced ? 0 : 700);
const wheelTrigger = props.wheelTrigger ?? 120;
const wheelDecayMs = props.wheelDecayMs ?? 250;
const enableWheel = props.enableWheel ?? true;
const enableMouseDrag = props.enableMouseDrag ?? false;
const wheelImmediateThreshold = props.wheelImmediateThreshold ?? 40;

let containerEl: HTMLElement | null = null;
let isScrolling = false;
const liveText = ref("");
let viewportEl: HTMLElement | null = null;

const setTransform = (idx: number) => {
  if (!containerEl) return;
  // scroll-based navigation: scroll the viewport to the target section top
  const scrollTarget =
    viewportEl ||
    (document.scrollingElement as HTMLElement) ||
    document.documentElement;
  const height =
    window.innerHeight ||
    (scrollTarget ? (scrollTarget as HTMLElement).clientHeight : 0) ||
    0;
  const top = Math.round(idx * height);
  try {
    if (viewportEl && typeof (viewportEl as any).scrollTo === "function") {
      (viewportEl as any).scrollTo({
        top,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    } else if (typeof window.scrollTo === "function") {
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    }
  } catch (_) {}
  containerEl.style.backfaceVisibility = "hidden";
};

const goTo = (idx: number) => {
  const items = props.items || [];
  const clamped = Math.max(0, Math.min(items.length - 1, idx));
  if (clamped === activeIndex.value) return;
  activeIndex.value = clamped;
  setTransform(clamped);
  emit("change", clamped);
  // debounce further wheel events briefly
  isScrolling = true;
  setTimeout(() => (isScrolling = false), duration + 50);
};

const getId = (idx: number): string | undefined =>
  props.items?.[idx]?.id ?? undefined;

const focusSection = (idx: number) => {
  const id = getId(idx);
  const el = id
    ? document.getElementById(id)
    : Array.from(
        document.querySelectorAll<HTMLElement>("[data-fullpage-section]")
      )[idx];
  if (el) {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
};

// helper - czy element może przewinąć się w danym kierunku
const canScroll = (el: Element | null, deltaY: number): boolean => {
  if (!el || !(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const isScrollable =
    overflowY === "auto" ||
    overflowY === "scroll" ||
    el.scrollHeight > el.clientHeight;
  if (!isScrollable) return false;
  if (deltaY > 0) {
    // scrolling down
    return el.scrollTop + el.clientHeight < el.scrollHeight - 1;
  } else if (deltaY < 0) {
    // scrolling up
    return el.scrollTop > 0;
  }
  return false;
};

// Granular wheel handling: akumuluj deltaY i triggeruj przejście dopiero po przekroczeniu progu.
let wheelAccum = 0;
let wheelLast = 0;
let lastWheelTime = 0;

const onWheel = (e: WheelEvent) => {
  // dedupe duplicate events across multiple listener targets using timeStamp
  try {
    if (e.timeStamp === lastWheelTime) return;
    lastWheelTime = e.timeStamp;
  } catch (_) {}
  if (isScrolling) return;

  // convert deltaMode to pixels for more consistent behavior across devices
  let deltaPx = e.deltaY;
  try {
    // 0 = pixels, 1 = lines, 2 = pages
    const dm = (e as any).deltaMode;
    if (dm === 1)
      deltaPx = e.deltaY * 16; // estimate: 1 line ~= 16px
    else if (dm === 2) deltaPx = e.deltaY * window.innerHeight; // page -> viewport height
  } catch (_) {}

  // find initial node from composedPath or target
  let node: Element | null = null;
  try {
    const path = (e as any).composedPath ? (e as any).composedPath() : null;
    if (Array.isArray(path))
      node = path.find((n) => n instanceof Element) as Element | null;
  } catch (_) {
    node = null;
  }
  if (!node) node = (e.target as Element) || null;

  // climb up to find scrollable ancestor that can scroll in this direction -> if found, passthrough
  let cur: Element | null = node;
  while (cur) {
    // ignore the viewport itself (we make it scrollable for scrollTo fallback)
    if (cur === viewportEl) {
      cur = cur.parentElement;
      continue;
    }
    if (canScroll(cur, deltaPx)) {
      return; // let native scroll take place
    }
    cur = cur.parentElement;
  }

  // nie znaleziono scrollowalnego potomka -> nie blokujemy jeszcze natywnego przewijania;
  // blokujemy jedynie gdy zdecydujemy się wykonać przejście (goTo), które już wywołuje preventDefault.

  // immediate reaction for large deltas (fast scroll) or small immediate threshold
  if (
    Math.abs(deltaPx) > Math.max(100, wheelTrigger / 2) ||
    Math.abs(deltaPx) >= wheelImmediateThreshold
  ) {
    try {
      e.preventDefault();
    } catch (_) {}
    if (deltaPx > 0) goTo(activeIndex.value + 1);
    else goTo(activeIndex.value - 1);
    wheelAccum = 0;
    wheelLast = 0;
    return;
  }

  // accumulate delta and decay over time
  const now = Date.now();
  if (now - wheelLast > wheelDecayMs) wheelAccum = 0;
  wheelAccum += deltaPx;
  wheelLast = now;

  if (Math.abs(wheelAccum) >= wheelTrigger) {
    // prevent native scrolling when we switch sections
    try {
      e.preventDefault();
    } catch (_) {}
    if (wheelAccum > 0) goTo(activeIndex.value + 1);
    else goTo(activeIndex.value - 1);
    wheelAccum = 0;
    wheelLast = 0;
  }
};

let touchStartY: number | null = null;
const onTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches?.[0]?.clientY ?? null;
};
const onTouchEnd = (e: TouchEvent) => {
  if (touchStartY == null) return;
  const endY = e.changedTouches?.[0]?.clientY ?? 0;
  const diff = touchStartY - endY;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goTo(activeIndex.value + 1);
    else goTo(activeIndex.value - 1);
  }
  touchStartY = null;
};

// Pointer (mouse/touch drag) handling for optional drag-to-scroll
let pointerDown = false;
let pointerStartY: number | null = null;
let pointerLastY = 0;
let pointerAccum = 0;

const onPointerDown = (e: PointerEvent) => {
  if (e.isPrimary === false) return;
  e.preventDefault?.();
  pointerDown = true;
  pointerStartY = e.clientY;
  pointerLastY = e.clientY;
  pointerAccum = 0;
  try {
    if (viewportEl && viewportEl.setPointerCapture)
      viewportEl.setPointerCapture(e.pointerId);
    else (e.target as Element).setPointerCapture?.(e.pointerId);
  } catch (_) {}
  try {
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  } catch (_) {}
  try {
    if (viewportEl) viewportEl.style.touchAction = "none";
  } catch (_) {}
};

const onPointerMove = (e: PointerEvent) => {
  if (!pointerDown) return;
  const dy = pointerLastY - e.clientY;
  pointerLastY = e.clientY;
  pointerAccum += dy;

  // check element under pointer for scrollable area
  const node = document.elementFromPoint(
    e.clientX,
    e.clientY
  ) as Element | null;
  let cur: Element | null = node;
  while (cur) {
    if (canScroll(cur, dy)) return; // let native scroll
    cur = cur.parentElement;
  }

  if (Math.abs(pointerAccum) >= wheelTrigger) {
    e.preventDefault?.();
    if (pointerAccum > 0) goTo(activeIndex.value + 1);
    else goTo(activeIndex.value - 1);
    pointerAccum = 0;
    pointerDown = false;
    try {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    } catch (_) {}
  }
};

const onPointerUp = (e: PointerEvent) => {
  pointerDown = false;
  pointerStartY = null;
  pointerAccum = 0;
  try {
    if (viewportEl && viewportEl.releasePointerCapture)
      viewportEl.releasePointerCapture(e.pointerId);
    else (e.target as Element).releasePointerCapture?.(e.pointerId);
  } catch (_) {}
  try {
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  } catch (_) {}
  try {
    if (viewportEl) viewportEl.style.touchAction = "";
  } catch (_) {}
};

const onKey = (e: KeyboardEvent) => {
  if (["ArrowDown", "PageDown"].includes(e.key)) {
    e.preventDefault();
    goTo(activeIndex.value + 1);
  } else if (["ArrowUp", "PageUp"].includes(e.key)) {
    e.preventDefault();
    goTo(activeIndex.value - 1);
  } else if (e.key === "Home") {
    e.preventDefault();
    goTo(0);
  } else if (e.key === "End") {
    e.preventDefault();
    goTo((props.items || []).length - 1);
  }
};

// scroll handling: keep dots in sync when user scrolls the viewport
let rafId = 0;
const onScroll = () => {
  if (!viewportEl) return;
  // throttle with rAF
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    try {
      const scrollTop = viewportEl
        ? viewportEl.scrollTop
        : (document.scrollingElement as any)?.scrollTop || 0;
      const h = window.innerHeight || (viewportEl?.clientHeight ?? 0) || 1;
      const items = props.items || [];
      const idx = Math.max(
        0,
        Math.min(items.length - 1, Math.round(scrollTop / h))
      );
      if (idx !== activeIndex.value) {
        // only update when user scrolls (not during programmatic debounce if set)
        if (!isScrolling) {
          activeIndex.value = idx;
          emit("change", idx);
        }
      }
    } catch (_) {}
    rafId = 0;
  });
};

onMounted(() => {
  containerEl = document.getElementById(containerId);
  // jeśli track nie istnieje, spróbuj znaleźć wrapper
  if (!containerEl) containerEl = document.querySelector(".fullpage-track");
  // dodatkowy, jawny fallback: id 'fullpage-track'
  try {
    if (!containerEl) {
      const explicit = document.getElementById("fullpage-track");
      if (explicit) containerEl = explicit as HTMLElement;
    }
  } catch (_) {}

  // ensure initial styles
  if (containerEl) {
    containerEl.style.willChange = "transform";
    containerEl.style.transform = "translateY(0)";
    // container found
  }

  // listeners na viewport (fullpage-container)
  const viewport = document.getElementById("fullpage-container");
  viewportEl = viewport as HTMLElement | null;
  // make viewport scrollable so we can use scrollTo
  try {
    if (viewportEl) {
      // allow native scroll by default; we only prevent it when snapping
      viewportEl.style.overflowY = "auto";
      viewportEl.style.height = "100vh";
      try {
        viewportEl.style.overscrollBehavior = "contain";
      } catch (_) {}
    }
  } catch (_) {}
  const targetForEvents = viewportEl || document.body;
  if (enableWheel)
    targetForEvents.addEventListener("wheel", onWheel, { passive: false });
  // also listen on document as a fallback in case wheel events are dispatched outside viewport
  if (enableWheel && targetForEvents !== document.body)
    document.addEventListener("wheel", onWheel, { passive: false });
  // fallback: listen on window in capture mode to catch events that may be stopped by other listeners
  if (enableWheel)
    window.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });
  targetForEvents.addEventListener("touchstart", onTouchStart, {
    passive: true,
  });
  targetForEvents.addEventListener("touchend", onTouchEnd, { passive: true });

  if (enableMouseDrag && viewportEl) {
    // pointerdown on viewport to start drag; pointermove/up on document to capture outside element
    viewportEl.addEventListener("pointerdown", onPointerDown, {
      passive: false,
    });
    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
  }

  window.addEventListener("keydown", onKey);
  // attach scroll listener to keep dots in sync when user scrolls
  try {
    if (viewportEl)
      viewportEl.addEventListener("scroll", onScroll, { passive: true });
    else document.addEventListener("scroll", onScroll, { passive: true });
  } catch (_) {}
  // ustaw tekst dla SR (numer sekcji i etykieta)
  watch(activeIndex, (val) => {
    const total = props.items?.length ?? 0;
    const label = props.items?.[val]?.label ?? `Sekcja ${val + 1}`;
    liveText.value = `Sekcja ${val + 1} z ${total}: ${label}`;
  });
});

onBeforeUnmount(() => {
  const targetForEvents = viewportEl || document.body;
  if (enableWheel) targetForEvents.removeEventListener("wheel", onWheel);
  if (enableWheel) document.removeEventListener("wheel", onWheel);
  if (enableWheel) window.removeEventListener("wheel", onWheel);
  targetForEvents.removeEventListener("touchstart", onTouchStart);
  targetForEvents.removeEventListener("touchend", onTouchEnd);
  try {
    if (viewportEl) viewportEl.removeEventListener("scroll", onScroll as any);
    else document.removeEventListener("scroll", onScroll as any);
  } catch (_) {}
  if (enableMouseDrag && viewportEl) {
    viewportEl.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("pointercancel", onPointerUp);
  }
  window.removeEventListener("keydown", onKey);
});
</script>

<style scoped>
.bg-primary-600 {
  background-color: #4f46e5;
}

/* dot styles: większy hit area z małą kropką w środku */
.dot-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
}
.dot-btn::before {
  content: "";
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: #d1d5db; /* gray-300 */
  transition:
    transform 200ms,
    background-color 200ms;
}
.dot-btn.active::before {
  background: #4f46e5;
  transform: scale(1.2);
}
.dot-btn.inactive::before {
  background: #d1d5db;
}
.dot-btn:focus-visible {
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
  outline: none;
}

/* ukryj menu kropkowe na małych ekranach */
@media (max-width: 640px) {
  nav[role="navigation"] {
    display: none;
  }
}

/* ukryty tekst dla SR */
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
