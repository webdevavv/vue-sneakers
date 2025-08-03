<script setup>
import { inject } from 'vue'
import CartItem from './CartItem.vue'

const { cart, removeFromCart } = inject('cart')
</script>

<template>
  <div class="flex flex-col gap-5 overflow-auto max-h-[600px] h-full" v-auto-animate>
    <CartItem
      v-for="item in cart"
      :key="item.id"
      :title="item.title"
      :price="item.price"
      :img="item.imageUrl"
      @on-click-remove="() => removeFromCart(item)"
    />
  </div>
</template>
