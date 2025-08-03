<script setup>
import axios from 'axios'

import CardList from '@/components/CardList.vue'
import { ref, inject, reactive, watch, onMounted } from 'vue'

const items = ref([])
const filters = reactive({
  sortBy: 'title',
  searchQuery: '',
})

const { cart, cartLogic } = inject('cart')

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get('https://4a1b50aa4b7f0b0c.mokky.dev/favorites')
    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)
      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      item.isFavorite = true
      const obj = {
        parentId: item.id,
        item,
      }
      const { data } = await axios.post('https://4a1b50aa4b7f0b0c.mokky.dev/favorites', obj)

      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://4a1b50aa4b7f0b0c.mokky.dev/favorites/${item.favoriteId}`)
      item.favoriteId = null
    }
  } catch (error) {
    item.isFavorite = false
    console.log(error)
  }
}

const fetchItems = async () => {
  const params = {
    sortBy: filters.sortBy,
  }

  if (filters.searchQuery) {
    params.title = `*${filters.searchQuery}*`
  }

  try {
    const { data } = await axios.get('https://4a1b50aa4b7f0b0c.mokky.dev/items', { params })
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false,
    }))
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]')
  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }))
})

watch(filters, fetchItems)
watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }))
})
</script>
<template>
  <div class="flex justify-between items-center mb-10">
    <h1 class="text-3xl font-bold">Все кроссовки</h1>
    <div class="flex items-center gap-4">
      <select
        class="py-2 px-3 border border-gray-200 focus:border-gray-400 rounded-md focus:outline-none"
        v-model="filters.sortBy"
      >
        <option value="title">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>
      <div class="relative">
        <input
          type="text"
          class="border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400"
          placeholder="Поиск..."
          v-model="filters.searchQuery"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src="/search.svg" />
        </div>
      </div>
    </div>
  </div>

  <div class="mt-10">
    <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="cartLogic" />
  </div>
</template>
