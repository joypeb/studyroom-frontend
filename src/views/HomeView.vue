<template>
  <div class="monitoring-dashboard">
    <div class="container">
      <div class="page-header">
        <h2>독서실 세션 모니터링</h2>
        <p class="subtitle">실시간으로 독서실 사용 현황을 확인하고 관리하세요</p>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-if="error" class="error-state">
        <h3>오류가 발생했습니다</h3>
        <p>{{ error }}</p>
        <button @click="loadAllData" class="retry-button">다시 시도</button>
      </div>

      <!-- 대시보드 콘텐츠 -->
      <div v-if="!loading && !error" class="dashboard-content">
        <!-- 통계 카드 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>{{ realtimeSessions.length }}</h3>
              <p>활성 세션</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏢</div>
            <div class="stat-info">
              <h3>5</h3>
              <p>총 룸 개수</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <h3>{{ getAverageUsageTime() }}</h3>
              <p>평균 사용시간</p>
            </div>
          </div>
        </div>

        <!-- 세션 목록 -->
        <div class="sessions-container">
          <div class="section-header">
            <h3>실시간 세션</h3>
            <button @click="loadAllData" :disabled="loading" class="refresh-button">
              🔄 새로고침
            </button>
          </div>

          <div v-if="realtimeSessions && realtimeSessions.length > 0" class="sessions-grid">
            <div v-for="session in realtimeSessions" :key="session.sessionId" class="session-card">
              <div class="session-header">
                <div class="user-avatar">
                  👤
                </div>
                <div class="user-info">
                  <h4>{{ session.userName }}</h4>
                  <span class="session-id">{{ session.sessionId }}</span>
                </div>
                <div class="session-status">
                  <span :class="['status-badge', session.status]">
                    {{ getStatusText(session.status) }}
                  </span>
                </div>
              </div>

              <div class="session-details">
                <div class="detail-row">
                  <span class="label">룸</span>
                  <span class="value room-name">{{ session.roomName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">시작 시간</span>
                  <span class="value">{{ formatTime(session.startTime) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">사용 시간</span>
                  <span class="value duration">{{ formatDuration(session.duration) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 빈 상태 -->
          <div v-else class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>활성 세션이 없습니다</h3>
            <p>현재 사용 중인 독서실이 없습니다</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { monitoringApi } from '../services/monitoring.js'

export default {
  name: 'MonitoringDashboard',

  data() {
    return {
      // 데이터 상태
      realtimeSessions: [], // API 응답 데이터 설정
      dashboardStats: null, // 상태 관리
      recentActivities: [],

      // UI 상태
      loading: false,  // 로딩 상태
      error: null      // 에러 상태
    }
  },

  async created() {  // vue 라이프사이클 활용 : 컴포넌트 생성시 자동으로 데이터 로드
    await this.loadAllData()
  },

  methods: {
    // 모든 데이터 로드
    async loadAllData() {
      this.loading = true
      this.error = null

      try {
        // API 호출
        const response = await monitoringApi.getSessionsSnapshot()
        console.log('API 응답:', response)
        
        // 데이터 저장 - API 응답 구조에 맞게 수정
        this.realtimeSessions = response.sessions || []

      } catch (error) {
        this.error = `데이터를 불러오는데 실패했습니다: ${error.message}`
        console.error('Data loading failed:', error)
      } finally {
        this.loading = false
      }
    },

    // 상태 텍스트 변환
    getStatusText(status) {
      const statusMap = {
        'active': '활성',
        'inactive': '비활성',
        'paused': '일시정지'
      }
      return statusMap[status] || status
    },

    // 시간 포맷팅
    formatTime(timeString) {
      const date = new Date(timeString)
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },

    // 사용 시간 포맷팅
    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      if (hours > 0) {
        return `${hours}시간 ${mins}분`
      }
      return `${mins}분`
    },

    // 평균 사용시간 계산
    getAverageUsageTime() {
      if (!this.realtimeSessions.length) return '0분'
      const total = this.realtimeSessions.reduce((sum, session) => sum + session.duration, 0)
      const average = Math.round(total / this.realtimeSessions.length)
      return this.formatDuration(average)
    }
  }
}
</script>

<style scoped>
.monitoring-dashboard {
  padding: 2rem 0;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
}

/* 로딩 상태 */
.loading-state {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1.125rem;
  margin: 0;
}

/* 에러 상태 */
.error-state {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.error-state h3 {
  color: #d32f2f;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.error-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.retry-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
}

/* 대시보드 콘텐츠 */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 통계 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 세션 컨테이너 */
.sessions-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 세션 그리드 */
.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.session-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.session-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.session-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.user-info {
  flex: 1;
}

.user-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
}

.session-id {
  font-size: 0.75rem;
  color: #666;
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.session-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.paused {
  background: #fff3cd;
  color: #856404;
}

/* 세션 상세 정보 */
.session-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.detail-row .value {
  font-size: 0.875rem;
  color: #333;
  font-weight: 600;
}

.room-name {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.duration {
  color: #28a745;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* 반응형 */
@media (max-width: 768px) {
  .monitoring-dashboard {
    padding: 1rem 0;
  }

  .page-header h2 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .sessions-container {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .sessions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .session-card {
    padding: 1rem;
  }
}
</style>
