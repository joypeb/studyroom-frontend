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
            <a v-if="!currentUser" @click="kakaoLogin()">
              <img :src="kakaoLoginBtn" width="180" alt="카카오 로그인"/>
            </a>

            <div v-else class="logged-in-profile">
              <div class="user-info">
                <p class="user-name">{{ currentUser.name }}님</p>
                <p class="user-email">{{ currentUser.email }}</p>
              </div>
              <button class="logout-btn" @click="kakaoLogout()">로그아웃</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import kakaoLoginBtn from '@/assets/images/kakao_login.png'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 사용자 정보
const currentUser = ref(null);

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
/**
 * @description 카카오 로그인 페이지로 리다이렉트합니다.
 */
const kakaoLogin = () => {
  window.Kakao.Auth.authorize({
    redirectUri: 'http://localhost:5173', // ⚠️ 중요: 클라이언트의 URL로 설정
  });
};

/**
 * @description 서버에서 사용자 프로필을 가져와 상태를 업데이트합니다.
 */
const fetchUserProfile = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    currentUser.value = null;
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/auth/kakao/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      currentUser.value = await response.json();
    } else {
      kakaoLogout();
    }
  } catch (error) {
    console.error('프로필 정보 가져오기 오류:', error);
    kakaoLogout();
  }
};

/**
 * @description URL의 'code'를 처리하여 서버에 로그인 요청을 보냅니다.
 */
const handleKakaoCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      const response = await fetch('http://localhost:8080/auth/kakao/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) {
        throw new Error('서버 로그인 실패');
      }

      const { token, user } = await response.json();

      localStorage.setItem('accessToken', token);
      currentUser.value = user;

      // URL에서 code 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (error) {
      console.error('카카오 로그인 처리 오류:', error);
      alert('로그인에 실패했습니다. 다시 시도해 주세요.');
    }
  }
};

/**
 * @description 클라이언트에서 로그아웃을 처리합니다.
 */
const kakaoLogout = () => {
  localStorage.removeItem('accessToken');
  currentUser.value = null;
  // 카카오 SDK 로그아웃 (선택 사항)
  window.Kakao.Auth.logout();
};

// 컴포넌트 마운트 시 로그인 상태 확인 및 콜백 처리
onMounted(() => {
  handleKakaoCallback(); // URL에 code가 있으면 처리

  if (!currentUser.value) {
    fetchUserProfile(); // code가 없으면 기존 토큰으로 로그인 상태 복원
  }
});
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

/* 로그인 전에는 테두리 없음 */
.user-profile {
  display: flex; /* 내부 요소를 정렬하기 위해 추가 */
  align-items: center;
}

/* 로그인 후에만 테두리 적용 */
.logged-in-profile {
  display: flex;
  align-items: center;
  gap: 15px;

  /* 로그인 후 프로필 영역 스타일 */
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 6px 15px;
  background-color: #fcfcfc;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
  line-height: 1.2;
}

.user-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.user-email {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.logout-btn {
  background-color: #ffeb00;
  color: #381e1f;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #f7e000;
}
</style>
