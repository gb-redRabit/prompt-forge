import pl from "./pl.json";
import en from "./en.json";

/**
 * Funkcja sprawdzająca brakujące tłumaczenia.
 * Porównuje klucze w pl i en i wypisuje brakujące w konsoli.
 */
export function checkMissingTranslations() {
  function findMissingKeys(base, compare, prefix = "") {
    let missing = [];
    for (const key in base) {
      if (!(key in compare)) {
        missing.push(prefix + key);
      } else if (
        typeof base[key] === "object" &&
        base[key] !== null &&
        typeof compare[key] === "object" &&
        compare[key] !== null
      ) {
        missing = missing.concat(
          findMissingKeys(base[key], compare[key], prefix + key + ".")
        );
      }
    }
    return missing;
  }

  const missingInPl = findMissingKeys(en, pl);
  const missingInEn = findMissingKeys(pl, en);

  if (missingInPl.length) {
    console.warn("Brakujące tłumaczenia w pl.json:", missingInPl);
  }
  if (missingInEn.length) {
    console.warn("Brakujące tłumaczenia w en.json:", missingInEn);
  }
  if (!missingInPl.length && !missingInEn.length) {
    console.info("Brak brakujących tłumaczeń!");
  }
}

export default {
  pl,
  en,
};
