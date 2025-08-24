<script setup>
import { ref, computed, onMounted } from 'vue'
import { Users, Clock, TrendingUp, AlertCircle } from 'lucide-vue-next'

// 더미 데이터
const stats = ref({
  totalStudents: 0,
  currentOccupancy: 0,
  maxCapacity: 120,
  todayRevenue: 0
})

const recentActivities = ref([
  { id: 1, type: 'checkin', user: '김학생', time: '09:30', message: '입실' },
  { id: 2, type: 'checkout', user: '이학생', time: '09:25', message: '퇴실' },
  { id: 3, type: 'payment', user: '박학생', time: '09:20', message: '월 정기권 결제' },
  { id: 4, type: 'checkin', user: '최학생', time: '09:15', message: '입실' }
])

const loadDashboardData = async () => {
  // 애니메이션 효과를 위한 지연 로딩
  setTimeout(() => {
    stats.value = {
      totalStudents: 85,
      currentOccupancy: 67,
      maxCapacity: 120,
      todayRevenue: 340000
    }
  }, 500)
}

// 점유율 계산
const occupancyRate = computed(() => {
  if (stats.value.maxCapacity === 0) return 0
  return Math.round((stats.value.currentOccupancy / stats.value.maxCapacity) * 100)
})

// 통화 포맷팅
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount)
}



// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // 실제로는 API에서 데이터를 가져옴
  await loadDashboardData()
})


</script>

<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h2>대시보드</h2>
        <p class="subtitle">독서실 현황을 한눈에 확인하세요</p>
      </div>

      <!-- 통계 카드 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total-students">
            <Users />
          </div>
          <div class="stat-content">
            <h3>전체 학생 수</h3>
            <p class="stat-number">{{ stats.totalStudents }}명</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon current-occupancy">
            <Clock />
          </div>
          <div class="stat-content">
            <h3>현재 이용 중</h3>
            <p class="stat-number">{{ stats.currentOccupancy }}명</p>
            <p class="stat-detail">점유율 {{ occupancyRate }}%</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon today-revenue">
            <TrendingUp />
          </div>
          <div class="stat-content">
            <h3>오늘 매출</h3>
            <p class="stat-number">{{ formatCurrency(stats.todayRevenue) }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon capacity">
            <AlertCircle />
          </div>
          <div class="stat-content">
            <h3>최대 수용 인원</h3>
            <p class="stat-number">{{ stats.maxCapacity }}명</p>
          </div>
        </div>
      </div>

      <!-- 최근 활동 -->
      <div class="recent-activities">
        <h3>최근 활동</h3>
        <div class="activity-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-time">{{ activity.time }}</div>
            <div class="activity-content">
              <span class="activity-user">{{ activity.user }}</span>
              <span class="activity-message">{{ activity.message }}</span>
            </div>
            <div :class="['activity-type', activity.type]"></div>
          </div>
        </div>
      </div>

      <!-- 점유율 차트 -->
      <div class="occupancy-chart">
        <h3>현재 점유율</h3>
        <div class="chart-container">
          <div class="progress-ring">
            <div class="progress-circle">
              <div class="progress-text">
                <span class="percentage">{{ occupancyRate }}%</span>
                <span class="label">점유율</span>
              </div>
            </div>
          </div>
          <div class="occupancy-details">
            <div class="detail-item">
              <span class="label">현재 이용중</span>
              <span class="value">{{ stats.currentOccupancy }}명</span>
            </div>
            <div class="detail-item">
              <span class="label">남은 자리</span>
              <span class="value">{{ stats.maxCapacity - stats.currentOccupancy }}명</span>
            </div>
            <div class="detail-item">
              <span class="label">전체 자리</span>
              <span class="value">{{ stats.maxCapacity }}명</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.dashboard {
  padding: 2rem 0;
}

.dashboard-header {
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard-header h2 {
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

/* 통계 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.total-students {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.current-occupancy {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.today-revenue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.capacity {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.stat-detail {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #666;
}

/* 최근 활동 */
.recent-activities {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  backdrop-filter: blur(10px);
}

.recent-activities h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background: #e9ecef;
}

.activity-time {
  font-size: 0.875rem;
  color: #666;
  font-weight: 600;
  min-width: 50px;
}

.activity-content {
  flex: 1;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.activity-user {
  font-weight: 600;
  color: #333;
}

.activity-message {
  color: #666;
}

.activity-type {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.activity-type.checkin {
  background: #28a745;
}

.activity-type.checkout {
  background: #dc3545;
}

.activity-type.payment {
  background: #007bff;
}

/* 점유율 차트 */
.occupancy-chart {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.occupancy-chart h3 {
  margin: 0 0 2rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.progress-ring {
  flex-shrink: 0;
}

.progress-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #667eea 0deg,
    #764ba2 calc(var(--percentage, 56) * 3.6deg),
    #f1f3f4 calc(var(--percentage, 56) * 3.6deg)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  position: absolute;
}

.progress-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.occupancy-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item .label {
  color: #666;
  font-size: 0.875rem;
}

.detail-item .value {
  font-weight: 600;
  color: #333;
}

/* 반응형 */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem 0;
  }

  .dashboard-header h2 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .chart-container {
    flex-direction: column;
    text-align: center;
  }

  .progress-circle {
    width: 120px;
    height: 120px;
  }

  .progress-circle::before {
    width: 80px;
    height: 80px;
  }
}
</style>
