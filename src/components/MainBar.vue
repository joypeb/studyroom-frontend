<template>
  <header class="main-bar">
    <div class="container">
      <nav class="main-bar__nav">
        <!-- 로고 -->
        <div class="main-bar__logo" @click="goHome">
          <span class="logo-text">🏫 독서실 관리</span>
        </div>

        <!-- 네비게이션 메뉴 -->
        <div class="main-bar__menu">
          <ul class="nav-list">
            <li class="nav-item" v-for="item in navigationItems" :key="item.path">
              <router-link 
                :to="item.path" 
                class="nav-link"
                :class="{ 'nav-link--active': isActiveRoute(item.path) }"
              >
                <span>{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 사용자 정보 -->
        <div class="main-bar__actions">
          <div class="user-profile">
            <div class="user-avatar">
              {{ getInitials(currentUser?.name) }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ currentUser?.name || 'Guest' }}</span>
              <span class="user-role">{{ getUserRoleText(currentUser?.role) }}</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 사용자 정보
const currentUser = computed(() => userStore.currentUser)

// 네비게이션 아이템들
const navigationItems = computed(() => {
  const baseItems = [
    { path: '/', label: '대시보드' },
    { path: '/students', label: '학생 관리' },
    { path: '/statistics', label: '통계' }
  ]
  
  if (userStore.hasAdminAccess) {
    baseItems.push({ path: '/settings', label: '설정' })
  }
  
  return baseItems
})

// 메서드들
const goHome = () => {
  router.push('/')
}

const isActiveRoute = (path) => {
  return route.path === path
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const getUserRoleText = (role) => {
  const roleMap = {
    'STUDENT': '학생',
    'PARENT': '학부모',
    'ADMIN': '관리자',
    'SUPER_ADMIN': '슈퍼관리자'
  }
  return roleMap[role] || '사용자'
}
</script>

<style scoped>
.main-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  height: 64px;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1280px;
}

.main-bar__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.main-bar__logo {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.main-bar__logo:hover {
  transform: scale(1.02);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1E;
}

.main-bar__menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #636366;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #1C1C1E;
  background: rgba(255, 255, 255, 0.5);
}

.nav-link--active {
  color: #0A84FF;
  background: rgba(10, 132, 255, 0.1);
}

.main-bar__actions {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 12px 4px 4px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0A84FF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1C1C1E;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #636366;
  line-height: 1.2;
}

@media (max-width: 640px) {
  .main-bar {
    height: 56px;
  }
  
  .main-bar__nav {
    height: 56px;
  }
  
  .logo-text {
    font-size: 16px;
  }
  
  .user-info {
    display: none;
  }
}
</style>
