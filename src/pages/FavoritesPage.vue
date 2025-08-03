<script setup>
import axios from 'axios'
import { onMounted, ref, inject } from 'vue'

import CardList from '@/components/CardList.vue'

const favorites = ref([])
const { cartLogic } = inject('cart')

onMounted(async () => {
  try {
    const { data } = await axios.get('https://4a1b50aa4b7f0b0c.mokky.dev/favorites')

    favorites.value = data.map((obj) => obj.item)
  } catch (error) {
    console.log(error)
  }
})
</script>
<template>
  <div class="flex justify-between items-center mb-10">
    <h1 class="text-3xl font-bold">Закладки</h1>
  </div>
  <div class="mt-10">
    <CardList :items="favorites" @add-to-cart="cartLogic" is-favorites />
  </div>
</template>
