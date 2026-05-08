<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCardStore } from '../stores/cardStore'
import { aiMessages } from '../data/aiMessages'

const cardStore = useCardStore()
const showAiDialog = ref(false)

const letterContent = computed({
  get: () => cardStore.state.letter,
  set: (value: string) => cardStore.setLetter(value)
})

const selectAiMessage = (content: string) => {
  cardStore.setLetter(content)
  showAiDialog.value = false
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-gray-700">편지 쓰기</h3>
      <button 
        @click="showAiDialog = true"
        class="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-1"
      >
        ✨ AI 문구 추천받기
      </button>
    </div>

    <div class="relative">
      <textarea
        v-model="letterContent"
        placeholder="부모님께 전하고 싶은 진심 어린 마음을 적어보세요."
        class="w-full h-40 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all text-gray-700 resize-none text-sm leading-relaxed"
      ></textarea>
      <div class="absolute bottom-3 right-4 text-[10px] text-gray-400">
        {{ letterContent.length }}자
      </div>
    </div>

    <!-- AI Recommendations Modal-like Overlay -->
    <div v-if="showAiDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between mb-6">
          <h4 class="font-bold text-gray-800">AI 추천 문구</h4>
          <button @click="showAiDialog = false" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <button
            v-for="msg in aiMessages"
            :key="msg.id"
            @click="selectAiMessage(msg.content)"
            class="w-full text-left p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/50 rounded-2xl transition-all group"
          >
            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap group-hover:text-gray-800">
              {{ msg.content }}
            </p>
          </button>
        </div>
        
        <p class="mt-6 text-[11px] text-gray-400 text-center">
          * 문구를 선택한 후 자유롭게 수정할 수 있습니다.
        </p>
      </div>
    </div>
  </div>
</template>
