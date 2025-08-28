// monitoring.js
import { apiRequest } from './api.js';

export const monitoringApi = {
  // 현재 활성화 중인 세션 전체 조회 (리스트) - 임시 데이터 반환
  async getSessionsSnapshot() {
    // return await apiRequest('/admin/monitoring/sessions/snapshot')
    return {
      sessions: [
        {
          sessionId: 'session_001',
          userId: 'user_123',
          userName: '김학생',
          startTime: '2024-01-28T09:00:00Z',
          roomName: '스터디룸 A',
          status: 'active',
          duration: 120
        },
        {
          sessionId: 'session_002', 
          userId: 'user_456',
          userName: '이학생',
          startTime: '2024-01-28T10:30:00Z',
          roomName: '스터디룸 B',
          status: 'active',
          duration: 90
        },
        {
          sessionId: 'session_003',
          userId: 'user_789',
          userName: '박학생', 
          startTime: '2024-01-28T11:15:00Z',
          roomName: '스터디룸 C',
          status: 'active',
          duration: 45
        }
      ]
    }
  },

  // 현재 활성화 된 세션 개수 조회 - 임시 데이터 반환
  async getSessionsCount() {
    // return await apiRequest('/admin/monitoring/sessions/count')
    return {
      count: 3,
      totalRooms: 5,
      activeRooms: 3
    }
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
    // 임시 데이터로 SSE 동작 시뮬레이션
    const mockSessions = [
      {
        sessionId: 'session_001',
        userId: 'user_123', 
        userName: '김학생',
        startTime: '2024-01-28T09:00:00Z',
        roomName: '스터디룸 A',
        status: 'active',
        duration: 125
      },
      {
        sessionId: 'session_002',
        userId: 'user_456',
        userName: '이학생', 
        startTime: '2024-01-28T10:30:00Z',
        roomName: '스터디룸 B',
        status: 'active',
        duration: 95
      }
    ]

    // 5초마다 임시 데이터 업데이트
    const interval = setInterval(() => {
      mockSessions.forEach(session => {
        session.duration += 5
      })
      onData(mockSessions)
    }, 5000)

    // 초기 데이터 전송
    setTimeout(() => onData(mockSessions), 100)

    // cleanup 함수를 가진 객체 반환 (EventSource와 유사한 인터페이스)
    return {
      close() {
        clearInterval(interval)
      }
    }
  }
}
