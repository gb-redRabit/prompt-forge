import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEditorStore } from '../../app/stores/editor'
import type { TagItem } from '../../shared/types/content'

describe('Editor Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('toggles favorites correctly', () => {
    const store = useEditorStore()
    
    // Add to favorites
    store.toggleFavorite('Cartoon')
    expect(store.favorites).toContain('Cartoon')
    
    // Remove from favorites
    store.toggleFavorite('Cartoon')
    expect(store.favorites).not.toContain('Cartoon')
  })

  it('toggles tags correctly', () => {
    const store = useEditorStore()
    store.currentCategory = 'Style'
    
    const mockTag: TagItem = {
      category: 'Style',
      pl: 'Kreskówkowy',
      en: 'Cartoon',
      nsfw: false
    }

    // Add tag
    store.toggleTag(mockTag)
    expect(store.selectedTags['Style']).toBeDefined()
    expect(store.selectedTags['Style'].length).toBe(1)
    expect(store.selectedTags['Style'][0].en).toBe('Cartoon')
    expect(store.selectedTags['Style'][0].weight).toBe(1.0)
    
    // Remove tag
    store.toggleTag(mockTag)
    expect(store.selectedTags['Style']).toBeUndefined()
  })

  it('updates tag properties correctly', () => {
    const store = useEditorStore()
    store.currentCategory = 'Style'
    
    const mockTag: TagItem = {
      category: 'Style',
      pl: 'Kreskówkowy',
      en: 'Cartoon',
      nsfw: false
    }

    store.toggleTag(mockTag)
    
    // Update weight
    store.updateTag('Style', 0, { weight: 1.5, emphasis: 2 })
    
    expect(store.selectedTags['Style'][0].weight).toBe(1.5)
    expect(store.selectedTags['Style'][0].emphasis).toBe(2)
  })

  it('generates prompt strings correctly', () => {
    const store = useEditorStore()
    store.currentCategory = 'Style'
    
    const mockTag1: TagItem = {
      category: 'Style',
      pl: 'Kreskówkowy',
      en: 'Cartoon',
      nsfw: false
    }
    const mockTag2: TagItem = {
      category: 'Subject',
      pl: 'Kot',
      en: 'Cat',
      nsfw: false
    }

    store.toggleTag(mockTag1)
    store.updateTag('Style', 0, { weight: 1.2, emphasis: 1 })
    
    store.currentCategory = 'Subject'
    store.toggleTag(mockTag2)

    const result = store.getGeneratedPrompt('en', ['Subject', 'Style'])
    
    // Depending on logic, format might be: Cat, (Cartoon:1.2)
    expect(result.positive).toBe('Cat, ((Cartoon):1.2)')
  })
})
