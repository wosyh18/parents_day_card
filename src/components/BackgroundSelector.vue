<script setup lang="ts">
import { backgrounds } from '../data/backgrounds'
import { useCardStore } from '../stores/cardStore'

const cardStore = useCardStore()
</script>

<template>
  <div class="w-full">
    <h3 class="text-sm font-bold text-gray-700 mb-3">배경 선택</h3>
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="bg in backgrounds"
        :key="bg.id"
        @click="cardStore.setBackground(bg.id)"
        class="aspect-square rounded-lg border-2 transition-all overflow-hidden"
        :class="[
          cardStore.state.selectedBackgroundId === bg.id 
            ? 'border-rose-500 ring-2 ring-rose-200' 
            : 'border-transparent hover:border-gray-200'
        ]"
        :style="{ background: bg.value }"
        :title="bg.name"
      >
        <span class="sr-only">{{ bg.name }}</span>
      </button>
    </div>
  </div>
</template>
