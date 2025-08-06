<template>
  <div class="about-view">
    <div class="container">
      <div class="page-header">
        <h2>소개</h2>
        <p class="subtitle">독서실 관리 시스템에 대해 알아보세요</p>
      </div>

      <div class="content-grid">
        <div class="info-card">
          <h3>시스템 정보</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="label">버전</span>
              <span class="value">v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="label">개발</span>
              <span class="value">Vue 3 + Vite</span>
            </div>
            <div class="info-item">
              <span class="label">UI 프레임워크</span>
              <span class="value">Custom CSS</span>
            </div>
            <div class="info-item">
              <span class="label">아이콘</span>
              <span class="value">Lucide Vue Next</span>
            </div>
          </div>
        </div>

        <div class="feature-card">
          <h3>주요 기능</h3>
          <ul class="feature-list">
            <li>실시간 독서실 현황 모니터링</li>
            <li>학생 정보 및 멤버십 관리</li>
            <li>이용 통계 및 수익 분석</li>
            <li>반응형 웹 디자인</li>
            <li>직관적인 사용자 인터페이스</li>
          </ul>
        </div>

        <div class="contact-card">
          <h3>문의 사항</h3>
          <p>시스템 관련 문의나 지원이 필요하시면 언제든 연락주세요.</p>
          <div class="contact-info">
            <div class="contact-item">
              <strong>이메일:</strong> support@studyroom.com
            </div>
            <div class="contact-item">
              <strong>전화:</strong> 02-1234-5678
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 필요한 로직이 있다면 여기에 추가
</script>

<style scoped>
.about-view {
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

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card,
.feature-card,
.contact-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.info-card h3,
.feature-card h3,
.contact-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #333;
  border-bottom: 1px solid #e9ecef;
}

.feature-list li:last-child {
  border-bottom: none;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.contact-card p {
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.6;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  color: #333;
  line-height: 1.5;
}

.contact-item strong {
  color: #667eea;
  margin-right: 0.5rem;
}

/* 반응형 */
@media (max-width: 768px) {
  .about-view {
    padding: 1rem 0;
  }

  .page-header h2 {
    font-size: 2rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .info-card,
  .feature-card,
  .contact-card {
    padding: 1.5rem;
  }
}
</style>
