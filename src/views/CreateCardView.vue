<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InteractiveCard from '../components/InteractiveCard.vue'
import BackgroundSelector from '../components/BackgroundSelector.vue'
import StickerPicker from '../components/StickerPicker.vue'
import LetterEditor from '../components/LetterEditor.vue'
import VoiceRecorder from '../components/VoiceRecorder.vue'
import { useCardStore } from '../stores/cardStore'
import { stickers } from '../data/stickers'
import { exportCardAsImage } from '../lib/imageExport'
import { saveCardToLocal } from '../lib/cardStorage'
import { initKakao, shareToKakao } from '../lib/kakao'

const cardStore = useCardStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)
const savedId = ref('')

onMounted(() => {
  initKakao()
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      cardStore.setPhoto(result)
    }
    reader.readAsDataURL(file)
  }
}

const handleExportImage = async () => {
  if (isSaving.value) return
  isSaving.value = true
  
  try {
    const el = document.getElementById('full-card-capture')
    if (el) {
      // 1. 선명한 캡처를 위해 실제 가시성을 부여하되 화면 맨 뒤로 보냄
      el.style.display = 'flex'
      el.style.position = 'fixed'
      el.style.left = '0'
      el.style.top = '0'
      el.style.opacity = '1'
      el.style.visibility = 'visible'
      el.style.zIndex = '-9999' 
      
      // 2. 렌더링 엔진이 모든 요소를 그리도록 충분히 대기
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 3. 캡처 실행
      await exportCardAsImage('full-card-capture', `parents-day-card-${Date.now()}.png`)
      
      // 4. 완료 후 다시 숨김
      el.style.display = 'none'
      el.style.left = '-9999px'
      el.style.visibility = 'hidden'
    }
  } catch (err) {
    console.error('Export Error:', err)
    alert('이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
  } finally {
    isSaving.value = false
  }
}

const handleSaveCard = () => {
  isSaving.value = true
  try {
    const id = saveCardToLocal(cardStore.state)
    savedId.value = id
    alert('카드가 로컬 저장소에 저장되었습니다! (같은 브라우저에서만 공유 가능)')
  } catch (err) {
    console.error(err)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
    isSaving.value = false
  }
}

const handleCopyLink = () => {
  if (!savedId.value) {
    const id = saveCardToLocal(cardStore.state)
    savedId.value = id
  }
  
  const url = `${window.location.origin}/card/${savedId.value}`
  navigator.clipboard.writeText(url).then(() => {
    alert('공유 링크가 클립보드에 복사되었습니다. (같은 기기/브라우저 전용)')
  })
}

const handleKakaoShare = () => {
  if (!savedId.value) {
    const id = saveCardToLocal(cardStore.state)
    savedId.value = id
  }
  
  const success = shareToKakao(savedId.value, cardStore.state.letter || '부모님 사랑합니다!')
  if (!success) {
    alert('카카오톡 SDK가 초기화되지 않았거나 키가 누락되었습니다. 링크 복사를 이용해주세요.')
  }
}
</script>

<template>
  <div class="flex flex-col items-center min-h-screen p-4 bg-rose-50 pb-32">
    <header class="w-full max-w-md mb-8 flex items-center justify-between">
      <router-link to="/" class="text-rose-500 font-semibold">← 뒤로</router-link>
      <h1 class="text-xl font-bold text-gray-800">카드 꾸미기</h1>
      <div class="w-10"></div>
    </header>

    <main class="w-full max-w-md flex flex-col items-center gap-8">
      <InteractiveCard :editable="true" />
      
      <div class="w-full space-y-8 bg-white p-6 rounded-3xl shadow-xl shadow-rose-100/50 border border-rose-100/50">
        <!-- Photo Upload -->
        <div>
          <h3 class="text-sm font-bold text-gray-700 mb-3">사진 올리기</h3>
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*" 
            @change="handlePhotoUpload" 
          />
          <button 
            @click="triggerFileInput"
            class="w-full py-4 border-2 border-dashed border-rose-100 rounded-2xl text-rose-400 hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
          >
            <span class="text-xl">📷</span>
            <span class="font-medium text-sm">{{ cardStore.state.photoDataUrl ? '사진 변경하기' : '기기에서 사진 선택' }}</span>
          </button>
        </div>

        <BackgroundSelector />
        
        <StickerPicker />

        <LetterEditor />

        <VoiceRecorder />

        <!-- Final Actions -->
        <div class="space-y-3 pt-4 border-t border-gray-100">
          <button 
            @click="handleExportImage"
            class="w-full py-4 bg-white text-rose-500 border-2 border-rose-500 rounded-2xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
          >
            🖼️ 현재 카드 이미지 저장하기
          </button>
          
          <button 
            @click="handleSaveCard"
            :disabled="isSaving"
            class="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            💾 카드 저장하기
          </button>

          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="handleCopyLink"
              class="py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              🔗 링크 복사
            </button>
            <button 
              @click="handleKakaoShare"
              class="py-3 bg-[#FEE500] text-[#3c1e1e] rounded-xl text-sm font-bold hover:bg-[#FADA0A] transition-all flex items-center justify-center gap-2"
            >
              💬 카카오톡 공유
            </button>
          </div>
          <p class="text-[10px] text-gray-400 text-center">
            * MVP 버전에서는 같은 브라우저에서만 링크 확인이 가능합니다.
          </p>
        </div>
      </div>
    </main>

    <!-- Hidden Capture Area (Front and Back combined) -->
    <div 
      id="full-card-capture" 
      class="flex-col gap-8 p-12 w-[500px]"
      style="display: none; position: fixed; left: -9999px; background-color: #ffffff; font-family: sans-serif;"
    >
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold mb-2" style="color: #f43f5e !important;">어버이날 사랑 카드</h2>
        <p style="color: #4b5563 !important; font-size: 16px;">항상 감사하고 사랑합니다.</p>
      </div>

      <!-- Front Side -->
      <div 
        class="w-full aspect-[3/4] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 border-[6px] border-white relative"
        :style="{ background: cardStore.selectedBackground.value }"
      >
        <div class="w-full h-full rounded-2xl relative overflow-hidden bg-white/30 backdrop-blur-[2px] border-2 border-dashed border-gray-300/30">
          <img 
            v-if="cardStore.state.photoDataUrl"
            :src="cardStore.state.photoDataUrl" 
            class="absolute origin-center"
            :style="{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${cardStore.state.photoTransform.x}px, ${cardStore.state.photoTransform.y}px) scale(${cardStore.state.photoTransform.scale}) rotate(${cardStore.state.photoTransform.rotation}deg)`,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }"
          />
          <div v-for="placed in cardStore.state.placedStickers" :key="placed.id"
            class="absolute"
            :style="{
              left: `${placed.x}%`,
              top: `${placed.y}%`,
              transform: `translate(-50%, -50%) rotate(${placed.rotation}deg) scale(${placed.scale})`,
              fontSize: '3rem'
            }"
          >
            {{ stickers.find(s => s.id === placed.stickerId)?.emoji }}
          </div>
        </div>
        <p class="mt-6 font-bold text-2xl" style="color: #1f2937 !important;">감사합니다 사랑합니다</p>
      </div>

      <!-- Back Side -->
      <div 
        class="w-full aspect-[3/4] rounded-3xl shadow-2xl p-10 border-[6px] border-white flex flex-col"
        :style="{ background: cardStore.selectedBackground.value }"
      >
        <div class="flex-grow rounded-2xl p-8 shadow-inner flex flex-col" style="background-color: rgba(255, 255, 255, 0.95);">
          <div class="whitespace-pre-wrap text-2xl leading-relaxed font-handwriting h-full" style="color: #111827 !important; font-weight: 600;">
            {{ cardStore.state.letter || '사랑하는 부모님께...' }}
          </div>
        </div>
      </div>
      
      <div class="text-center mt-8 opacity-40 text-[14px]" style="color: #6b7280;">
        © 2026 Parents Day Card App
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-handwriting {
  font-family: 'Nanum Pen Script', cursive;
}
</style>
