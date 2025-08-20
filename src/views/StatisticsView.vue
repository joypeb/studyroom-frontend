<template>
  <!-- SVG 필터 구조 (Chromium 전용) -->
  <svg class="filter" xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 0; height: 0;">
    <defs>
      <filter id="glass-filter" color-interpolation-filters="sRGB">
        <!-- 변위 맵 이미지 -->
        <feImage x="0" y="0" width="100%" height="100%" result="map"></feImage>
        
        <!-- RED 채널 (가장 강한 변위) -->
        <feDisplacementMap in="SourceGraphic" in2="map" 
                          xChannelSelector="R" yChannelSelector="B"
                          scale="-180" result="dispRed"/>
        <feColorMatrix in="dispRed" type="matrix"
                      values="1 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 1 0" result="red"/>
        
        <!-- GREEN 채널 (기준) -->
        <feDisplacementMap in="SourceGraphic" in2="map"
                          xChannelSelector="R" yChannelSelector="B"  
                          scale="-170" result="dispGreen"/>
        <feColorMatrix in="dispGreen" type="matrix"
                      values="0 0 0 0 0, 0 1 0 0 0, 0 0 0 0 0, 0 0 0 1 0" result="green"/>
        
        <!-- BLUE 채널 (중간 변위) -->
        <feDisplacementMap in="SourceGraphic" in2="map"
                          xChannelSelector="R" yChannelSelector="B"
                          scale="-160" result="dispBlue"/>
        <feColorMatrix in="dispBlue" type="matrix"
                      values="0 0 0 0 0, 0 0 0 0 0, 0 0 1 0 0, 0 0 0 1 0" result="blue"/>
        
        <!-- 채널 합성 -->
        <feBlend in="red" in2="green" mode="screen" result="rg"/>
        <feBlend in="rg" in2="blue" mode="screen" result="output"/>
        <feGaussianBlur in="output" stdDeviation="0.7"/>
      </filter>
    </defs>
  </svg>
  
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
import { onMounted, onUnmounted } from 'vue'

// 변위 맵 동적 생성 함수
function generateDisplacementMap(width, height, radius) {
  const border = Math.min(width, height) * 0.035 // border factor: 0.07 * 0.5
  
  const svgString = `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="red-grad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" fill="url(#red-grad)"/>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" 
            fill="url(#blue-grad)" style="mix-blend-mode: difference"/>
      <rect x="${border}" y="${border}" 
            width="${width - border * 2}" height="${height - border * 2}" 
            rx="${radius}" fill="hsl(0 0% 50% / 0.93)" style="filter: blur(11px)"/>
    </svg>
  `
  
  const encoded = encodeURIComponent(svgString)
  const dataUri = `data:image/svg+xml,${encoded}`
  
  // Chromium용 SVG 필터 업데이트
  const feImage = document.querySelector('#glass-filter feImage')
  if (feImage) feImage.setAttribute('href', dataUri)
  
  return dataUri
}

// 글래스모피즘 효과 클래스
class GlassmorphismEffect {
  constructor(element) {
    this.element = element
    this.isChromium = /Chrome|Chromium|Edge/.test(navigator.userAgent)
    this.isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    this.isFirefox = /Firefox/.test(navigator.userAgent)
    
    this.init()
  }
  
  init() {
    if (this.isChromium) {
      // Chromium: SVG 필터 설정
      this.setupSVGFilter()
      this.element.dataset.renderer = 'chromium-svg'
    } else if (this.isSafari) {
      // Safari: WebKit 최적화
      this.element.dataset.renderer = 'safari-webkit'
    } else if (this.isFirefox) {
      // Firefox: 대체 효과
      this.element.dataset.renderer = 'firefox-fallback'
    }
    
    // 공통 개선 사항
    this.addInteractionEffects()
  }
  
  setupSVGFilter() {
    const rect = this.element.getBoundingClientRect()
    generateDisplacementMap(rect.width, rect.height, 
      parseFloat(getComputedStyle(this.element).borderRadius))
  }
  
  addInteractionEffects() {
    // 호버/포커스 효과
    this.element.addEventListener('mouseenter', () => {
      const backdropFilter = 
        this.isChromium ? 'url(#glass-filter) brightness(1.15) saturate(1.6)' :
        this.isSafari ? 'blur(14px) saturate(190%) brightness(1.08)' :
        'blur(16px) saturate(210%)'
      
      this.element.style.backdropFilter = backdropFilter
      this.element.style.webkitBackdropFilter = backdropFilter
    })
    
    this.element.addEventListener('mouseleave', () => {
      this.element.style.backdropFilter = ''
      this.element.style.webkitBackdropFilter = ''
    })
  }
}

let resizeObserver
let intersectionObserver

onMounted(() => {
  // 모든 글래스 요소에 효과 적용
  const glassElements = document.querySelectorAll('.stat-card, .chart-card')
  glassElements.forEach(el => {
    new GlassmorphismEffect(el)
  })
  
  // ResizeObserver로 동적 크기 대응
  resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.dataset.renderer === 'chromium-svg') {
        const { width, height } = entry.contentRect
        generateDisplacementMap(width, height, 
          parseFloat(getComputedStyle(entry.target).borderRadius))
      }
    })
  })
  
  // IntersectionObserver로 성능 최적화
  intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = 'backdrop-filter, transform'
      } else {
        entry.target.style.willChange = 'auto'
      }
    })
  }, { rootMargin: '50px' })
  
  // 적용
  glassElements.forEach(el => {
    resizeObserver.observe(el)
    intersectionObserver.observe(el)
  })
})

