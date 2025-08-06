import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials) => {
    // 실제로는 API 호출
    const { email, password } = credentials
    
    if (email === 'admin@example.com' && password === 'admin123') {
      user.value = {
        id: 1,
        name: '관리자',
        email: 'admin@example.com',
        role: 'admin'
      }
      return true
    }
    
    throw new Error('Invalid credentials')
  }

  const logout = () => {
    user.value = null
  }

  const updateProfile = async (profileData) => {
    // 실제로는 API 호출
    if (user.value) {
      Object.assign(user.value, profileData)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  }
})
