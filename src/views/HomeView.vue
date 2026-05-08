<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 class="mb-6 font-bold text-4xl text-rose-600">어버이날 감사 카드</h1>
    <p class="mb-8 text-gray-600">사랑하는 부모님께 마음을 전하세요.</p>
    <router-link
      to="/create"
      class="bg-rose-500 hover:bg-rose-600 px-8 py-3 rounded-full font-semibold text-white transition-colors"
    >
      카드 만들기
    </router-link>
  </div>
</template>
