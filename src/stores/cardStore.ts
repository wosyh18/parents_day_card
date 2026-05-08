import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CardState, PlacedSticker } from '../types/card'
import { backgrounds } from '../data/backgrounds'

export const useCardStore = defineStore('card', () => {
  const state = ref<CardState>({
    selectedBackgroundId: backgrounds[0].id,
    photoDataUrl: null,
    photoTransform: { x: 0, y: 0, scale: 1, rotation: 0 },
    placedStickers: [],
    letter: '',
    audioDataUrl: null,
  })

  const selectedBackground = computed(() => {
    return backgrounds.find(bg => bg.id === state.value.selectedBackgroundId) || backgrounds[0]
  })

  function setBackground(id: string) {
    state.value.selectedBackgroundId = id
  }

  function setPhoto(dataUrl: string | null) {
    state.value.photoDataUrl = dataUrl
    // Reset transform when new photo is uploaded
    state.value.photoTransform = { x: 0, y: 0, scale: 1, rotation: 0 }
  }

  function updatePhotoTransform(transform: Partial<{ x: number, y: number, scale: number, rotation: number }>) {
    state.value.photoTransform = { ...state.value.photoTransform, ...transform }
  }

  function addSticker(stickerId: string) {
    const newSticker: PlacedSticker = {
      id: crypto.randomUUID(),
      stickerId,
      x: 20 + Math.random() * 60, // Random center-ish position
      y: 20 + Math.random() * 60,
      rotation: Math.random() * 40 - 20, // -20 to 20 deg
      scale: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
    }
    state.value.placedStickers.push(newSticker)
  }

  function removeSticker(instanceId: string) {
    state.value.placedStickers = state.value.placedStickers.filter(s => s.id !== instanceId)
  }

  function updateStickerTransform(instanceId: string, transform: Partial<{ x: number, y: number, scale: number, rotation: number }>) {
    const sticker = state.value.placedStickers.find(s => s.id === instanceId)
    if (sticker) {
      Object.assign(sticker, transform)
    }
  }

  function setLetter(text: string) {
    state.value.letter = text
  }

  function setAudio(dataUrl: string | null) {
    state.value.audioDataUrl = dataUrl
  }

  return {
    state,
    selectedBackground,
    setBackground,
    setPhoto,
    updatePhotoTransform,
    addSticker,
    removeSticker,
    updateStickerTransform,
    setLetter,
    setAudio,
  }
})
