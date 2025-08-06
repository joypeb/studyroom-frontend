// API 서비스 클래스
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8080'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // HTTP 요청 헬퍼
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // GET 요청
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    return this.request(url.pathname + url.search, {
      method: 'GET',
    })
  }

  // POST 요청
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT 요청
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // DELETE 요청
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }

  // PATCH 요청
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }
}

// API 서비스 인스턴스
const apiService = new ApiService()

// 사용자 관련 API
apiService.users = {
  getAll: (pagination = {}) => {
    const params = {
      page: pagination.page || 0,
      size: pagination.size || 10,
      sort: pagination.sort || 'createdAt,desc'
    }
    return apiService.get('/users', params)
  },

  getById: (userId) => {
    return apiService.get(`/users/${userId}`)
  },

  getByRole: (role, pagination = {}) => {
    const params = {
      role,
      page: pagination.page || 0,
      size: pagination.size || 10,
      sort: pagination.sort || 'createdAt,desc'
    }
    return apiService.get('/users/by-role', params)
  },

  create: (userData) => {
    return apiService.post('/users', userData)
  },

  update: (userId, userData) => {
    return apiService.put(`/users/${userId}`, userData)
  },

  updateStatus: (userId, status) => {
    return apiService.patch(`/users/${userId}/status`, { status })
  },

  delete: (userId) => {
    return apiService.delete(`/users/${userId}`)
  }
}

// 인증 관련 API
apiService.auth = {
  login: (credentials) => {
    return apiService.post('/auth/login', credentials)
  },

  logout: () => {
    return apiService.post('/auth/logout')
  },

  refresh: () => {
    return apiService.post('/auth/refresh')
  },

  register: (userData) => {
    return apiService.post('/auth/register', userData)
  }
}

// 좌석 관리 API
apiService.seats = {
  getAll: () => {
    return apiService.get('/seats')
  },

  getById: (seatId) => {
    return apiService.get(`/seats/${seatId}`)
  },

  updateStatus: (seatId, status) => {
    return apiService.patch(`/seats/${seatId}/status`, { status })
  },

  reserve: (seatId, userId) => {
    return apiService.post(`/seats/${seatId}/reserve`, { userId })
  },

  release: (seatId) => {
    return apiService.post(`/seats/${seatId}/release`)
  }
}

// 예약 관리 API
apiService.reservations = {
  getAll: (pagination = {}) => {
    const params = {
      page: pagination.page || 0,
      size: pagination.size || 10,
      sort: pagination.sort || 'createdAt,desc'
    }
    return apiService.get('/reservations', params)
  },

  getByUserId: (userId, pagination = {}) => {
    const params = {
      page: pagination.page || 0,
      size: pagination.size || 10,
      sort: pagination.sort || 'createdAt,desc'
    }
    return apiService.get(`/reservations/user/${userId}`, params)
  },

  create: (reservationData) => {
    return apiService.post('/reservations', reservationData)
  },

  cancel: (reservationId) => {
    return apiService.patch(`/reservations/${reservationId}/cancel`)
  },

  extend: (reservationId, extendData) => {
    return apiService.patch(`/reservations/${reservationId}/extend`, extendData)
  }
}

// 통계 API
apiService.statistics = {
  getDashboard: () => {
    return apiService.get('/statistics/dashboard')
  },

  getUserStats: (userId) => {
    return apiService.get(`/statistics/users/${userId}`)
  },

  getSeatUsage: (dateRange = {}) => {
    return apiService.get('/statistics/seat-usage', dateRange)
  },

  getRevenue: (dateRange = {}) => {
    return apiService.get('/statistics/revenue', dateRange)
  }
}

// 설정 API
apiService.settings = {
  get: () => {
    return apiService.get('/settings')
  },

  update: (settings) => {
    return apiService.put('/settings', settings)
  },

  getOperatingHours: () => {
    return apiService.get('/settings/operating-hours')
  },

  updateOperatingHours: (hours) => {
    return apiService.put('/settings/operating-hours', hours)
  }
}

export { apiService }
