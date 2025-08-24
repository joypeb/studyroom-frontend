<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>로그인</h2>
          <p>독서실 관리 시스템에 로그인하세요</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">이메일</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              placeholder="이메일을 입력하세요"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="password">비밀번호</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="비밀번호를 입력하세요"
              :disabled="isLoading"
            />
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input v-model="loginForm.rememberMe" type="checkbox" />
              <span class="checkmark"></span>
              로그인 정보 기억하기
            </label>
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">로그인</span>
            <span v-else class="loading">로그인 중...</span>
          </button>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>

        <div class="login-footer">
          <p>계정이 없으신가요? <a href="#" class="register-link">회원가입</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 간단한 더미 인증 체크
    if (loginForm.email === 'admin@example.com' && loginForm.password === 'admin123') {
      // 로그인 성공
      router.push('/')
    } else {
      errorMessage.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
    }
  } catch (error) {
    errorMessage.value = '로그인 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem 2rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.login-form {
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
  padding: 0.875rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: #666;
}

.checkbox-container input {
  opacity: 0;
  cursor: pointer;
  margin: 0;
}

.checkmark {
  height: 18px;
  width: 18px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-right: 0.5rem;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #e0e0e0;
}

.checkbox-container input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.login-button {
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.login-footer p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 480px) {
  .login-view {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }
}
</style>