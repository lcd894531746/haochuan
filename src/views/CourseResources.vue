<template>
  <section class="page-grid two-col course-page">
    <!-- 左侧：课程列表 -->
    <article class="surface-card element-card course-main">
      <div class="section-head">
        <h2 class="page-main-title with-icon">
          <span class="page-main-title-icon">▣</span>
          <span>课程管理</span>
        </h2>
        <div class="action-row">
          <el-button type="primary" @click="openCreateCourse">新建课程</el-button>
        </div>
      </div>

      <div class="element-filter-form">
        <el-form :inline="true" :model="filters" class="element-filter-fields">
          <el-form-item>
            <el-input v-model="filters.keyword" placeholder="课程名称" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.category" placeholder="课程分类" clearable style="width: 150px">
              <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.status" placeholder="上架状态" clearable style="width: 140px">
              <el-option label="已上架" value="已上架" />
              <el-option label="待上架" value="待上架" />
              <el-option label="已下架" value="已下架" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.year" placeholder="培训年度" clearable style="width: 120px">
              <el-option label="2026" value="2026" />
              <el-option label="2025" value="2025" />
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
          :data="courses"
          class="element-table"
          border
          stripe
          height="100%"
          @row-click="openCourse"
        >
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="name" label="课程名称" min-width="220" />
          <el-table-column prop="category" label="分类" width="140" />
          <el-table-column prop="hours" label="学时" width="80" align="center" />
          <el-table-column prop="chapters" label="章节数" width="90" align="center" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.statusType" effect="light" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="更新时间" width="160" />
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click.stop="openCourse(row)">编辑</el-button>
              <el-button link type="primary">复制</el-button>
              <el-button link type="danger">下架</el-button>
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
          :total="total"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </article>

    <!-- 右侧：课程详情与上传 / 章节信息 -->
    <aside class="user-permissions-side detail-panel-wrap">
      <div v-if="!selectedCourse" class="surface-card side-panel-mod detail-panel detail-panel-empty">
        <p class="detail-panel-hint">在左侧选择一个课程，可在这里查看详情与上传状态。</p>
        <ul class="detail-panel-actions">
          <li><strong>新建课程</strong> — 录入课程基本信息、学时与分类。</li>
          <li><strong>上传视频</strong> — 支持拖拽上传，多视频组成一个课程。</li>
          <li><strong>章节管理</strong> — 按章节拆分课时，控制上下架。</li>
        </ul>
      </div>

      <div v-else class="surface-card side-panel-mod detail-panel course-detail-panel">
        <div class="detail-panel-head">
          <h3 class="side-panel-title">课程详情</h3>
          <el-button link type="info" @click="selectedCourse = null">清空</el-button>
        </div>

        <el-form :model="detailForm" label-width="80px" class="detail-form">
          <el-form-item label="课程名称">
            <el-input v-model="detailForm.name" />
          </el-form-item>
          <el-form-item label="课程分类">
            <el-select v-model="detailForm.category" placeholder="课程分类">
              <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          <el-form-item label="学时与章节">
            <div class="course-hours-meta">
              <span>{{ detailForm.hours }}</span>
              <span class="muted">{{ detailForm.chapters }} 章节</span>
            </div>
          </el-form-item>
          <el-form-item label="上架状态">
            <el-select v-model="detailForm.status">
              <el-option label="已上架" value="已上架" />
              <el-option label="待上架" value="待上架" />
              <el-option label="已下架" value="已下架" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="detailForm.desc" type="textarea" rows="3" />
          </el-form-item>
        </el-form>

        <div class="detail-subsection">
          <p class="section-kicker">视频上传</p>
          <div class="upload-dropzone mini">
            <div class="upload-dropzone-inner">
              <strong>拖拽上传课程视频</strong>
              <p>支持单个或批量上传，自动转码适配多终端播放。</p>
              <div class="upload-actions">
                <el-button size="small" type="primary">上传视频</el-button>
                <el-button size="small">批量上传</el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-subsection">
          <p class="section-kicker">上传状态</p>
          <ul class="tree-list">
            <li v-for="item in transcodes" :key="item.name">
              <strong>{{ item.name }}</strong>
              <span>{{ item.status }}</span>
            </li>
          </ul>
        </div>

        <div class="detail-form-footer">
          <el-button>取消</el-button>
          <el-button type="primary">保存</el-button>
        </div>
      </div>
    </aside>

    <!-- 新建课程弹窗 -->
    <el-dialog v-model="createDialogVisible" title="新建课程" width="640px" destroy-on-close>
      <el-form :model="createForm" label-width="90px" class="detail-form">
        <el-form-item label="课程名称">
          <el-input v-model="createForm.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="createForm.category" placeholder="请选择课程分类">
            <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="培训年度">
          <el-select v-model="createForm.year" placeholder="请选择年度">
            <el-option label="2026" value="2026" />
            <el-option label="2025" value="2025" />
          </el-select>
        </el-form-item>
        <el-form-item label="学时与章节">
          <div class="course-hours-meta">
            <el-input-number v-model="createForm.chapters" :min="1" :max="30" />&nbsp;
            <span class="muted">章节</span>
            <el-input v-model="createForm.hours" style="margin-left: 12px; width: 120px" placeholder="例如 8 学时" />
          </div>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-select v-model="createForm.status">
            <el-option label="待上架" value="待上架" />
            <el-option label="已上架" value="已上架" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="createForm.desc" type="textarea" rows="3" placeholder="简要描述课程对象与内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCreateCourse">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const categoryOptions = ['水利施工', '项目管理', '质量检测', '新员工', '年度必修']

