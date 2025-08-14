<template>
  <div class="monitoring-dashboard">
    <h2>독서실 세션 모니터링</h2>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading">
      데이터를 불러오는 중...
    </div>

    <!-- 에러 상태 -->
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <!-- 실시간 세션 데이터 -->
    <div v-if="!loading && !error" class="dashboard-content">
      <div class="sessions-section">
        <h3>실시간 세션</h3>
        <div v-if="realtimeSessions && realtimeSessions.length > 0">
          <div v-for="session in realtimeSessions" :key="session.id" class="session-item">
            <p>세션 ID: {{ session.id }}</p>
            <p>사용자: {{ session.userName }}</p>
            <p>상태: {{ session.status }}</p>
          </div>
        </div>
        <div v-else>
          활성 세션이 없습니다.
        </div>
      </div>
    </div>

    <!-- 새로고침 버튼 -->
    <button @click="loadAllData" :disabled="loading" class="refresh-btn">
      {{ loading ? '勞딩 중...' : '새로고침' }}
    </button>
  </div>
</template>

<script>

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

    // 모든 데이터 로드
    async loadAllData() {
      this.loading = true
      this.error = null

      try {
        // 병렬로 여러 API 호출
        const [sessions/*, activities*/] = await Promise.all([
          this.getRealtimeSessions(),
          //this.getRecentActivities()
        ])

        // 데이터 저장
        this.realtimeSessions = sessions
        //this.recentActivities = activities

      } catch (error) {
        this.error = `데이터를 불러오는데 실패했습니다: ${error.message}`
        console.error('Data loading failed:', error)
      } finally {
        this.loading = false
      }
    }
}
</script>

<style scoped>
.monitoring-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stats-section, .sessions-section, .activities-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.session-item, .activity-item {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.refresh-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.refresh-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

h2, h3 {
  color: #333;
  margin-bottom: 15px;
}
</style>
