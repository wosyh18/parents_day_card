<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useCardStore } from '../stores/cardStore'
import { stickers } from '../data/stickers'

const props = defineProps<{
  editable?: boolean
  isExporting?: boolean
}>()

const cardStore = useCardStore()
const isFlipped = ref(false)
const isPlaying = ref(false)
const audioInstance = ref<HTMLAudioElement | null>(null)

// Touch/Interaction State
const isInteracting = ref(false)
const activeStickerId = ref<string | null>(null)
const cardElement = ref<HTMLElement | null>(null)
const lastTouchX = ref(0)
const lastTouchY = ref(0)
const lastDist = ref(0)
const lastAngle = ref(0)

const toggleFlip = () => {
  if (isInteracting.value) return
  isFlipped.value = !isFlipped.value
  // Stop playback if flipping back to front
  if (!isFlipped.value && isPlaying.value) {
    stopAudio()
  }
}

// Global Touch Listeners for reliable dragging
const onTouchStart = (e: TouchEvent, stickerId: string | null = null) => {
  if (!props.editable || isFlipped.value) return
  
  isInteracting.value = true
  activeStickerId.value = stickerId
  
  if (e.touches.length === 1) {
    lastTouchX.value = e.touches[0].clientX
    lastTouchY.value = e.touches[0].clientY
  } else if (e.touches.length === 2) {
    lastDist.value = getDistance(e.touches[0], e.touches[1])
    lastAngle.value = getAngle(e.touches[0], e.touches[1])
  }

  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd)
}

const onTouchMove = (e: TouchEvent) => {
  if (!props.editable || !isInteracting.value || isFlipped.value) return
  
  // Only prevent default if we're actually interacting to allow normal scrolling otherwise
  if (e.cancelable) e.preventDefault()

  if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - lastTouchX.value
    const dy = e.touches[0].clientY - lastTouchY.value
    
    if (activeStickerId.value) {
      handleStickerMove(activeStickerId.value, dx, dy)
    } else {
      cardStore.updatePhotoTransform({
        x: cardStore.state.photoTransform.x + dx,
        y: cardStore.state.photoTransform.y + dy
      })
    }
    
    lastTouchX.value = e.touches[0].clientX
    lastTouchY.value = e.touches[0].clientY
  } else if (e.touches.length === 2) {
    const dist = getDistance(e.touches[0], e.touches[1])
    const angle = getAngle(e.touches[0], e.touches[1])
    
    const scaleDiff = dist / lastDist.value
    const angleDiff = angle - lastAngle.value
    
    if (activeStickerId.value) {
      const sticker = cardStore.state.placedStickers.find(s => s.id === activeStickerId.value)
      if (sticker) {
        cardStore.updateStickerTransform(activeStickerId.value, {
          scale: sticker.scale * scaleDiff,
          rotation: sticker.rotation + angleDiff
        })
      }
    } else {
      cardStore.updatePhotoTransform({
        scale: cardStore.state.photoTransform.scale * scaleDiff,
        rotation: cardStore.state.photoTransform.rotation + angleDiff
      })
    }
    
    lastDist.value = dist
    lastAngle.value = angle
  }
}

const onTouchEnd = () => {
  // Use a small timeout to prevent immediate click (flip) after interaction
  setTimeout(() => {
    isInteracting.value = false
    activeStickerId.value = null
  }, 50)
  
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onTouchEnd)
}

const onMouseDown = (e: MouseEvent, stickerId: string | null = null) => {
  if (!props.editable || isFlipped.value) return
  
  isInteracting.value = true
  activeStickerId.value = stickerId
  lastTouchX.value = e.clientX
  lastTouchY.value = e.clientY
  
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onTouchEnd)
}

const onMouseMove = (e: MouseEvent) => {
  if (!props.editable || !isInteracting.value || isFlipped.value) return
  
  const dx = e.clientX - lastTouchX.value
  const dy = e.clientY - lastTouchY.value
  
  if (activeStickerId.value) {
    handleStickerMove(activeStickerId.value, dx, dy)
  } else {
    cardStore.updatePhotoTransform({
      x: cardStore.state.photoTransform.x + dx,
      y: cardStore.state.photoTransform.y + dy
    })
  }
  
  lastTouchX.value = e.clientX
  lastTouchY.value = e.clientY
}

const handleStickerMove = (id: string, dx: number, dy: number) => {
  if (!cardElement.value) return
  
  const rect = cardElement.value.getBoundingClientRect()
  const percentX = (dx / rect.width) * 100
  const percentY = (dy / rect.height) * 100
  
  const sticker = cardStore.state.placedStickers.find(s => s.id === id)
  if (sticker) {
    cardStore.updateStickerTransform(id, {
      x: sticker.x + percentX,
      y: sticker.y + percentY
    })
  }
}

const getDistance = (t1: Touch, t2: Touch) => {
  return Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2))
}

const getAngle = (t1: Touch, t2: Touch) => {
  return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180 / Math.PI
}

const toggleAudio = (event: Event) => {
  event.stopPropagation() // Prevent card flip
  
  if (!cardStore.state.audioDataUrl) return

  if (isPlaying.value) {
    stopAudio()
  } else {
    playAudio()
  }
}

