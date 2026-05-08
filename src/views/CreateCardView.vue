<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InteractiveCard from '../components/InteractiveCard.vue'
import BackgroundSelector from '../components/BackgroundSelector.vue'
import StickerPicker from '../components/StickerPicker.vue'
import LetterEditor from '../components/LetterEditor.vue'
import VoiceRecorder from '../components/VoiceRecorder.vue'
import { useCardStore } from '../stores/cardStore'
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
  await exportCardAsImage('interactive-card')
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
  </div>
</template>