const filters = reactive({
  keyword: '',
  category: '',
  status: '',
  year: '2026',
})

const courses = ref([
  { name: '水工建筑物施工安全专项课', category: '水利施工', hours: '8 学时', chapters: 4, status: '已上架', statusType: 'success', updatedAt: '2026-02-12 10:28' },
  { name: '水利工程项目管理实务', category: '项目管理', hours: '16 学时', chapters: 6, status: '已上架', statusType: 'success', updatedAt: '2026-01-30 16:40' },
  { name: '工程质量检测与验收规范', category: '质量检测', hours: '6 学时', chapters: 5, status: '待上架', statusType: 'warning', updatedAt: '2026-02-06 09:15' },
  { name: '新员工入场与安全教育', category: '新员工', hours: '4 学时', chapters: 3, status: '已上架', statusType: 'success', updatedAt: '2026-01-18 14:20' },
  { name: '年度必修：水利施工安全案例库', category: '年度必修', hours: '10 学时', chapters: 5, status: '已下架', statusType: 'info', updatedAt: '2025-12-28 19:02' },
])

const total = courses.value.length
const currentPage = ref(1)
const pageSize = ref(10)

const transcodes = [
  { name: '围堰施工安全警示教育.mp4', status: '转码完成，已发布' },
  { name: '泵站机电设备运行维护.mov', status: '转码中，预计 3 分钟完成' },
  { name: '质量检测现场取样规范.avi', status: '待审核封面与简介' },
]

const chapters = [
  { title: '拖拽排序', desc: '支持多视频组合成完整课程，按章节顺序自由调整。' },
  { title: '课时拆分', desc: '每节 25-45 分钟，自动累计到课程总学时。' },
  { title: '上下架控制', desc: '可按培训年度发布、停用或过期关闭课程。' },
]

const tags = ['水利施工', '安全管理', '质量检测', '项目管理', '新员工', '一级建造师', '年度必修', '季度专项']

const selectedCourse = ref(null)
const createDialogVisible = ref(false)

const detailForm = reactive({
  name: '',
  category: '',
  hours: '',
  chapters: 0,
  status: '已上架',
  desc: '',
})

const createForm = reactive({
  name: '',
  category: '',
  year: '2026',
  hours: '8 学时',
  chapters: 4,
  status: '待上架',
  desc: '',
})

function resetFilters() {
  filters.keyword = ''
  filters.category = ''
  filters.status = ''
  filters.year = '2026'
}

function openCourse(row) {
  selectedCourse.value = row
  Object.assign(detailForm, {
    name: row.name,
    category: row.category,
    hours: row.hours,
    chapters: row.chapters,
    status: row.status,
    desc: `${row.category} / ${row.hours} / ${row.chapters} 章节`,
  })
}

function openCreateCourse() {
  Object.assign(createForm, {
    name: '',
    category: '',
    year: '2026',
    hours: '8 学时',
    chapters: 4,
    status: '待上架',
    desc: '',
  })
  createDialogVisible.value = true
}

function saveCreateCourse() {
  if (!createForm.name || !createForm.category) {
    createDialogVisible.value = false
    return
  }
  courses.value.unshift({
    name: createForm.name,
    category: createForm.category,
    hours: createForm.hours,
    chapters: createForm.chapters,
    status: createForm.status,
    statusType: createForm.status === '已上架' ? 'success' : createForm.status === '待上架' ? 'warning' : 'info',
    updatedAt: `${createForm.year}-01-01 00:00`,
  })
  createDialogVisible.value = false
}
</script>