const playAudio = () => {
  if (!cardStore.state.audioDataUrl) return
  
  audioInstance.value = new Audio(cardStore.state.audioDataUrl)
  audioInstance.value.onended = () => {
    isPlaying.value = false
  }
  audioInstance.value.play()
  isPlaying.value = true
}

const stopAudio = () => {
  if (audioInstance.value) {
    audioInstance.value.pause()
    audioInstance.value.currentTime = 0
    isPlaying.value = false
  }
}

const backgroundStyle = computed(() => {
  const bg = cardStore.selectedBackground
  return {
    background: bg.value
  }
})

const getStickerEmoji = (stickerId: string) => {
  return stickers.find(s => s.id === stickerId)?.emoji || '❓'
}

onUnmounted(() => {
  stopAudio()
})
</script>

<template>
  <div 
    id="interactive-card"
    class="card-container w-full max-w-[320px] aspect-[3/4] cursor-pointer"
    @click="toggleFlip"
  >
    <div 
      class="card-inner relative w-full h-full transition-transform duration-700 preserve-3d"
      :class="{ 'flipped': isFlipped }"
    >
      <!-- Front Side -->
      <div 
        ref="cardElement"
        class="card-front absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-xl overflow-hidden flex flex-col items-center justify-center p-6 border-4 border-white/50"
        :style="backgroundStyle"
      >
        <div 
          class="w-full h-full rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300/50 relative overflow-hidden bg-white/30 backdrop-blur-[2px]"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
        >
          <!-- Photo Container -->
          <div v-if="cardStore.state.photoDataUrl" class="w-full h-full relative pointer-events-none">
            <img 
              :src="cardStore.state.photoDataUrl" 
              class="absolute origin-center transition-transform duration-0"
              :style="{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${cardStore.state.photoTransform.x}px, ${cardStore.state.photoTransform.y}px) scale(${cardStore.state.photoTransform.scale}) rotate(${cardStore.state.photoTransform.rotation}deg)`,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }"
            />
          </div>
          <div v-else class="text-gray-400 flex flex-col items-center">
            <span class="text-4xl mb-2">📸</span>
            <p class="text-sm font-medium">사진을 업로드하세요</p>
          </div>
          
          <!-- Stickers -->
          <div 
            v-for="placed in cardStore.state.placedStickers" 
            :key="placed.id"
            class="absolute select-none transition-transform duration-0 active:scale-110 active:opacity-80"
            :class="{ 'cursor-move': props.editable, 'pointer-events-none': !props.editable }"
            :style="{
              left: `${placed.x}%`,
              top: `${placed.y}%`,
              transform: `translate(-50%, -50%) rotate(${placed.rotation}deg) scale(${placed.scale})`,
              fontSize: '2rem',
              zIndex: activeStickerId === placed.id ? 50 : 10
            }"
            @touchstart.stop="onTouchStart($event, placed.id)"
            @mousedown.stop="onMouseDown($event, placed.id)"
          >
            {{ getStickerEmoji(placed.stickerId) }}
          </div>
        </div>
        <p class="mt-4 text-gray-700 font-bold drop-shadow-sm">감사합니다 사랑합니다</p>
      </div>

      <!-- Back Side -->
      <div 
        class="card-back absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-xl p-6 border-4 border-white/50 rotate-y-180 flex flex-col"
        :style="backgroundStyle"
      >
        <div class="flex-grow bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-inner mb-4 overflow-y-auto custom-scrollbar">
          <!-- Letter Content -->
          <div v-if="cardStore.state.letter" class="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed font-handwriting">
            {{ cardStore.state.letter }}
          </div>
          <div v-else class="h-full flex items-center justify-center text-gray-400 italic text-sm">
            편지 내용을 입력하세요...
          </div>
        </div>
        
        <!-- Audio Player -->
        <div 
          v-if="cardStore.state.audioDataUrl"
          @click="toggleAudio"
          class="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 shadow-sm hover:bg-white transition-colors"
        >
          <button class="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <div class="flex-grow flex flex-col">
            <div class="flex items-center justify-between mb-0.5">
              <span class="text-[10px] font-bold text-rose-500">목소리 편지</span>
              <span class="text-[10px] text-gray-400">{{ isPlaying ? '재생 중' : '클릭하여 듣기' }}</span>
            </div>
            <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-rose-300 transition-all duration-300"
                :class="{ 'w-full': isPlaying, 'w-0': !isPlaying }"
              ></div>
            </div>
          </div>
        </div>
        <div 
          v-else 
          class="bg-gray-100/50 rounded-full px-4 py-2 flex items-center gap-3 border border-dashed border-gray-300"
        >
          <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs">
            🔇
          </div>
          <span class="text-[10px] text-gray-400">녹음된 음성이 없습니다.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flipped {
  transform: rotateY(180deg);
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.font-handwriting {
  font-family: 'Nanum Pen Script', 'Segoe Print', 'Apple Chancery', cursive;
  font-size: 1.1rem;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(244, 63, 94, 0.2);
  border-radius: 10px;
}
</style>
