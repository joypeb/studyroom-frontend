import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalStudents: 0,
    currentOccupancy: 0,
    maxCapacity: 120,
    todayRevenue: 0
  })

  const recentActivities = ref([])

  const loadDashboardData = async () => {
    // 실제로는 API 호출
    stats.value = {
      totalStudents: 85,
      currentOccupancy: 67,
      maxCapacity: 120,
      todayRevenue: 340000
    }

    recentActivities.value = [
      { id: 1, type: 'checkin', user: '김학생', time: '09:30', message: '입실' },
      { id: 2, type: 'checkout', user: '이학생', time: '09:25', message: '퇴실' },
      { id: 3, type: 'payment', user: '박학생', time: '09:20', message: '월 정기권 결제' },
      { id: 4, type: 'checkin', user: '최학생', time: '09:15', message: '입실' }
    ]
  }

  return {
    stats,
    recentActivities,
    loadDashboardData
  }
})
