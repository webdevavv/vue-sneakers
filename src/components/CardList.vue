<script setup>
import CardItem from './CardItem.vue'

defineProps({
  items: Array,
  isFavorites: Boolean,
})

const emit = defineEmits(['addToFavorite', 'addToCart'])
</script>

<template>
  <div class="mt-8 grid grid-cols-4 gap-5" v-auto-animate>
    <CardItem
      v-for="item in items"
      :image-url="item.imageUrl"
      :price="item.price"
      :title="item.title"
      :key="item.id"
      :on-click-add="() => emit('addToCart', item)"
      :on-click-favorite="isFavorites ? null : () => emit('addToFavorite', item)"
      :is-favorite="item.isFavorite"
      :is-added="item.isAdded"
      :id="item.id"
    />
  </div>
</template>
