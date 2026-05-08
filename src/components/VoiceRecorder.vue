<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useCardStore } from '../stores/cardStore'

const cardStore = useCardStore()

const isRecording = ref(false)
const recordingTime = ref(0)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const timerInterval = ref<number | null>(null)
const errorMessage = ref('')
const isSupported = ref(!!(window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia))

const startRecording = async () => {
  try {
    errorMessage.value = ''
    audioChunks.value = []
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream)

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        cardStore.setAudio(base64data)
      }
      reader.readAsDataURL(audioBlob)
      
      // Stop all tracks to release microphone
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.value.start()
    isRecording.value = true
    startTimer()
  } catch (err: any) {
    console.error('Microphone access denied or error:', err)
    if (err.name === 'NotAllowedError') {
      errorMessage.value = '마이크 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.'
    } else {
      errorMessage.value = '녹음을 시작할 수 없습니다. 마이크 연결을 확인해주세요.'
    }
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
    stopTimer()
  }
}

const startTimer = () => {
  recordingTime.value = 0
  timerInterval.value = window.setInterval(() => {
    recordingTime.value++
    if (recordingTime.value >= 60) { // Limit to 1 minute
      stopRecording()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const resetRecording = () => {
  cardStore.setAudio(null)
  recordingTime.value = 0
  errorMessage.value = ''
}

const playPreview = () => {
  if (cardStore.state.audioDataUrl) {
    const audio = new Audio(cardStore.state.audioDataUrl)
    audio.play()
  }
}

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div class="w-full">
    <h3 class="text-sm font-bold text-gray-700 mb-3">음성 메시지</h3>
    
    <div v-if="!isSupported" class="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-xs leading-relaxed">
      ⚠️ 현재 브라우저에서는 음성 녹음 기능을 지원하지 않습니다. 최신 브라우저를 사용해주세요.
    </div>
    
    <div v-else class="space-y-4">
      <!-- Recording Status / Control -->
      <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center">
        <div v-if="isRecording" class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full bg-rose-500 animate-pulse flex items-center justify-center text-white text-2xl">
            🎙️
          </div>
          <div class="text-xl font-mono font-bold text-rose-500">
            {{ formatTime(recordingTime) }}
          </div>
          <button 
            @click="stopRecording"
            class="px-8 py-2 bg-gray-800 text-white rounded-full font-bold text-sm hover:bg-gray-700 transition-all"
          >
            녹음 중지
          </button>
        </div>
        
        <div v-else-if="cardStore.state.audioDataUrl" class="flex flex-col items-center gap-4 w-full">
          <div class="text-rose-500 text-3xl">✅</div>
          <p class="text-sm font-medium text-gray-600">녹음이 완료되었습니다!</p>
          
          <div class="flex gap-2 w-full">
            <button 
              @click="playPreview"
              class="flex-1 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
            >
              <span>▶️</span> 들어보기
            </button>
            <button 
              @click="resetRecording"
              class="flex-1 py-3 bg-gray-50 text-gray-500 border border-gray-100 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <span>🔄</span> 다시 녹음
            </button>
          </div>
        </div>
        
        <div v-else class="flex flex-col items-center gap-3">
          <button 
            @click="startRecording"
            class="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-2xl hover:bg-rose-200 transition-all"
          >
            🎙️
          </button>
          <p class="text-sm font-medium text-gray-500">버튼을 눌러 녹음을 시작하세요</p>
          <p class="text-[10px] text-gray-400">(최대 1분)</p>
        </div>
      </div>
      
      <p v-if="errorMessage" class="text-rose-500 text-[11px] text-center font-medium">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
