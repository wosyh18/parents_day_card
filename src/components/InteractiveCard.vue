<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useCardStore } from '../stores/cardStore'
import { stickers } from '../data/stickers'

const cardStore = useCardStore()
const isFlipped = ref(false)
const isPlaying = ref(false)
const audioInstance = ref<HTMLAudioElement | null>(null)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
  // Stop playback if flipping back to front
  if (!isFlipped.value && isPlaying.value) {
    stopAudio()
  }
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
        class="card-front absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-xl overflow-hidden flex flex-col items-center justify-center p-6 border-4 border-white/50"
        :style="backgroundStyle"
      >
        <div class="w-full h-full rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300/50 relative overflow-hidden bg-white/30 backdrop-blur-[2px]">
          <!-- Photo Container -->
          <div v-if="cardStore.state.photoDataUrl" class="w-full h-full">
            <img :src="cardStore.state.photoDataUrl" class="w-full h-full object-cover" />
          </div>
          <div v-else class="text-gray-400 flex flex-col items-center">
            <span class="text-4xl mb-2">📸</span>
            <p class="text-sm font-medium">사진을 업로드하세요</p>
          </div>
          
          <!-- Stickers -->
          <div 
            v-for="placed in cardStore.state.placedStickers" 
            :key="placed.id"
            class="absolute pointer-events-none select-none"
            :style="{
              left: `${placed.x}%`,
              top: `${placed.y}%`,
              transform: `translate(-50%, -50%) rotate(${placed.rotation}deg) scale(${placed.scale})`,
              fontSize: '2rem'
            }"
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
