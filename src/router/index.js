import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: HomeView,
      meta: { title: '대시보드' }
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/StudentsView.vue'),
      meta: { title: '학생 관리', requiresAuth: true }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue'),
      meta: { title: '통계', requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { title: '설정', requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: '프로필', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: '로그인' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: '소개' }
    }
  ]
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  // 페이지 타이틀 설정
  document.title = to.meta.title ? `${to.meta.title} - 독서실 관리` : '독서실 관리'

  // 인증이 필요한 페이지 체크 (실제로는 사용자 스토어 사용)
  if (to.meta.requiresAuth) {
    // 여기서 실제 인증 체크 로직 구현
    // const userStore = useUserStore()
    // if (!userStore.isAuthenticated) {
    //   next('/login')
    //   return
    // }
  }

  next()
})

export default router
