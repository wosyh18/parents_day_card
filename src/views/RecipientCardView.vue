<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import confetti from 'canvas-confetti'
import InteractiveCard from '../components/InteractiveCard.vue'
import { loadCardFromLocal } from '../lib/cardStorage'
import { useCardStore } from '../stores/cardStore'

const route = useRoute()
const cardStore = useCardStore()

const isLoading = ref(true)
const error = ref('')
const isOpen = ref(false)
const reaction = ref('')

onMounted(() => {
  const id = route.params.id as string
  const data = loadCardFromLocal(id)
  
  if (data) {
    cardStore.state = data
  } else {
    error.value = '카드를 찾을 수 없습니다. (링크가 잘못되었거나 다른 브라우저에서 생성된 카드일 수 있습니다.)'
  }
  isLoading.value = false
})

const openEnvelope = () => {
  isOpen.value = true
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#fb7185', '#fda4af', '#fff1f2']
  })
}

const sendReaction = (type: string) => {
  reaction.value = type
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.8 },
    colors: ['#fb7185', '#f43f5e']
  })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-rose-50 overflow-hidden">
    <div v-if="isLoading" class="text-rose-500 font-bold animate-pulse">
      카드를 불러오는 중...
    </div>

    <div v-else-if="error" class="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm">
      <div class="text-5xl mb-4">😢</div>
      <p class="text-gray-700 font-medium leading-relaxed mb-6">{{ error }}</p>
      <router-link to="/" class="text-rose-500 font-bold underline">나도 카드 만들기</router-link>
    </div>

    <div v-else class="w-full max-w-md flex flex-col items-center">
      <!-- Envelope Opening Phase -->
      <div v-if="!isOpen" @click="openEnvelope" class="cursor-pointer group relative">
        <div class="w-64 h-48 bg-rose-100 rounded-b-xl shadow-lg flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105">
          <div class="absolute top-0 left-0 w-full h-full border-t-[96px] border-t-rose-200 border-x-[128px] border-x-transparent z-10"></div>
          <div class="text-rose-400 font-bold z-20">클릭하여 열어보기</div>
          <div class="absolute bottom-4 right-4 text-3xl animate-bounce">💌</div>
        </div>
      </div>

      <!-- Card Display Phase -->
      <div v-else class="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <InteractiveCard />
        
        <div class="w-full bg-white p-6 rounded-3xl shadow-xl border border-rose-100/50 flex flex-col items-center">
          <p class="text-sm font-bold text-gray-700 mb-4">마음을 답해주세요</p>
          <div class="grid grid-cols-4 gap-2 w-full">
            <button 
              @click="sendReaction('love')"
              class="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-rose-50 transition-colors"
              :class="{ 'bg-rose-50 ring-2 ring-rose-200': reaction === 'love' }"
            >
              <span class="text-2xl">💖</span>
              <span class="text-[10px] font-bold text-gray-500">사랑해요</span>
            </button>
            <button 
              @click="sendReaction('thanks')"
              class="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-rose-50 transition-colors"
              :class="{ 'bg-rose-50 ring-2 ring-rose-200': reaction === 'thanks' }"
            >
              <span class="text-2xl">🙏</span>
              <span class="text-[10px] font-bold text-gray-500">고마워요</span>
            </button>
            <button 
              @click="sendReaction('touch')"
              class="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-rose-50 transition-colors"
              :class="{ 'bg-rose-50 ring-2 ring-rose-200': reaction === 'touch' }"
            >
              <span class="text-2xl">😭</span>
              <span class="text-[10px] font-bold text-gray-500">감동이에요</span>
            </button>
            <button 
              @click="sendReaction('happy')"
              class="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-rose-50 transition-colors"
              :class="{ 'bg-rose-50 ring-2 ring-rose-200': reaction === 'happy' }"
            >
              <span class="text-2xl">😆</span>
              <span class="text-[10px] font-bold text-gray-500">웃겼어요</span>
            </button>
          </div>
        </div>

        <router-link to="/" class="text-rose-500 font-bold bg-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all">
          나도 카드 만들기
        </router-link>
      </div>
    </div>
  </div>
</template>
