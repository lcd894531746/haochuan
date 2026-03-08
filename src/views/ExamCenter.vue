<template>
  <section class="page-grid two-col course-page exam-page">
    <article class="surface-card element-card course-main">
      <div class="section-head">
        <h2 class="page-main-title with-icon">
          <span class="page-main-title-icon">▣</span>
          <span>在线考试</span>
        </h2>
      </div>

      <div class="element-filter-form">
        <el-form :inline="true" :model="filters" class="element-filter-fields">
          <el-form-item>
            <el-input v-model="filters.keyword" placeholder="考试名称" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.category" placeholder="考试分类" clearable style="width: 150px">
              <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.status" placeholder="考试状态" clearable style="width: 140px">
              <el-option label="可参加" value="可参加" />
              <el-option label="已通过" value="已通过" />
              <el-option label="待解锁" value="待解锁" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="element-filter-actions">
          <el-button type="primary">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </div>

      <div class="element-table-wrap">
        <el-table
          :data="filteredExams"
          class="element-table"
          border
          stripe
          height="100%"
          highlight-current-row
          @row-click="selectExam"
        >
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="name" label="考试名称" min-width="240" />
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="questionCount" label="题量" width="80" align="center" />
          <el-table-column prop="duration" label="时长" width="90" align="center" />
          <el-table-column prop="passLine" label="合格线" width="90" align="center" />
          <el-table-column prop="latestScore" label="最近得分" width="100" align="center" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.tagType" effect="light" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click.stop="selectExam(row)">查看</el-button>
              <el-button
                link
                type="success"
                :disabled="row.status === '待解锁'"
                @click.stop="goToExam(row)"
              >
                去考试
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="element-pagination-row">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredExams.length"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </article>

    <aside class="user-permissions-side detail-panel-wrap">
      <div class="surface-card side-panel-mod detail-panel exam-side-panel">
        <div class="detail-panel-head">
          <h3 class="side-panel-title">考试情况</h3>
          <el-tag :type="selectedExam.tagType" effect="light">{{ selectedExam.status }}</el-tag>
        </div>

        <div class="exam-side-summary">
          <strong>{{ selectedExam.name }}</strong>
          <p>{{ selectedExam.desc }}</p>
          <div class="exam-side-meta">
            <span>{{ selectedExam.category }}</span>
            <span>{{ selectedExam.questionCount }} 题</span>
            <span>{{ selectedExam.duration }}</span>
            <span>合格线 {{ selectedExam.passLine }}</span>
          </div>
        </div>

        <div class="detail-subsection">
          <p class="section-kicker">最近考试成绩</p>
          <div class="exam-result-grid">
            <div class="exam-result-item">
              <span>最近得分</span>
              <strong>{{ selectedExam.latestScore }}</strong>
            </div>
            <div class="exam-result-item">
              <span>考试次数</span>
              <strong>{{ selectedExam.attempts }}/3</strong>
            </div>
            <div class="exam-result-item">
              <span>考试日期</span>
              <strong>{{ selectedExam.examDate }}</strong>
            </div>
          </div>
        </div>

        <div class="detail-subsection">
          <p class="section-kicker">答题概况</p>
          <div class="learning-side-list">
            <div v-for="item in selectedExam.breakdown" :key="item.label" class="learning-side-item">
              <div>
                <strong>{{ item.label }}</strong>
                <p>{{ item.desc }}</p>
              </div>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div v-if="selectedExam.certificate" class="detail-subsection">
          <p class="section-kicker">证书状态</p>
          <div class="exam-certificate-card">
            <strong>电子证书已生成</strong>
            <p>{{ selectedExam.certificate.name }}</p>
            <span>{{ selectedExam.certificate.code }}</span>
          </div>
        </div>

        <div class="detail-form-footer">
          <el-button :disabled="selectedExam.status === '待解锁'" @click="goToExam(selectedExam)">去考试</el-button>
          <el-button v-if="selectedExam.certificate" type="primary">查看证书</el-button>
        </div>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = ['安全管理', '继续教育', '新员工培训']

const filters = reactive({
  keyword: '',
  category: '',
  status: '',
})

const exams = [
  {
    id: 1,
    name: '安全管理岗位季度考试',
    category: '安全管理',
    questionCount: 10,
    duration: '20分钟',
    passLine: '60分',
    latestScore: '84分',
    status: '可参加',
    tagType: 'success',
    attempts: 1,
    examDate: '2026-03-06',
    desc: '完成安全专项课程后开放的季度考试，单选题为主。',
    breakdown: [
      { label: '正确题数', desc: '本次答题正确数量', value: '8/10' },
      { label: '错误题数', desc: '答错题目数量', value: '2题' },
      { label: '用时', desc: '最近一次考试耗时', value: '12分钟' },
    ],
    certificate: {
      name: '安全管理培训结业证明',
      code: 'CERT-2026-0312',
    },
  },
  {
    id: 2,
    name: '一级建造师继续教育测评',
    category: '继续教育',
    questionCount: 10,
    duration: '20分钟',
    passLine: '60分',
    latestScore: '58分',
    status: '可参加',
    tagType: 'warning',
    attempts: 2,
    examDate: '2026-03-04',
    desc: '一级建造师继续教育完成后参加的年度测评。',
    breakdown: [
      { label: '正确题数', desc: '本次答题正确数量', value: '5/10' },
      { label: '错误题数', desc: '答错题目数量', value: '5题' },
      { label: '用时', desc: '最近一次考试耗时', value: '18分钟' },
    ],
    certificate: null,
  },
  {
    id: 3,
    name: '新员工入职测试',
    category: '新员工培训',
    questionCount: 10,
    duration: '15分钟',
    passLine: '80分',
    latestScore: '--',
    status: '待解锁',
    tagType: 'info',
    attempts: 0,
    examDate: '--',
    desc: '完成新员工必修课后开放的入职测试。',
    breakdown: [
      { label: '解锁条件', desc: '需先完成入职课程', value: '学习90%' },
      { label: '考试次数', desc: '剩余可参加次数', value: '3次' },
      { label: '当前状态', desc: '尚未开放考试入口', value: '待解锁' },
    ],
    certificate: null,
  },
]

const currentPage = ref(1)
const pageSize = ref(10)
const selectedExamId = ref(1)

const filteredExams = computed(() =>
  exams.filter((item) => {
    const matchKeyword = !filters.keyword || item.name.includes(filters.keyword)
    const matchCategory = !filters.category || item.category === filters.category
    const matchStatus = !filters.status || item.status === filters.status
    return matchKeyword && matchCategory && matchStatus
  }),
)

const selectedExam = computed(() => filteredExams.value.find((item) => item.id === selectedExamId.value) || filteredExams.value[0] || exams[0])

const selectExam = (row) => {
  selectedExamId.value = row.id
}

const goToExam = (row) => {
  if (row.status === '待解锁') return
  router.push({ name: 'exam-session', query: { examId: String(row.id) } })
}

const resetFilters = () => {
  filters.keyword = ''
  filters.category = ''
  filters.status = ''
}
</script>
