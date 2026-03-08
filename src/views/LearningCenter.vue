<template>
  <section class="page-grid two-col course-page learning-table-page">
    <article class="surface-card element-card course-main">
      <div class="section-head">
        <h2 class="page-main-title with-icon">
          <span class="page-main-title-icon">▣</span>
          <span>视频学习</span>
        </h2>
      </div>

      <div class="element-filter-form">
        <el-form :inline="true" :model="filters" class="element-filter-fields">
          <el-form-item>
            <el-input v-model="filters.keyword" placeholder="课程名称" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.category" placeholder="课程分类" clearable style="width: 150px">
              <el-option v-for="item in categories" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.status" placeholder="学习状态" clearable style="width: 140px">
              <el-option label="学习中" value="学习中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="待学习" value="待学习" />
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
          :data="courseRows"
          class="element-table"
          border
          stripe
          height="100%"
          highlight-current-row
          @row-click="selectCourse"
        >
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="name" label="课程名称" min-width="240" />
          <el-table-column prop="categoryLabel" label="分类" width="140" />
          <el-table-column prop="hours" label="学时" width="90" align="center" />
          <el-table-column prop="chapters" label="章节数" width="90" align="center" />
          <el-table-column prop="study" label="学习进度" min-width="180" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.tagType" effect="light" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="progress" label="完成度" width="90" align="center" />
          <el-table-column label="操作" width="160" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click.stop="selectCourse(row)">查看</el-button>
              <el-button link type="primary">继续学习</el-button>
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
          :total="courseRows.length"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </article>

    <aside class="user-permissions-side detail-panel-wrap">
      <div class="surface-card side-panel-mod detail-panel learning-side-panel">
        <div class="detail-panel-head">
          <h3 class="side-panel-title">个人学习记录</h3>
          <el-tag type="primary" effect="light">年度完成 76%</el-tag>
        </div>

        <div class="learning-side-summary">
          <strong>{{ selectedCourse.name }}</strong>
          <p>{{ selectedCourse.desc }}</p>
          <div class="learning-side-meta">
            <span>{{ selectedCourse.categoryLabel }}</span>
            <span>{{ selectedCourse.hours }}</span>
            <span>{{ selectedCourse.chapters }}</span>
          </div>
        </div>

        <div class="detail-subsection">
          <p class="section-kicker">当前学习情况</p>
          <div class="learning-side-current">
            <div>
              <strong>{{ selectedCourse.progress }}</strong>
              <p>{{ selectedCourse.study }}</p>
            </div>
            <el-tag :type="selectedCourse.tagType" effect="light">{{ selectedCourse.status }}</el-tag>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: selectedCourse.progress }"></div>
          </div>
        </div>

        <div class="detail-subsection">
          <p class="section-kicker">分类学习记录</p>
          <div class="learning-side-list">
            <div v-for="item in currentCategoryRecords" :key="item.name" class="learning-side-item">
              <div>
                <strong>{{ item.name }}</strong>
                <p>{{ item.meta }}</p>
              </div>
              <span>{{ item.progress }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const categories = [
  { key: 'all', name: '全部课程' },
  { key: 'safety', name: '施工安全' },
  { key: 'project', name: '项目管理' },
  { key: 'quality', name: '质量检测' },
  { key: 'starter', name: '新员工培训' },
]

const filters = reactive({
  keyword: '',
  category: 'all',
  status: '',
})

const rows = [
  { id: 1, name: '水工建筑物施工安全专项课', category: 'safety', categoryLabel: '施工安全', hours: '8 学时', chapters: '4 章节', study: '已学 7.2 / 8 学时，完成后解锁考试', status: '学习中', tagType: 'warning', progress: '90%', desc: '面向施工、安全岗位的重点视频课程，支持断点续播和考试解锁。' },
  { id: 2, name: '水利工程项目管理实务', category: 'project', categoryLabel: '项目管理', hours: '16 学时', chapters: '6 章节', study: '已学 12.8 / 16 学时，项目管理岗位课程', status: '学习中', tagType: 'primary', progress: '80%', desc: '覆盖进度、质量、成本与现场组织管理，适用于项目管理岗位。' },
  { id: 3, name: '质量检测与验收规范', category: 'quality', categoryLabel: '质量检测', hours: '6 学时', chapters: '5 章节', study: '已学 6 / 6 学时，已完成', status: '已完成', tagType: 'success', progress: '100%', desc: '质检岗位核心课程，学习完成后可直接参加阶段考试。' },
  { id: 4, name: '新员工入场与安全教育', category: 'starter', categoryLabel: '新员工培训', hours: '4 学时', chapters: '3 章节', study: '已学 2.6 / 4 学时，学习中', status: '学习中', tagType: 'info', progress: '66%', desc: '新员工入场培训必修课程，聚焦基本制度和风险识别。' },
]

const currentPage = ref(1)
const pageSize = ref(10)
const selectedCourseId = ref(1)

const courseRows = computed(() =>
  rows.filter((item) => {
    const matchKeyword = !filters.keyword || item.name.includes(filters.keyword)
    const matchCategory = !filters.category || filters.category === 'all' || item.category === filters.category
    const matchStatus = !filters.status || item.status === filters.status
    return matchKeyword && matchCategory && matchStatus
  }),
)

const selectedCourse = computed(() => courseRows.value.find((item) => item.id === selectedCourseId.value) || courseRows.value[0] || rows[0])

const currentCategoryRecords = computed(() => {
  const category = selectedCourse.value?.category || 'all'
  return rows
    .filter((item) => category === 'all' || item.category === category)
    .map((item) => ({
      name: item.name,
      meta: item.study,
      progress: item.progress,
    }))
})

const selectCourse = (row) => {
  selectedCourseId.value = row.id
}

const resetFilters = () => {
  filters.keyword = ''
  filters.category = 'all'
  filters.status = ''
}
</script>
