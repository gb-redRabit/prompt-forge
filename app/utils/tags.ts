import type { TagItem } from "~~/shared/types/content";

/**
 * Utility functions for handling Tag objects
 */

/** Returns the display text for a tag in the given locale */
export const getTagText = (tagObj: any, locale: string): string => {
  if (!tagObj) return "";
  return locale === "pl" ? tagObj.pl : tagObj.en;
};

/** Returns the negative prompt text for a tag in the given locale */
export const getNegativeTagText = (tagObj: any, locale: string): string => {
  if (!tagObj) return "";
  return locale === "pl" ? tagObj.neg_pl : tagObj.neg_en;
};

/** Returns a stable, unique identifier string for a tag object */
export const getTagId = (tagObj: any): string => {
  if (!tagObj) return "";
  return `${tagObj.category}__${tagObj.pl}__${tagObj.en}`;
};
