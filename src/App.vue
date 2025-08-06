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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.main-content {
  padding-top: 64px; /* MainBar 높이만큼 패딩 */
  min-height: 100vh;
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
