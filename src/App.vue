<script setup>
import axios from 'axios'
import { computed, provide, ref, watch } from 'vue'

import Header from '@/components/Header.vue'
import Drawer from '@/components/Drawer.vue'

/* Корзина START */
const cart = ref([])
const drawerOpen = ref(false)
const isCreatingOrder = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round(totalPrice.value * 0.05))
const IsEmpty = computed(() => cart.value.length === 0)
const cartButtonDisebled = computed(() => isCreatingOrder.value || IsEmpty.value)

const toggleDrawer = (value) => {
  drawerOpen.value = value
}

const createOrder = async () => {
  isCreatingOrder.value = true

  try {
    const { data } = await axios.post('https://4a1b50aa4b7f0b0c.mokky.dev/orders', {
      items: cart.value,
      totalPrice: totalPrice.value,
    })

    cart.value = []

    return data
  } catch (error) {
    console.log(error)
  } finally {
    isCreatingOrder.value = false
  }
}

const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

const cartLogic = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true },
)

provide('cart', {
  toggleDrawer,
  cartLogic,
  removeFromCart,
  cart,
})
/* Корзина END */
</script>

<template>
  <Drawer
    v-if="drawerOpen"
    :total-price="totalPrice"
    :vat-price="vatPrice"
    @create-order="createOrder"
    :is-creating-order="isCreatingOrder"
    :is-button-disabled="cartButtonDisebled"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header :total-price="totalPrice" />
    <div class="p-10">
      <RouterView />
    </div>
  </div>
</template>
