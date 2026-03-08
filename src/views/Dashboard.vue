<template>
  <section class="page-grid dashboard-page">
    <!-- 顶部：课程完成度折线图 -->
    <article class="surface-card dashboard-card">
      <div class="section-head">
        <h2>课程完成度趋势</h2>
      </div>
      <div class="stats-strip three dashboard-mini-strip">
        <div v-for="item in completionSummary" :key="item.label" class="mini-stat dashboard-mini-stat">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
          <p>{{ item.note }}</p>
        </div>
      </div>
      <div ref="chartRef" class="dashboard-chart"></div>
    </article>

    <!-- 下方：左侧人员学习情况 + 右侧学习通知 -->
    <div class="page-grid two-col">
      <article class="surface-card dashboard-card">
        <div class="section-head">
          <h2>人员学习情况</h2>
          <RouterLink :to="{ name: 'learning' }">进入视频学习</RouterLink>
        </div>
        <div class="dashboard-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>学员</th>
                <th>部门</th>
                <th>岗位</th>
                <th>进度</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="learner in learners" :key="learner.name">
                <td>{{ learner.name }}</td>
                <td>{{ learner.department }}</td>
                <td>{{ learner.role }}</td>
                <td>{{ learner.progress }}</td>
                <td><span class="tag" :class="learner.className">{{ learner.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="surface-card dashboard-card">
        <div class="section-head">
          <h2>视频学习与考试通知</h2>
          <a href="#">查看全部</a>
        </div>
        <div class="dashboard-list-wrap">
          <ul class="notice-list">
            <li v-for="notice in notices" :key="notice.title">
              <span class="tag" :class="notice.className">{{ notice.type }}</span>
              <div class="notice-body">
                <strong>{{ notice.title }}</strong>
                <p>{{ notice.summary }}</p>
                <div class="notice-meta">
                  <span>通知对象：{{ notice.audience }}</span>
                  <span>覆盖人数：{{ notice.count }}</span>
                  <span>发布人：{{ notice.author }}</span>
                  <span>{{ notice.time }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

// 所有重点课程完成度（示例数据，后端可按课程列表返回）
const courseCompletion = [
  { name: '水工建筑物施工安全专项课', value: 78 },
  { name: '水利工程项目管理实务', value: 84 },
  { name: '工程质量检测与验收规范', value: 92 },
  { name: '新员工入场与安全教育', value: 66 },
  { name: '年度必修：水利施工安全案例库', value: 58 },
]

const completionSummary = [
  { value: '128', label: '课程总数', note: '当前可用课程总量' },
  { value: '82%', label: '平均完成度', note: '所有课程的平均完成进度' },
  { value: '12 门', label: '未开始课程', note: '完成度低于 10% 的课程数' },
]

const learners = [
  { name: '张志鹏', department: '武汉项目部', role: '安全管理', progress: '100%', status: '已完成', className: 'green' },
  { name: '李晨曦', department: '工程管理部', role: '技术人员', progress: '72%', status: '进行中', className: 'orange' },
  { name: '王雪', department: '行政中心', role: '行政人员', progress: '0%', status: '未开始', className: 'slate' },
  { name: '周凯', department: '华中分公司', role: '一级建造师', progress: '93%', status: '待考试', className: 'blue' },
  { name: '刘明', department: '工程管理部', role: '安管人员', progress: '64%', status: '进行中', className: 'orange' },
  { name: '陈静', department: '质量检测中心', role: '质检工程师', progress: '86%', status: '已完成', className: 'green' },
  { name: '赵磊', department: '项目一部', role: '施工班组长', progress: '48%', status: '进行中', className: 'orange' },
  { name: '吴敏', department: '新员工训练营', role: '新员工', progress: '15%', status: '未开始', className: 'slate' },
  { name: '黄凯', department: '安全管理部', role: '专职安全员', progress: '78%', status: '进行中', className: 'orange' },
  { name: '邓超', department: '华南分公司', role: '项目经理', progress: '100%', status: '已完成', className: 'green' },
  { name: '周悦', department: '综合管理部', role: '人力专员', progress: '52%', status: '进行中', className: 'orange' },
  { name: '贺亮', department: '设备运维中心', role: '机电维护', progress: '8%', status: '未开始', className: 'slate' },
]

const notices = [
  {
    type: '培训通知',
    title: '2026 年度一级建造师继续教育计划已发布',
    summary: '已推送年度必修课程包与学习时长要求，完成后自动解锁年度测评。',
    audience: '一级建造师、项目经理',
    count: '328 人',
    author: '教务管理员',
    time: '03/06 09:30',
    className: 'blue',
  },
  {
    type: '考试通知',
    title: '安全管理岗位季度考试将于 03/12 开始',
    summary: '考试时长 45 分钟，完成季度必修课程 90% 后开放考试入口。',
    audience: '安管人员、施工班组长',
    count: '412 人',
    author: '培训中心',
    time: '03/05 17:00',
    className: 'orange',
  },
  {
    type: '学习通知',
    title: '新员工入场与安全教育课程需在本周内完成',
    summary: '请 2026 届新入职员工在 03/10 前完成视频学习并通过随堂测验。',
    audience: '新员工训练营',
    count: '334 人',
    author: '人力资源部',
    time: '03/05 09:10',
    className: 'green',
  },
  {
    type: '学习通知',
    title: '工程质量检测与验收规范课程开放补学',
    summary: '未完成学员可在 03/20 前补学，支持移动端随时学习。',
    audience: '质量检测中心、工程管理部',
    count: '204 人',
    author: '质量管理部',
    time: '03/04 16:45',
    className: 'blue',
  },
  {
    type: '考试通知',
    title: '年度必修课程结课测试将于 03/25 开放',
    summary: '测试共 60 题，及格分 60 分，支持单次补考。',
    audience: '全体在册学员',
    count: '2,486 人',
    author: '培训中心',
    time: '03/03 11:30',
    className: 'orange',
  },
  {
    type: '系统公告',
    title: '学习记录同步延迟说明',
    summary: '近期高峰期可能出现 1~2 分钟学习进度同步延迟，不影响最终统计结果。',
    audience: '全体学员',
    count: '2,486 人',
    author: '平台管理员',
    time: '03/02 18:05',
    className: 'slate',
  },
]

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption({
    grid: {
      left: 40,
      right: 24,
      top: 40,
      bottom: 40,
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const p = params[0]
        return `${p.axisValue}<br/>完成度：${p.data}%`
      },
    },
    xAxis: {
      type: 'category',
      data: courseCompletion.map((c) => c.name),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#9ab4c4' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(17,111,152,0.12)' } },
    },
    series: [
      {
        name: '课程完成度',
        type: 'line',
        smooth: true,
        data: courseCompletion.map((c) => c.value),
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#1c8ab0',
        },
        areaStyle: {
          color: 'rgba(28,138,176,0.18)',
        },
      },
    ],
  })
}

function resizeChart() {
  if (chart) {
    chart.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', resizeChart)
})
</script>
