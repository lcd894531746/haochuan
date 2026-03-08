<template>
  <section class="page-grid analytics-page">
    <article class="surface-card analytics-card">
      <div class="section-head">
        <h2 class="page-main-title with-icon">
          <span class="page-main-title-icon">▣</span>
          <span>统计分析</span>
        </h2>
      </div>

      <!-- 统计概览 -->
      <div class="analytics-stats-strip">
        <div class="stat-block">
          <span class="stat-label">参训人数</span>
          <strong class="stat-value">2,486</strong>
          <span class="stat-desc">本年度在册</span>
        </div>
        <div class="stat-block">
          <span class="stat-label">完成率</span>
          <strong class="stat-value">78%</strong>
          <span class="stat-desc">已达标 1,938 人</span>
        </div>
        <div class="stat-block">
          <span class="stat-label">平均学时</span>
          <strong class="stat-value">18.2</strong>
          <span class="stat-desc">应学 / 已学达标</span>
        </div>
        <div class="stat-block">
          <span class="stat-label">证书发放</span>
          <strong class="stat-value">1,826</strong>
          <span class="stat-desc">已生成证书编号</span>
        </div>
      </div>

      <!-- 培训档案导出 -->
      <div class="analytics-archive-section">
        <p class="section-kicker">培训档案</p>
        <h3 class="archive-title">参训信息汇总表导出</h3>
        <p class="archive-desc">按年度、部门、岗位筛选后导出：姓名、应学课时、已学课时、完成状态、考试成绩、证书编号。</p>

        <div class="element-filter-form archive-filter">
          <el-form :inline="true" :model="exportFilters" class="element-filter-fields">
            <el-form-item label="年度">
              <el-select v-model="exportFilters.year" placeholder="选择年度" clearable style="width: 120px">
                <el-option label="2026" value="2026" />
                <el-option label="2025" value="2025" />
                <el-option label="2024" value="2024" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="exportFilters.department" placeholder="选择部门" clearable style="width: 160px">
                <el-option label="工程管理部" value="工程管理部" />
                <el-option label="武汉项目部" value="武汉项目部" />
                <el-option label="华中分公司" value="华中分公司" />
                <el-option label="行政中心" value="行政中心" />
                <el-option label="新员工训练营" value="新员工训练营" />
              </el-select>
            </el-form-item>
            <el-form-item label="岗位">
              <el-select v-model="exportFilters.position" placeholder="选择岗位" clearable style="width: 160px">
                <el-option label="安管人员" value="安管人员" />
                <el-option label="一级建造师" value="一级建造师" />
                <el-option label="技术人员" value="技术人员" />
                <el-option label="项目管理" value="项目管理" />
                <el-option label="施工班组长" value="施工班组长" />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="element-filter-actions">
            <el-button type="primary" @click="onPreview">预览</el-button>
            <el-button type="success" @click="onExport">导出 Excel</el-button>
          </div>
        </div>

        <div class="element-table-wrap">
          <el-table :data="archiveList" class="element-table" border stripe height="100%">
            <el-table-column type="index" label="序号" width="64" />
            <el-table-column prop="name" label="姓名" min-width="100" />
            <el-table-column prop="requiredHours" label="应学课时" width="100" align="center" />
            <el-table-column prop="completedHours" label="已学课时" width="100" align="center" />
            <el-table-column label="完成状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.statusType" effect="light" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="examScore" label="考试成绩" width="100" align="center" />
            <el-table-column prop="certNo" label="证书编号" min-width="180" show-overflow-tooltip />
          </el-table>
        </div>

        <div class="element-pagination-row">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="archiveTotal"
            :page-sizes="[10, 20, 50]"
          />
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const exportFilters = reactive({
  year: '2026',
  department: '',
  position: '',
})

const archiveList = ref([
  { name: '张明', requiredHours: 12, completedHours: 12, status: '已完成', statusType: 'success', examScore: 86, certNo: 'HBHC-2026-001234' },
  { name: '李华', requiredHours: 60, completedHours: 48, status: '进行中', statusType: 'warning', examScore: 72, certNo: '-' },
  { name: '王芳', requiredHours: 12, completedHours: 12, status: '已完成', statusType: 'success', examScore: 91, certNo: 'HBHC-2026-001235' },
  { name: '刘强', requiredHours: 30, completedHours: 30, status: '已完成', statusType: 'success', examScore: 78, certNo: 'HBHC-2026-001236' },
  { name: '陈静', requiredHours: 60, completedHours: 36, status: '进行中', statusType: 'warning', examScore: 65, certNo: '-' },
  { name: '赵磊', requiredHours: 12, completedHours: 12, status: '已完成', statusType: 'success', examScore: 88, certNo: 'HBHC-2026-001237' },
  { name: '周凯', requiredHours: 60, completedHours: 60, status: '已完成', statusType: 'success', examScore: 82, certNo: 'HBHC-2026-001238' },
  { name: '吴敏', requiredHours: 30, completedHours: 18, status: '进行中', statusType: 'warning', examScore: '-', certNo: '-' },
])

const archiveTotal = 2486
const currentPage = ref(1)
const pageSize = ref(10)

function onPreview() {
  // 预览即当前表格；实际可调接口刷新 archiveList
}

function onExport() {
  // 实际对接导出接口，按 exportFilters 导出 Excel
  console.log('导出条件:', exportFilters)
}
</script>
