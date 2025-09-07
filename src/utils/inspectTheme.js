export function getThemeVars(rootElement) {
  if (typeof window === "undefined") return {};
  // jeśli rootElement nie podany -> spróbuj znaleźć element z data-theme, potem fallback na document.documentElement
  const root =
    rootElement ||
    document.querySelector("[data-theme]") ||
    document.documentElement;
  const cs = getComputedStyle(root);
  const keys = [
    "--color-base-100",
    "--color-base-200",
    "--color-base-300",
    "--color-base-content",
    "--color-primary",
    "--color-primary-content",
    "--color-secondary",
    "--color-secondary-content",
    "--color-accent",
    "--color-accent-content",
    "--color-neutral",
    "--color-neutral-content",
    "--color-info",
    "--color-info-content",
    "--color-success",
    "--color-success-content",
    "--color-warning",
    "--color-warning-content",
    "--color-error",
    "--color-error-content",
    "--radius-box",
    "--radius-field",
    "--radius-selector",
  ];
  const out = {};
  for (const k of keys) out[k] = cs.getPropertyValue(k).trim() || null;
  return out;
}

function _computedRgbFrom(value) {
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  el.style.width = "10px";
  el.style.height = "10px";
  el.style.background = value || "transparent";
  document.documentElement.appendChild(el);
  const computed = getComputedStyle(el).backgroundColor;
  document.documentElement.removeChild(el);
  return computed;
}

function _rgbToLuminance(rgbStr) {
  const m = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return 0;
  const [r, g, b] = [m[1], m[2], m[3]].map((n) => {
    const v = Number(n) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function _contrastColorFor(value) {
  try {
    const rgb = _computedRgbFrom(value);
    const lum = _rgbToLuminance(rgb);
    return lum > 0.5 ? "#000" : "#fff";
  } catch {
    return "#000";
  }
}

export function logThemeVars(rootElement) {
  if (typeof window === "undefined") return {};
  // wybierz element z data-theme jeśli nie podano
  const themeRoot =
    rootElement ||
    document.querySelector("[data-theme]") ||
    document.documentElement;
  const vars = getThemeVars(themeRoot);
  console.group(
    `DaisyUI / theme vars (source: ${
      themeRoot === document.documentElement
        ? "documentElement"
        : "data-theme element"
    })`
  );
  for (const [name, val] of Object.entries(vars)) {
    if (val) {
      const textColor = _contrastColorFor(val);
      console.log(
        `%c   %c ${name}: %s`,
        `background:${val}; padding:6px 16px; border-radius:4px;`,
        `color:${textColor}; background:transparent; padding:6px 8px; font-weight:600;`,
        val
      );
    } else {
      console.log(`${name}: %c<not set>`, "color:#888");
    }
  }
  console.groupEnd();
  return vars;
}

export function logThemeVar(varName, rootElement) {
  if (typeof window === "undefined") return null;
  if (!varName || typeof varName !== "string") {
    console.log("Podaj nazwę zmiennej CSS, np. --color-base-100");
    return null;
  }

  const root =
    rootElement ||
    document.querySelector("[data-theme]") ||
    document.documentElement;
  const cs = getComputedStyle(root);
  const val = cs.getPropertyValue(varName).trim() || null;

  if (!val) {
    console.log(`${varName}: %c<not set>`, "color:#888");
    return null;
  }

  //   const textColor = _contrastColorFor(val);
  //   console.log(
  //     `%c   %c ${varName}: %s`,
  //     `background:${val}; padding:6px 16px; border-radius:4px;`,
  //     `color:${textColor}; background:transparent; padding:6px 8px; font-weight:600;`,
  //     val
  //   );

  return val;
}
