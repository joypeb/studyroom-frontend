<template>
  <div class="settings-view">
    <div class="container">
      <div class="page-header">
        <h2>설정</h2>
        <p class="subtitle">시스템 설정을 관리하세요</p>
      </div>

      <div class="settings-grid">
        <!-- 일반 설정 -->
        <div class="settings-card">
          <h3>일반 설정</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>독서실 이름</label>
              <p>독서실의 표시 이름을 설정합니다</p>
            </div>
            <input
              v-model="settings.studyroomName"
              type="text"
              placeholder="독서실 이름"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>최대 수용 인원</label>
              <p>독서실의 최대 수용 가능 인원수</p>
            </div>
            <input
              v-model.number="settings.maxCapacity"
              type="number"
              min="1"
              placeholder="120"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>운영 시간</label>
              <p>독서실 운영 시간을 설정합니다</p>
            </div>
            <div class="time-inputs">
              <input
                v-model="settings.openTime"
                type="time"
              />
              <span>~</span>
              <input
                v-model="settings.closeTime"
                type="time"
              />
            </div>
          </div>
        </div>

        <!-- 알림 설정 -->
        <div class="settings-card">
          <h3>알림 설정</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>이메일 알림</label>
              <p>중요한 알림을 이메일로 받습니다</p>
            </div>
            <label class="toggle-switch">
              <input
                v-model="settings.emailNotifications"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>SMS 알림</label>
              <p>긴급한 상황을 SMS로 알립니다</p>
            </div>
            <label class="toggle-switch">
              <input
                v-model="settings.smsNotifications"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>만석 알림</label>
              <p>좌석이 모두 찬 경우 알림을 받습니다</p>
            </div>
            <label class="toggle-switch">
              <input
                v-model="settings.fullCapacityAlert"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- 요금 설정 -->
        <div class="settings-card">
          <h3>요금 설정</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>일일 이용료</label>
              <p>1일 이용권 가격</p>
            </div>
            <div class="price-input">
              <input
                v-model.number="settings.dailyPrice"
                type="number"
                min="0"
                placeholder="8000"
              />
              <span>원</span>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>월 정기권</label>
              <p>월 정기권 가격</p>
            </div>
            <div class="price-input">
              <input
                v-model.number="settings.monthlyPrice"
                type="number"
                min="0"
                placeholder="180000"
              />
              <span>원</span>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>연간권</label>
              <p>연간 정기권 가격</p>
            </div>
            <div class="price-input">
              <input
                v-model.number="settings.yearlyPrice"
                type="number"
                min="0"
                placeholder="1800000"
              />
              <span>원</span>
            </div>
          </div>
        </div>

        <!-- 시스템 설정 -->
        <div class="settings-card">
          <h3>시스템 설정</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>자동 백업</label>
              <p>데이터를 자동으로 백업합니다</p>
            </div>
            <label class="toggle-switch">
              <input
                v-model="settings.autoBackup"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>백업 주기</label>
              <p>자동 백업 실행 주기</p>
            </div>
            <select v-model="settings.backupFrequency">
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>데이터 보존 기간</label>
              <p>삭제된 데이터 보존 기간</p>
            </div>
            <select v-model="settings.dataRetention">
              <option value="30">30일</option>
              <option value="90">90일</option>
              <option value="365">1년</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="save-section">
        <button
          @click="saveSettings"
          class="save-button"
          :disabled="isLoading"
        >
          <Save class="icon" />
          <span v-if="!isLoading">설정 저장</span>
          <span v-else>저장 중...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Save } from 'lucide-vue-next'

const isLoading = ref(false)

const settings = reactive({
  // 일반 설정
  studyroomName: '스마트 독서실',
  maxCapacity: 120,
  openTime: '06:00',
  closeTime: '24:00',

  // 알림 설정
  emailNotifications: true,
  smsNotifications: false,
  fullCapacityAlert: true,

  // 요금 설정
  dailyPrice: 8000,
  monthlyPrice: 180000,
  yearlyPrice: 1800000,

  // 시스템 설정
  autoBackup: true,
  backupFrequency: 'daily',
  dataRetention: '90'
})

const saveSettings = async () => {
  isLoading.value = true

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1500))

    alert('설정이 성공적으로 저장되었습니다.')
  } catch (error) {
    alert('설정 저장 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.settings-view {
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

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.settings-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.settings-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  margin-right: 2rem;
}

.setting-info label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.setting-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

/* 입력 필드 스타일 */
.setting-item input[type="text"],
.setting-item input[type="number"],
.setting-item input[type="time"],
.setting-item select {
  padding: 0.5rem 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.875rem;
  min-width: 120px;
  transition: border-color 0.2s ease;
}

.setting-item input:focus,
.setting-item select:focus {
  outline: none;
  border-color: #667eea;
}

/* 시간 입력 */
.time-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-inputs span {
  color: #666;
  font-weight: 500;
}

/* 가격 입력 */
.price-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input span {
  color: #666;
  font-weight: 500;
  font-size: 0.875rem;
}

/* 토글 스위치 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 저장 섹션 */
.save-section {
  text-align: center;
}

.save-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.icon {
  width: 18px;
  height: 18px;
}

/* 반응형 */
@media (max-width: 768px) {
  .settings-view {
    padding: 1rem 0;
  }

  .page-header h2 {
    font-size: 2rem;
  }

  .settings-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .settings-card {
    padding: 1.5rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 0;
  }

  .setting-info {
    margin-right: 0;
  }

  .setting-item input,
  .setting-item select {
    width: 100%;
    min-width: auto;
  }

  .time-inputs,
  .price-input {
    width: 100%;
    justify-content: space-between;
  }

  .toggle-switch {
    align-self: flex-end;
  }
}
</style>
