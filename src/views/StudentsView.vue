<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, Edit, Trash2, User } from 'lucide-vue-next'

// 학생 데이터
const students = ref([])
const searchQuery = ref('')
const selectedStudents = ref([])
const showAddModal = ref(false)

// 새 학생 등록 폼
const newStudent = ref({
  name: '',
  email: '',
  phone: '',
  membershipType: 'monthly',
  status: 'active'
})

// 더미 데이터 로드
onMounted(() => {
  loadStudents()
})

const loadStudents = () => {
  // 실제로는 API에서 데이터를 가져옴
  students.value = [
    {
      id: 1,
      name: '김학생',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      membershipType: 'monthly',
      status: 'active',
      joinDate: '2024-01-15',
      lastVisit: '2024-08-06'
    },
    {
      id: 2,
      name: '이학생',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      membershipType: 'daily',
      status: 'active',
      joinDate: '2024-02-20',
      lastVisit: '2024-08-05'
    },
    {
      id: 3,
      name: '박학생',
      email: 'park@example.com',
      phone: '010-3456-7890',
      membershipType: 'yearly',
      status: 'inactive',
      joinDate: '2023-12-10',
      lastVisit: '2024-07-30'
    }
  ]
}

// 필터링된 학생 목록
const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value

  return students.value.filter(student =>
    student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    student.phone.includes(searchQuery.value)
  )
})

// 멤버십 타입 표시
const getMembershipTypeText = (type) => {
  const types = {
    daily: '일일권',
    monthly: '월정기권',
    yearly: '연간권'
  }
  return types[type] || type
}

// 상태 표시
const getStatusText = (status) => {
  return status === 'active' ? '활성' : '비활성'
}

// 새 학생 추가
const addStudent = () => {
  // 실제로는 API 호출
  const id = Math.max(...students.value.map(s => s.id)) + 1
  students.value.push({
    id,
    ...newStudent.value,
    joinDate: new Date().toISOString().split('T')[0],
    lastVisit: new Date().toISOString().split('T')[0]
  })

  // 폼 초기화
  newStudent.value = {
    name: '',
    email: '',
    phone: '',
    membershipType: 'monthly',
    status: 'active'
  }
  showAddModal.value = false
}

// 학생 삭제
const deleteStudent = (studentId) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    const index = students.value.findIndex(s => s.id === studentId)
    if (index > -1) {
      students.value.splice(index, 1)
    }
  }
}
</script>

<template>
  <div class="students-view">
    <div class="container">
      <div class="page-header">
        <h2>학생 관리</h2>
        <p class="subtitle">학생 정보를 관리하고 멤버십을 확인하세요</p>
      </div>

      <!-- 검색 및 액션 바 -->
      <div class="action-bar">
        <div class="search-container">
          <Search class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="이름, 이메일, 전화번호로 검색..."
            class="search-input"
          />
        </div>

        <button
          @click="showAddModal = true"
          class="add-button"
        >
          <Plus class="icon" />
          학생 추가
        </button>
      </div>

      <!-- 학생 목록 -->
      <div class="students-table-container">
        <div class="students-grid">
          <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="student-card"
          >
            <div class="card-header">
              <div class="student-avatar">
                <User class="avatar-icon" />
              </div>

              <div class="student-info">
                <h3>{{ student.name }}</h3>
                <p>{{ student.email }}</p>
              </div>
            </div>

            <div class="card-body">
              <div class="info-row">
                <span class="label">전화번호</span>
                <span class="value">{{ student.phone }}</span>
              </div>

              <div class="info-row">
                <span class="label">멤버십</span>
                <span class="value membership">{{ getMembershipTypeText(student.membershipType) }}</span>
              </div>

              <div class="info-row">
                <span class="label">상태</span>
                <span :class="['status', student.status]">
                  {{ getStatusText(student.status) }}
                </span>
              </div>

              <div class="info-row">
                <span class="label">가입일</span>
                <span class="value">{{ student.joinDate }}</span>
              </div>

              <div class="info-row">
                <span class="label">최근 방문</span>
                <span class="value">{{ student.lastVisit }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button class="edit-button">
                <Edit class="icon" />
                수정
              </button>
              <button
                @click="deleteStudent(student.id)"
                class="delete-button"
              >
                <Trash2 class="icon" />
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 빈 상태 -->
        <div v-if="filteredStudents.length === 0" class="empty-state">
          <User class="empty-icon" />
          <h3>학생이 없습니다</h3>
          <p>새로운 학생을 추가해보세요</p>
        </div>
      </div>

      <!-- 학생 추가 모달 -->
      <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>새 학생 추가</h3>
            <button @click="showAddModal = false" class="close-button">×</button>
          </div>

          <form @submit.prevent="addStudent" class="modal-body">
            <div class="form-group">
              <label>이름</label>
              <input
                v-model="newStudent.name"
                type="text"
                required
                placeholder="학생 이름을 입력하세요"
              />
            </div>

            <div class="form-group">
              <label>이메일</label>
              <input
                v-model="newStudent.email"
                type="email"
                required
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div class="form-group">
              <label>전화번호</label>
              <input
                v-model="newStudent.phone"
                type="tel"
                required
                placeholder="전화번호를 입력하세요"
              />
            </div>

            <div class="form-group">
              <label>멤버십 타입</label>
              <select v-model="newStudent.membershipType">
                <option value="daily">일일권</option>
                <option value="monthly">월정기권</option>
                <option value="yearly">연간권</option>
              </select>
            </div>

            <div class="form-group">
              <label>상태</label>
              <select v-model="newStudent.status">
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showAddModal = false" class="cancel-button">
                취소
              </button>
              <button type="submit" class="submit-button">
                추가
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.students-view {
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

/* 액션 바 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #666;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.add-button:hover {
  transform: translateY(-2px);
}

.icon {
  width: 18px;
  height: 18px;
}

/* 테이블 컨테이너 */
.students-table-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

/* 학생 그리드 */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.student-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.student-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.student-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar-icon {
  width: 24px;
  height: 24px;
}

.student-info {
  flex: 1;
}

.student-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
}

.student-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

/* 카드 본문 */
.card-body {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.info-row .value {
  font-size: 0.875rem;
  color: #333;
  font-weight: 600;
}

.membership {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}

/* 카드 액션 */
.card-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-button:hover {
  background: #bbdefb;
}

.delete-button {
  background: #ffebee;
  color: #d32f2f;
}

.delete-button:hover {
  background: #ffcdd2;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem auto;
  opacity: 0.3;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button,
.submit-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
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

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 반응형 */
@media (max-width: 768px) {
  .students-view {
    padding: 1rem 0;
  }

  .page-header h2 {
    font-size: 2rem;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    min-width: auto;
  }

  .students-table-container {
    padding: 1rem;
  }

  .students-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .student-card {
    padding: 1rem;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>