onUnmounted(() => {
  // 정리
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
})
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
  /* 기본 글래스 효과 (모든 브라우저) */
  background: rgba(255, 255, 255, 0.05);
  
  /* Safari/Firefox 대체 백드롭 필터 */
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  backdrop-filter: blur(10px) saturate(150%);
  
  /* 다이층 그림자 효과 */
  box-shadow: 
    /* 외부 그림자 */
    0px 4px 16px rgba(17, 17, 26, 0.05),
    0px 8px 24px rgba(17, 17, 26, 0.05),
    0px 16px 56px rgba(17, 17, 26, 0.05),
    /* 내부 그림자 (유리 가장자리) */
    inset 0 0 2px 1px rgba(255, 255, 255, 0.15),
    inset 0 0 10px 4px rgba(255, 255, 255, 0.10),
    inset 0px 4px 16px rgba(17, 17, 26, 0.05),
    inset 0px 8px 24px rgba(17, 17, 26, 0.05),
    inset 0px 16px 56px rgba(17, 17, 26, 0.05);
  
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  /* 부드러운 전환 */
  transition: opacity 0.26s ease-out, transform 0.26s ease-out;
  
  /* 성능 최적화 */
  will-change: backdrop-filter, transform;
  transform: translateZ(0);
}

.stat-card:hover {
  transform: translateY(-4px) translateZ(0);
  backdrop-filter: blur(12px) saturate(160%) brightness(1.05);
  box-shadow: 
    0px 8px 32px rgba(17, 17, 26, 0.1),
    0px 16px 48px rgba(17, 17, 26, 0.1),
    0px 32px 64px rgba(17, 17, 26, 0.1),
    inset 0 0 2px 1px rgba(255, 255, 255, 0.2),
    inset 0 0 15px 6px rgba(255, 255, 255, 0.15);
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
  /* 기본 글래스 효과 (모든 브라우저) */
  background: rgba(255, 255, 255, 0.05);
  
  /* Safari/Firefox 대체 백드롭 필터 */
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  backdrop-filter: blur(10px) saturate(150%);
  
  /* 다이층 그림자 효과 */
  box-shadow: 
    /* 외부 그림자 */
    0px 4px 16px rgba(17, 17, 26, 0.05),
    0px 8px 24px rgba(17, 17, 26, 0.05),
    0px 16px 56px rgba(17, 17, 26, 0.05),
    /* 내부 그림자 (유리 가장자리) */
    inset 0 0 2px 1px rgba(255, 255, 255, 0.15),
    inset 0 0 10px 4px rgba(255, 255, 255, 0.10),
    inset 0px 4px 16px rgba(17, 17, 26, 0.05),
    inset 0px 8px 24px rgba(17, 17, 26, 0.05),
    inset 0px 16px 56px rgba(17, 17, 26, 0.05);
  
  border-radius: 16px;
  padding: 2rem;
  
  /* 부드러운 전환 */
  transition: opacity 0.26s ease-out, transform 0.26s ease-out;
  
  /* 성능 최적화 */
  will-change: backdrop-filter, transform;
  transform: translateZ(0);
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

/* Chromium 전용 고급 효과 */
@supports (backdrop-filter: url('#glass-filter')) {
  .stat-card, .chart-card {
    /* SVG 필터 기반 변위 효과 */
    backdrop-filter: url(#glass-filter) brightness(1.1) saturate(1.5);
    -webkit-backdrop-filter: url(#glass-filter) brightness(1.1) saturate(1.5);
  }
}

/* Safari 전용 최적화 */
@supports (-webkit-backdrop-filter: blur(10px)) and (not (backdrop-filter: url('#glass-filter'))) {
  .stat-card, .chart-card {
    /* Safari에서 더 강한 블러와 채도 */
    -webkit-backdrop-filter: blur(12px) saturate(180%) brightness(1.05);
    
    /* Safari 전용 그라디언트 오버레이 */
    background: 
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.02) 100%),
      rgba(255, 255, 255, 0.03);
    
    /* Safari에서 더 부드러운 그림자 */
    box-shadow: 
      0 8px 32px rgba(31, 38, 135, 0.07),
      0 4px 16px rgba(31, 38, 135, 0.04),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(255, 255, 255, 0.05);
    
    /* Safari 3D 가속 */
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000px;
  }
}

/* Firefox 전용 대체 스타일 */
@supports (backdrop-filter: blur(10px)) and (-moz-appearance: none) {
  .stat-card, .chart-card {
    /* Firefox는 URL 필터 미지원, 기본 블러 강화 */
    backdrop-filter: blur(14px) saturate(200%) contrast(0.95);
    
    /* Firefox 전용 노이즈 텍스처 추가 */
    background-image: 
      linear-gradient(135deg,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 50%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
    background-size: 100%, 50px 50px;
  }
}

/* 다크모드 대응 */
@media (prefers-color-scheme: dark) {
  .stat-card, .chart-card {
    background: rgba(0, 0, 0, 0.05);
  }
}

/* 모션 감소 설정 대응 */
@media (prefers-reduced-motion: reduce) {
  .stat-card, .chart-card {
    transition: none;
    backdrop-filter: blur(8px) saturate(120%);
  }
}

/* 저사양 기기 대응 */
@media (max-width: 768px), (hover: none) {
  .stat-card, .chart-card {
    backdrop-filter: blur(8px) saturate(140%);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.08),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}

/* 브라우저 미지원 시 폴백 */
@supports not (backdrop-filter: blur(10px)) {
  .stat-card, .chart-card {
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
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
