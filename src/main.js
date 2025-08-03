import './assets/main.css'

import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from './App.vue'

import HomePage from './pages/HomePage.vue'
import FavoritesPage from './pages/FavoritesPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/favorites', name: 'favorites', component: FavoritesPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(router).use(autoAnimatePlugin).mount('#app')
