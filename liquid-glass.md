다음 고급 글래스모피즘(Glassmorphism) 디자인 시스템을 내 코드에 크로스브라우저 호환성을 고려하여 적용해주세요:

### 1. SVG 필터 구조 (Chromium 전용)
HTML에 다음 SVG 필터를 추가하세요:
```xml
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
```
2. 변위 맵 동적 생성 함수
```javascript
function generateDisplacementMap(width, height, radius) {
  const border = Math.min(width, height) * 0.035; // border factor: 0.07 * 0.5
  
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
  `;
  
  const encoded = encodeURIComponent(svgString);
  const dataUri = `data:image/svg+xml,${encoded}`;
  
  // Chromium용 SVG 필터 업데이트
  const feImage = document.querySelector('#glass-filter feImage');
  if (feImage) feImage.setAttribute('href', dataUri);
  
  return dataUri;
}
```
3. 크로스브라우저 CSS 스타일
```css
/* 기본 글래스 효과 (모든 브라우저) */
.glass-element {
  /* 기본 배경 */
  background: rgba(255, 255, 255, 0.05);
  
  /* Safari/Firefox 대체 백드롭 필터 */
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  backdrop-filter: blur(10px) saturate(150%);
  
  /* 다크모드 대응 */
  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.05);
  }
  
  /* 다층 그림자 효과 */
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
  
  /* 부드러운 전환 */
  transition: opacity 0.26s ease-out, transform 0.26s ease-out;
  
  /* 성능 최적화 */
  will-change: backdrop-filter, transform;
  transform: translateZ(0);
}

/* Chromium 전용 고급 효과 */
@supports (backdrop-filter: url('#glass-filter')) {
  .glass-element {
    /* SVG 필터 기반 변위 효과 */
    backdrop-filter: url(#glass-filter) brightness(1.1) saturate(1.5);
    -webkit-backdrop-filter: url(#glass-filter) brightness(1.1) saturate(1.5);
  }
}

/* Safari 전용 최적화 */
@supports (-webkit-backdrop-filter: blur(10px)) and (not (backdrop-filter: url('#glass-filter'))) {
  .glass-element {
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
  .glass-element {
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
```
4. 브라우저 감지 및 적응형 적용
```javascript
class GlassmorphismEffect {
  constructor(element) {
    this.element = element;
    this.isChromium = /Chrome|Chromium|Edge/.test(navigator.userAgent);
    this.isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    
    this.init();
  }
  
  init() {
    // 기본 클래스 적용
    this.element.classList.add('glass-element');
    
    if (this.isChromium) {
      // Chromium: SVG 필터 설정
      this.setupSVGFilter();
      this.element.dataset.renderer = 'chromium-svg';
    } else if (this.isSafari) {
      // Safari: WebKit 최적화
      this.setupSafariEffects();
      this.element.dataset.renderer = 'safari-webkit';
    } else if (this.isFirefox) {
      // Firefox: 대체 효과
      this.setupFirefoxFallback();
      this.element.dataset.renderer = 'firefox-fallback';
    }
    
    // 공통 개선 사항
    this.addInteractionEffects();
  }
  
  setupSVGFilter() {
    const rect = this.element.getBoundingClientRect();
    generateDisplacementMap(rect.width, rect.height, 
      parseFloat(getComputedStyle(this.element).borderRadius));
  }
  
  setupSafariEffects() {
    // Safari 전용 pseudo-element 추가
    const style = document.createElement('style');
    style.textContent = `
      .glass-element[data-renderer="safari-webkit"]::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom right,
          rgba(255, 255, 255, 0.15),
          transparent 50%
        );
        border-radius: inherit;
        pointer-events: none;
        z-index: 1;
      }
      
      .glass-element[data-renderer="safari-webkit"]::after {
        content: '';
        position: absolute;
        inset: -1px;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.4),
          transparent 40%,
          transparent 60%,
          rgba(255, 255, 255, 0.1)
        );
        border-radius: inherit;
        opacity: 0.5;
        pointer-events: none;
        z-index: -1;
        mask: linear-gradient(black, black) content-box,
              linear-gradient(black, black);
        -webkit-mask: linear-gradient(black, black) content-box,
                     linear-gradient(black, black);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: 1px;
      }
    `;
    document.head.appendChild(style);
  }
  
  setupFirefoxFallback() {
    // Firefox 전용 그라디언트 메시
    this.element.style.backgroundImage = `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 35px,
        rgba(255, 255, 255, 0.01) 35px,
        rgba(255, 255, 255, 0.01) 70px
      )
    `;
  }
  
  addInteractionEffects() {
    // 호버/포커스 효과
    this.element.addEventListener('mouseenter', () => {
      this.element.style.backdropFilter = 
        this.isChromium ? 'url(#glass-filter) brightness(1.15) saturate(1.6)' :
        this.isSafari ? 'blur(14px) saturate(190%) brightness(1.08)' :
        'blur(16px) saturate(210%)';
    });
    
    this.element.addEventListener('mouseleave', () => {
      this.element.style.backdropFilter = '';
    });
  }
}

// 사용 예시
document.querySelectorAll('.my-glass-element').forEach(el => {
  new GlassmorphismEffect(el);
});
```
5. 반응형 및 성능 최적화

```javascript
// ResizeObserver로 동적 크기 대응
const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(entry => {
    if (entry.target.dataset.renderer === 'chromium-svg') {
      const { width, height } = entry.contentRect;
      generateDisplacementMap(width, height, 
        parseFloat(getComputedStyle(entry.target).borderRadius));
    }
  });
});

// IntersectionObserver로 성능 최적화
const intersectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.willChange = 'backdrop-filter, transform';
    } else {
      entry.target.style.willChange = 'auto';
    }
  });
}, { rootMargin: '50px' });

// 적용
document.querySelectorAll('.glass-element').forEach(el => {
  resizeObserver.observe(el);
  intersectionObserver.observe(el);
});
```
6. 접근성 및 폴백

```css
/* 모션 감소 설정 대응 */
@media (prefers-reduced-motion: reduce) {
  .glass-element {
    transition: none;
    backdrop-filter: blur(8px) saturate(120%);
  }
}

/* 저사양 기기 대응 */
@media (max-width: 768px), (hover: none) {
  .glass-element {
    backdrop-filter: blur(8px) saturate(140%);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.08),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}

/* 브라우저 미지원 시 폴백 */
@supports not (backdrop-filter: blur(10px)) {
  .glass-element {
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
}
```
- 적용 시 주의사항
  - SVG 필터는 Chromium 기반 브라우저에서만 완전 지원
  - Safari는 -webkit-backdrop-filter로 대체 효과 구현
  - Firefox는 기본 backdrop-filter와 추가 스타일링으로 보완
  - 성능을 위해 GPU 가속 활용 (transform: translateZ(0))
  - 동적 요소는 ResizeObserver로 크기 변화 감지
  - 모바일 기기에서는 간소화된 효과 적용