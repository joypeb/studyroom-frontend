<template>
  <div class="profile-view">
    <div class="container">
      <div class="page-header">
        <h2>프로필</h2>
        <p class="subtitle">계정 정보를 관리하세요</p>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              <User class="avatar-icon" />
            </div>
            <div class="profile-info">
              <h3>{{ userProfile.name }}</h3>
              <p>{{ userProfile.role }}</p>
            </div>
          </div>

          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label>이름</label>
              <input
                v-model="userProfile.name"
                type="text"
                required
                :disabled="!isEditing"
              />
            </div>

            <div class="form-group">
              <label>이메일</label>
              <input
                v-model="userProfile.email"
                type="email"
                required
                :disabled="!isEditing"
              />
            </div>

            <div class="form-group">
              <label>전화번호</label>
              <input
                v-model="userProfile.phone"
                type="tel"
                :disabled="!isEditing"
              />
            </div>

            <div class="form-group">
              <label>역할</label>
              <input
                v-model="userProfile.role"
                type="text"
                disabled
              />
            </div>

            <div class="form-actions">
              <button
                v-if="!isEditing"
                type="button"
                @click="isEditing = true"
                class="edit-button"
              >
                <Edit class="icon" />
                수정
              </button>
              
              <div v-else class="edit-actions">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="cancel-button"
                >
                  취소
                </button>
                <button
                  type="submit"
                  class="save-button"
                  :disabled="isLoading"
                >
                  <span v-if="!isLoading">저장</span>
                  <span v-else>저장 중...</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="security-card">
          <h3>보안</h3>
          <div class="security-info">
            <div class="info-item">
              <span class="label">마지막 로그인</span>
              <span class="value">{{ userProfile.lastLogin }}</span>
            </div>
            <div class="info-item">
              <span class="label">계정 생성일</span>
              <span class="value">{{ userProfile.createdAt }}</span>
            </div>
          </div>
          
          <button @click="changePassword" class="password-button">
            <Lock class="icon" />
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Edit, Lock } from 'lucide-vue-next'

const isEditing = ref(false)
const isLoading = ref(false)

const userProfile = reactive({
  name: '관리자',
  email: 'admin@studyroom.com',
  phone: '02-1234-5678',
  role: '시스템 관리자',
  lastLogin: '2024-08-06 10:30',
  createdAt: '2024-01-15'
})

const originalProfile = { ...userProfile }

const updateProfile = async () => {
  isLoading.value = true
  
  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    isEditing.value = false
    alert('프로필이 성공적으로 업데이트되었습니다.')
  } catch (error) {
    alert('프로필 업데이트 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

const cancelEdit = () => {
  Object.assign(userProfile, originalProfile)
  isEditing.value = false
}

const changePassword = () => {
  alert('비밀번호 변경 기능은 추후 구현 예정입니다.')
}
</script>

<style scoped>
.profile-view {
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

.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.profile-card,
.security-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar-icon {
  width: 40px;
  height: 40px;
}

.profile-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.profile-info p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus:not(:disabled) {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f8f9fa;
  color: #666;
}

.form-actions {
  margin-top: 1rem;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

.cancel-button,
.save-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background: #f8f9fa;
  color: #666;
}

.cancel-button:hover {
  background: #e9ecef;
}

.save-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  width: 18px;
  height: 18px;
}

/* 보안 카드 */
.security-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.security-info {
  margin-bottom: 2rem;
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

.info-item .label {
  font-weight: 600;
  color: #666;
  font-size: 0.875rem;
}

.info-item .value {
  color: #333;
  font-size: 0.875rem;
}

.password-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.password-button:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

/* 반응형 */
@media (max-width: 768px) {
  .profile-view {
    padding: 1rem 0;
  }

  .page-header h2 {
    font-size: 2rem;
  }

  .profile-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .profile-card,
  .security-card {
    padding: 1.5rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar {
    width: 60px;
    height: 60px;
  }

  .avatar-icon {
    width: 30px;
    height: 30px;
  }

  .edit-actions {
    flex-direction: column;
  }
}
</style>