<template>
  <section class="page-grid element-crud-page">
    <article class="surface-card element-card">
      <div class="section-head">
        <h2 class="page-main-title with-icon">
          <span class="page-main-title-icon">▣</span>
          <span>培训计划管理</span>
        </h2>
        <div class="action-row">
          <el-button type="primary" @click="openCreateDialog">新建计划</el-button>
          <el-button>批量导出</el-button>
        </div>
      </div>

      <div class="element-filter-form">
        <el-form :inline="true" :model="filters" class="element-filter-fields">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="计划名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.year" placeholder="培训年度" clearable style="width: 140px">
              <el-option label="2026" value="2026" />
              <el-option label="2025" value="2025" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.role" placeholder="岗位类别" clearable style="width: 180px">
              <el-option label="安管人员" value="安管人员" />
              <el-option label="一级建造师" value="一级建造师" />
              <el-option label="技术人员" value="技术人员" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.period"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-form>

        <div class="element-filter-actions">
          <el-button type="primary">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </div>

      <div class="element-table-wrap">
        <el-table :data="plans" class="element-table" border stripe height="100%">
          <el-table-column type="index" label="序号" width="70" />
          <el-table-column prop="name" label="计划名称" min-width="220" />
          <el-table-column prop="period" label="培训周期" width="180" />
          <el-table-column prop="target" label="覆盖对象" min-width="180" />
          <el-table-column prop="pack" label="课程包" min-width="180" />
          <el-table-column prop="progress" label="进度" width="90" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.tagType" effect="light">{{ row.state }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary">查看</el-button>
              <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
              <el-button link type="success">发布</el-button>
              <el-button link type="danger">删除</el-button>
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新建计划' : '编辑计划'"
      width="960px"
      class="plan-dialog"
    >
      <el-form :model="planForm" label-width="100px" class="plan-dialog-form">
        <div class="plan-dialog-grid">
          <el-form-item label="计划名称">
            <el-input v-model="planForm.name" />
          </el-form-item>
          <el-form-item label="培训周期">
            <el-date-picker
              v-model="planForm.period"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="培训目标">
            <el-input v-model="planForm.goal" />
          </el-form-item>
          <el-form-item label="适用岗位">
            <el-select v-model="planForm.roles" multiple placeholder="选择岗位">
              <el-option label="安管人员" value="安管人员" />
              <el-option label="项目管理" value="项目管理" />
              <el-option label="施工班组长" value="施工班组长" />
              <el-option label="技术人员" value="技术人员" />
            </el-select>
          </el-form-item>
          <el-form-item label="绑定课程包">
            <el-select v-model="planForm.package" placeholder="选择课程包">
              <el-option label="施工安全专项课 + 事故案例复盘 + 法规宣贯" value="施工安全专项课 + 事故案例复盘 + 法规宣贯" />
              <el-option label="一建年度课程包" value="一建年度课程包" />
              <el-option label="质量检测课程包" value="质量检测课程包" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <div class="plan-dialog-subgrid">
        <div class="dialog-block">
          <p class="section-kicker">岗位学时</p>
          <el-table :data="quotas" size="small" border>
            <el-table-column prop="name" label="岗位" />
            <el-table-column prop="hours" label="年度学时" width="120" />
          </el-table>
        </div>

        <div class="dialog-block">
          <p class="section-kicker">课程包配置</p>
          <el-table :data="packages" size="small" border>
            <el-table-column prop="name" label="课程包" min-width="180" />
            <el-table-column prop="meta" label="说明" min-width="260" />
          </el-table>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const filters = reactive({
  name: '',
  year: '2026',
  role: '',
  period: ['2026-01-01', '2026-12-31'],
})

const plans = [
  { name: '2026 年一级建造师继续教育', period: '2026.01 - 2026.12', target: '一级建造师 328 人', pack: '一建年度课程包', progress: '72%', state: '进行中', tagType: 'warning' },
  { name: '安全管理岗位季度专项培训', period: '2026.03 - 2026.06', target: '安管人员 412 人', pack: '安管季度课程包', progress: '61%', state: '待推进', tagType: 'primary' },
  { name: '新员工入职训练营', period: '2026.02 - 2026.04', target: '新员工 334 人', pack: '新员工基础课程包', progress: '84%', state: '已发布', tagType: 'success' },
  { name: '质量检测专项培训', period: '2026.03 - 2026.05', target: '技术质检 204 人', pack: '质量检测课程包', progress: '69%', state: '进行中', tagType: 'warning' },
]

const quotas = [
  { name: '一级建造师', hours: '60 学时/年' },
  { name: '安管人员', hours: '12 学时/年' },
  { name: '技术人员', hours: '30 学时/年' },
]

const packages = [
  { name: '一建年度课程包', meta: '12 门课程 / 60 学时 / 已推送 328 人' },
  { name: '安管季度课程包', meta: '6 门课程 / 12 学时 / 已推送 412 人' },
  { name: '质量检测课程包', meta: '5 门课程 / 8 学时 / 已推送 204 人' },
]

const dialogVisible = ref(false)
const dialogMode = ref('create')

const total = 36
const currentPage = ref(1)
const pageSize = ref(10)

const createForm = () => ({
  name: '2026 年水利施工安全专项培训',
  period: ['2026-03-01', '2026-06-30'],
  goal: '完成安全学习 12 学时，达标后解锁季度考试',
  roles: ['安管人员', '项目管理', '施工班组长'],
  package: '施工安全专项课 + 事故案例复盘 + 法规宣贯',
})

const planForm = reactive(createForm())

const resetFilters = () => {
  filters.name = ''
  filters.year = '2026'
  filters.role = ''
  filters.period = ['2026-01-01', '2026-12-31']
}

const openCreateDialog = () => {
  dialogMode.value = 'create'
  Object.assign(planForm, createForm())
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  dialogMode.value = 'edit'
  Object.assign(planForm, {
    name: row.name,
    period: ['2026-03-01', '2026-06-30'],
    goal: '完成安全学习 12 学时，达标后解锁季度考试',
    roles: ['安管人员', '项目管理'],
    package: row.pack,
  })
  dialogVisible.value = true
}
</script>
