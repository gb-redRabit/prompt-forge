import { describe, it, expect } from 'vitest'
import { getTagText, getNegativeTagText, getTagId } from '../../app/utils/tags'
import type { TagItem } from '../../shared/types/content'

describe('tags utilities', () => {
  const mockTag: TagItem = {
    category: 'Style',
    pl: 'Kreskówkowy',
    en: 'Cartoon',
    neg_pl: 'Realistyczny',
    neg_en: 'Realistic',
    nsfw: false,
    weight: 1.0,
    emphasis: 0,
  }

  describe('getTagText', () => {
    it('returns Polish text when locale is pl', () => {
      expect(getTagText(mockTag, 'pl')).toBe('Kreskówkowy')
    })

    it('returns English text when locale is en', () => {
      expect(getTagText(mockTag, 'en')).toBe('Cartoon')
    })

    it('returns empty string if tagObj is undefined', () => {
      expect(getTagText(null, 'en')).toBe('')
    })
  })

  describe('getNegativeTagText', () => {
    it('returns Polish negative text when locale is pl', () => {
      expect(getNegativeTagText(mockTag, 'pl')).toBe('Realistyczny')
    })

    it('returns English negative text when locale is en', () => {
      expect(getNegativeTagText(mockTag, 'en')).toBe('Realistic')
    })

    it('returns empty string if tagObj is undefined', () => {
      expect(getNegativeTagText(null, 'en')).toBe('')
    })
  })

  describe('getTagId', () => {
    it('returns a stable identifier', () => {
      expect(getTagId(mockTag)).toBe('Style__Kreskówkowy__Cartoon')
    })

    it('returns empty string if tagObj is undefined', () => {
      expect(getTagId(null)).toBe('')
    })
  })
})
