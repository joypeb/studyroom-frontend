// API 기본 설정
export const API_BASE_URL = 'http://localhost:8080'

// API 요청을 위한 기본 함수 (다른 파일에서 import해서 사용)
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    method: 'GET',
    mode: 'no-cors', // CORS 우회 테스트
    headers: {
      'Accept': 'application/json',
    },
    ...options // 전달받은 옵션으로 덮어쓰기
  };

  // POST/PUT 요청시 Content-Type 자동 추가
  if ((defaultOptions.method === 'POST' || defaultOptions.method === 'PUT') &&
      defaultOptions.body &&
      !defaultOptions.headers['Content-Type']) {
    defaultOptions.headers['Content-Type'] = 'application/json'
  }

  // 인증 토큰이 있으면 헤더에 추가
  const token = localStorage.getItem('authToken')
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }
  // 비동기 요청 시작
  try {
    console.log('Request URL:', url) // 디버깅용
    console.log('Request options:', defaultOptions) // 디버깅용

    const response = await fetch(url, defaultOptions) // 여기서 네트워크 요청이 완료될 때까지 대기한다.

    console.log("request done ======== ");
    console.log('Response status:', response.status)
    console.log('Response headers:', [...response.headers.entries()])
    // 응답처리 : 응답 에러
    if (!response.ok) {
      // 401 에러면 로그인 페이지로 리다이렉트
      if (response.status === 401) {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
        return
      }

      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    }
    // 응답처리 : 응답 성공
    const data = await response.json()
    return data
  } catch (error) {  // 요청 중 에러 처리
    console.error(`API request failed for ${endpoint}:`, error)

    // 백엔드 연결 상태 확인
    const isBackendUp = await checkBackendStatus()
    if (!isBackendUp) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
    }

    throw error
  }
}

// 편의 함수들
export const get = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const url = queryString ? `${endpoint}?${queryString}` : endpoint
  return apiRequest(url)
}

export const post = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const put = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export const del = (endpoint) => {
  return apiRequest(endpoint, {
    method: 'DELETE'
  })
}

// 백엔드 상태 확인 함수
export const checkBackendStatus = async () => {
  try {
    // 백엔드 헬스체크 엔드포인트 호출
    const response = await fetch('http://localhost:8080/hello', {
      method: 'GET',
      // 타임아웃 설정을 위한 AbortController
      signal: AbortSignal.timeout(5000) // 5초 타임아웃
    });

    // 응답이 성공적이면 true 반환
    return response.ok; // status가 200-299면 true

  } catch (error) {
    // 네트워크 에러, 타임아웃, 서버 다운 등의 경우
    console.error('백엔드 연결 실패:', error.message);
    return false;
  }
};
