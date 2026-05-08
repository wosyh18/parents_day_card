<script setup lang="ts">
import { stickers } from '../data/stickers'
import { useCardStore } from '../stores/cardStore'

const cardStore = useCardStore()
</script>

<template>
  <div class="w-full">
    <h3 class="text-sm font-bold text-gray-700 mb-3">스티커 꾸미기</h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="sticker in stickers"
        :key="sticker.id"
        @click="cardStore.addSticker(sticker.id)"
        class="w-12 h-12 flex items-center justify-center text-2xl bg-gray-50 hover:bg-rose-50 rounded-xl border border-gray-100 transition-colors"
      >
        {{ sticker.emoji }}
      </button>
    </div>
    <p class="text-[10px] text-gray-400 mt-2">* 클릭하면 카드에 랜덤하게 배치됩니다.</p>
  </div>
</template>
