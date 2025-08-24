<template>
  <div class="statistics-view">
    <div class="container">
      <div class="page-header">
        <h2>통계</h2>
        <p class="subtitle">독서실 이용 현황과 수익을 분석하세요</p>
      </div>

      <!-- 기본 통계 카드들 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon revenue">
            <TrendingUp />
          </div>
          <div class="stat-content">
            <h3>총 매출</h3>
            <p class="stat-number">₩33,400,000</p>
            <span class="growth positive">+12.5%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon users">
            <Users />
          </div>
          <div class="stat-content">
            <h3>일평균 이용객</h3>
            <p class="stat-number">53명</p>
            <span class="period">지난 7일</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon peak">
            <Calendar />
          </div>
          <div class="stat-content">
            <h3>피크 시간</h3>
            <p class="stat-number">14:00-15:00</p>
            <span class="period">최대 이용 시간</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon chart">
            <BarChart3 />
          </div>
          <div class="stat-content">
            <h3>성장률</h3>
            <p class="stat-number">+12.5%</p>
            <span class="period">전월 대비</span>
          </div>
        </div>
      </div>

      <!-- 간단한 차트 표현 -->
      <div class="chart-section">
        <div class="chart-card">
          <h3>주간 방문자 수</h3>
          <div class="simple-chart">
            <div class="chart-bars">
              <div class="bar" data-height="60">
                <span class="value">45</span>
                <span class="label">월</span>
              </div>
              <div class="bar" data-height="70">
                <span class="value">52</span>
                <span class="label">화</span>
              </div>
              <div class="bar" data-height="50">
                <span class="value">38</span>
                <span class="label">수</span>
              </div>
              <div class="bar" data-height="85">
                <span class="value">61</span>
                <span class="label">목</span>
              </div>
              <div class="bar" data-height="75">
                <span class="value">55</span>
                <span class="label">금</span>
              </div>
              <div class="bar" data-height="90">
                <span class="value">67</span>
                <span class="label">토</span>
              </div>
              <div class="bar" data-height="65">
                <span class="value">49</span>
                <span class="label">일</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>멤버십 타입 분포</h3>
          <div class="membership-stats">
            <div class="membership-item">
              <div class="membership-info">
                <span class="type">일일권</span>
                <span class="count">45명 (35%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: 35%"></div>
              </div>
            </div>
            <div class="membership-item">
              <div class="membership-info">
                <span class="type">월정기권</span>
                <span class="count">65명 (50%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: 50%"></div>
              </div>
            </div>
            <div class="membership-item">
              <div class="membership-info">
                <span class="type">연간권</span>
                <span class="count">20명 (15%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: 15%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, Users, Calendar, BarChart3 } from 'lucide-vue-next'
</script>

<style scoped>
.statistics-view {
  padding: 2rem 0;
}

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

.stat-icon.revenue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.peak {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.chart {
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
  margin: 0 0 0.25rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
}

.growth {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.growth.positive {
  background: #d4edda;
  color: #155724;
}

.period {
  font-size: 0.875rem;
  color: #666;
}

/* 차트 섹션 */
.chart-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.chart-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

/* 간단한 바 차트 */
.simple-chart {
  height: 200px;
  display: flex;
  align-items: end;
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 1rem;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  justify-content: end;
}

.bar::before {
  content: '';
  width: 100%;
  max-width: 40px;
  height: calc(var(--height) * 1%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.bar[data-height="60"]::before { height: 60%; }
.bar[data-height="70"]::before { height: 70%; }
.bar[data-height="50"]::before { height: 50%; }
.bar[data-height="85"]::before { height: 85%; }
.bar[data-height="75"]::before { height: 75%; }
.bar[data-height="90"]::before { height: 90%; }
.bar[data-height="65"]::before { height: 65%; }

.bar .value {
  position: absolute;
  bottom: calc(var(--height) * 1% + 2.5rem);
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.bar[data-height="60"] .value { bottom: calc(60% + 2.5rem); }
.bar[data-height="70"] .value { bottom: calc(70% + 2.5rem); }
.bar[data-height="50"] .value { bottom: calc(50% + 2.5rem); }
.bar[data-height="85"] .value { bottom: calc(85% + 2.5rem); }
.bar[data-height="75"] .value { bottom: calc(75% + 2.5rem); }
.bar[data-height="90"] .value { bottom: calc(90% + 2.5rem); }
.bar[data-height="65"] .value { bottom: calc(65% + 2.5rem); }

.bar .label {
  position: absolute;
  bottom: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

/* 멤버십 통계 */
.membership-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.membership-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.membership-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.membership-info .type {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.membership-info .count {
  font-size: 0.875rem;
  color: #666;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.5s ease;
  border-radius: 4px;
}

/* 반응형 */
@media (max-width: 768px) {
  .statistics-view {
    padding: 1rem 0;
  }

  .page-header h2 {
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

  .chart-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .chart-card {
    padding: 1.5rem;
  }

  .simple-chart {
    height: 150px;
  }
}
</style>
