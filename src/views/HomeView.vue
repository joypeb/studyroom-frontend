<template>
  <div class="monitoring-dashboard">
    <div class="container">
      <!-- 대시보드 헤더 -->
      <div class="dashboard-header glass-card">
        <h1 class="dashboard-title">🏫 독서실 세션 모니터링</h1>
        <p class="dashboard-subtitle">실시간으로 독서실 이용 현황을 모니터링하세요</p>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="glass-card loading-card">
          <div class="loading-spinner"></div>
          <p class="loading-text">데이터를 불러오는 중...</p>
        </div>
      </div>

      <!-- 에러 상태 -->
      <div v-if="error" class="error-container">
        <div class="glass-card error-card">
          <div class="error-icon">⚠️</div>
          <p class="error-text">{{ error }}</p>
          <button @click="loadAllData" class="glass-button retry-button">
            다시 시도
          </button>
        </div>
      </div>

      <!-- 대시보드 콘텐츠 -->
      <div v-if="!loading && !error" class="dashboard-content">
        <!-- 통계 카드 그리드 -->
        <div class="stats-grid">
          <div class="glass-card stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ realtimeSessions?.length || 0 }}</h3>
              <p class="stat-label">활성 세션</p>
            </div>
          </div>
          
          <div class="glass-card stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ getOnlineUsers() }}</h3>
              <p class="stat-label">온라인 사용자</p>
            </div>
          </div>
          
          <div class="glass-card stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ getAverageSessionTime() }}</h3>
              <p class="stat-label">평균 세션 시간</p>
            </div>
          </div>
        </div>

        <!-- 실시간 세션 리스트 -->
        <div class="sessions-container">
          <div class="glass-card sessions-header">
            <h2 class="section-title">실시간 세션</h2>
            <button @click="loadAllData" :disabled="loading" class="glass-button refresh-button">
              <span class="refresh-icon">🔄</span>
              {{ loading ? '로딩 중...' : '새로고침' }}
            </button>
          </div>

          <div class="sessions-list">
            <div v-if="realtimeSessions && realtimeSessions.length > 0" class="sessions-grid">
              <div 
                v-for="session in realtimeSessions" 
                :key="session.id" 
                class="glass-card session-card"
              >
                <div class="session-header">
                  <div class="session-avatar">
                    {{ getInitials(session.userName) }}
                  </div>
                  <div class="session-info">
                    <h4 class="session-user">{{ session.userName || '익명 사용자' }}</h4>
                    <p class="session-id">세션 #{{ session.id }}</p>
                  </div>
                  <div class="session-status" :class="getStatusClass(session.status)">
                    {{ getStatusText(session.status) }}
                  </div>
                </div>
                
                <div class="session-details">
                  <div class="session-detail-item">
                    <span class="detail-label">시작 시간</span>
                    <span class="detail-value">{{ formatTime(session.startTime) }}</span>
                  </div>
                  <div class="session-detail-item">
                    <span class="detail-label">이용 시간</span>
                    <span class="detail-value">{{ calculateDuration(session.startTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <div class="glass-card empty-card">
                <div class="empty-icon">📭</div>
                <h3 class="empty-title">활성 세션이 없습니다</h3>
                <p class="empty-description">현재 독서실을 이용 중인 사용자가 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { monitoringApi } from '@/services/monitoring.js'

// 반응형 상태
const realtimeSessions = ref([])
const dashboardStats = ref(null)
const recentActivities = ref([])
const loading = ref(false)
const error = ref(null)

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadAllData()
})

// 모든 데이터 로드
const loadAllData = async () => {
  loading.value = true
  error.value = null

  try {
    // 실제 API 호출이 있다면 주석 해제
    // const sessions = await monitoringApi.getSessionsSnapshot()
    // realtimeSessions.value = sessions
    
    // 현재는 목업 데이터로 테스트
    realtimeSessions.value = generateMockData()
  } catch (err) {
    error.value = `데이터를 불러오는데 실패했습니다: ${err.message}`
    console.error('Data loading failed:', err)
  } finally {
    loading.value = false
  }
}

// 목업 데이터 생성
const generateMockData = () => {
  return [
    {
      id: '001',
      userName: '김학생',
      status: 'active',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '002', 
      userName: '이공부',
      status: 'break',
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: '003',
      userName: '박독서',
      status: 'active',
      startTime: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ]
}

// 유틸리티 함수들
const getOnlineUsers = () => {
  return realtimeSessions.value.filter(session => session.status === 'active').length
}

const getAverageSessionTime = () => {
  if (!realtimeSessions.value.length) return '0분'
  
  const totalMinutes = realtimeSessions.value.reduce((sum, session) => {
    const duration = (new Date() - new Date(session.startTime)) / (1000 * 60)
    return sum + duration
  }, 0)
  
  const avgMinutes = Math.round(totalMinutes / realtimeSessions.value.length)
  return `${avgMinutes}분`
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

const getStatusClass = (status) => {
  return {
    'status-active': status === 'active',
    'status-break': status === 'break',
    'status-inactive': status === 'inactive'
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'active': '이용 중',
    'break': '휴식 중',
    'inactive': '비활성'
  }
  return statusMap[status] || '알 수 없음'
}

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const calculateDuration = (startTime) => {
  if (!startTime) return '0분'
  
  const minutes = Math.floor((new Date() - new Date(startTime)) / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours > 0) {
    return `${hours}시간 ${remainingMinutes}분`
  }
  return `${remainingMinutes}분`
}
</script>

<style scoped>
/* CSS 변수 사용 - 글래스모피즘 색상 팔레트 */
:root {
  --primary-blue: #0A84FF;
  --primary-green: #30D158;
  --glass-white: rgba(255, 255, 255, 0.7);
  --glass-white-light: rgba(255, 255, 255, 0.9);
  --glass-dark: rgba(0, 0, 0, 0.3);
  --text-primary: #1C1C1E;
  --text-secondary: #636366;
  --text-tertiary: #C7C7CC;
  --border-glass: rgba(255, 255, 255, 0.18);
}

.monitoring-dashboard {
  min-height: 100vh;
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 글래스 카드 기본 스타일 */
.glass-card {
  background: var(--glass-white);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

/* 대시보드 헤더 */
.dashboard-header {
  text-align: center;
  padding: 32px;
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-card {
  text-align: center;
  padding: 48px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(10, 132, 255, 0.1);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 에러 상태 */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-card {
  text-align: center;
  padding: 48px;
  max-width: 500px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.error-text {
  font-size: 1.1rem;
  color: #dc3545;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

/* 글래스 버튼 */
.glass-button {
  background: var(--glass-white);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: scale(1.02);
}

.glass-button:active {
  transform: scale(0.98);
}

.glass-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 통계 카드 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 132, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 세션 컨테이너 */
.sessions-container {
  margin-bottom: 32px;
}

.sessions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.refresh-button {
  font-size: 0.95rem;
}

.refresh-icon {
  font-size: 1.1rem;
}

/* 세션 그리드 */
.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.session-card {
  padding: 20px;
}

.session-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.session-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.session-info {
  flex: 1;
}

.session-user {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.session-id {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.session-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
}

.status-active {
  background: rgba(48, 209, 88, 0.2);
  color: #1d7a3a;
}

.status-break {
  background: rgba(255, 149, 0, 0.2);
  color: #cc7a00;
}

.status-inactive {
  background: rgba(128, 128, 128, 0.2);
  color: #666666;
}

.session-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* 빈 상태 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-card {
  text-align: center;
  padding: 48px;
  max-width: 400px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .sessions-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .sessions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .session-header {
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .monitoring-dashboard {
    padding: 16px 0;
  }
  
  .dashboard-header {
    padding: 24px 16px;
  }
  
  .dashboard-title {
    font-size: 1.75rem;
  }
  
  .session-card {
    padding: 16px;
  }
}
</style>