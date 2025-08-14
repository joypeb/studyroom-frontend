// monitoring.js
import { apiRequest } from './api.js';

export const monitoringApi = {
  // 현재 활성화 중인 세션 전체 조회 (리스트)
  async getSessionsSnapshot() {
    return await apiRequest('/admin/monitoring/sessions/snapshot')
  },

  // 현재 활성화 된 세션 개수 조회
  async getSessionsCount() {
    return await apiRequest('/admin/monitoring/sessions/count')
  }
  /* post요청 예시
  const data2 = await apiRequest('/api/products', {
          method: 'POST',
          body: JSON.stringify({ name: '상품명', price: 10000 })
        });
   */
}

export const monitoringSSE = {
  getRealtimeSessions(onData, onError) {
    const eventSource = new EventSource('/admin/monitoring/sessions/list/realtime')

    eventSource.addEventListener('sessions-list-update', (event) => {
      const sessions = JSON.parse(event.data)
      onData(sessions)
    })

    eventSource.addEventListener('error', (event) => {
      console.error('SSE 연결 오류:', event)
      onError?.(event)
    })

    return eventSource
  }
}
