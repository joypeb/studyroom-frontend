<script setup>
import MainBar from './components/MainBar.vue'
</script>

<template>
  <div id="app">
    <MainBar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 전역 스타일 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: url('./assets/background.jpeg') center center no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.main-content {
  padding-top: 64px; /* MainBar 높이만큼 패딩 */
  min-height: 100vh;
}

/* 배경 이미지 반응형 조정 */
@media (max-width: 768px) {
  body {
    /* 모바일에서는 fixed attachment 사용 안함 (성능 이슈) */
    background-attachment: scroll;
    background-position: center center;
  }
}

@media (max-width: 480px) {
  body {
    /* 작은 화면에서 배경 이미지 최적화 */
    background-position: center 40%; /* 더 위쪽에 포커스 */
  }
}

/* 반응형 패딩 조정 */
@media (max-width: 640px) {
  .main-content {
    padding-top: 56px; /* 모바일에서 MainBar 높이 */
  }
}

/* 컨테이너 공통 스타일 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}
</style>
