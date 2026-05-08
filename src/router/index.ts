import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateCardView from '../views/CreateCardView.vue'
import RecipientCardView from '../views/RecipientCardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateCardView,
    },
    {
      path: '/card/:id',
      name: 'card',
      component: RecipientCardView,
    },
  ],
})

export default router
