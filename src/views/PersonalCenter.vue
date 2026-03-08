<template>
  <section class="page-grid two-col">
    <article class="surface-card">
      <div class="section-head">
        <div>
          <p class="section-kicker">个人资料</p>
          <h2>账号信息与学习身份</h2>
        </div>
        <el-button type="primary">编辑资料</el-button>
      </div>

      <div class="card-grid compact">
        <div v-for="item in profileCards" :key="item.label" class="mini-panel">
          <p class="course-type">{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <p>{{ item.note }}</p>
        </div>
      </div>

      <el-table :data="learningArchive" border stripe class="element-table profile-table">
        <el-table-column prop="year" label="年度" width="100" />
        <el-table-column prop="hours" label="已学学时" width="120" />
        <el-table-column prop="exam" label="最近考试" min-width="180" />
        <el-table-column prop="certificate" label="证书编号" min-width="180" />
        <el-table-column prop="status" label="状态" width="100" />
      </el-table>
    </article>

    <article class="stack">
      <div class="surface-card side-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">安全设置</p>
            <h2>账号安全</h2>
          </div>
        </div>
        <div class="feature-list">
          <div v-for="item in securityItems" :key="item.title" class="feature-item">
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <div class="surface-card side-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">我的证书</p>
            <h2>电子证书记录</h2>
          </div>
        </div>
        <ul class="tree-list">
          <li v-for="item in certificates" :key="item.name">
            <strong>{{ item.name }}</strong>
            <span>{{ item.meta }}</span>
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>

<script setup>
const profileCards = [
  { label: '姓名', value: '周凯', note: '一级建造师 / 华中分公司' },
  { label: '身份证号', value: '4201********1128', note: '身份证号 + 密码登录' },
  { label: '证书编号', value: 'HB-YJ-2026-0198', note: '建造师 / 安管人员编号维护' },
  { label: '账号状态', value: '启用中', note: '首次登录资料已完善' },
]

const learningArchive = [
  { year: '2026', hours: '42/60', exam: '一级建造师继续教育测评 88分', certificate: 'CERT-2026-0287', status: '已发证' },
  { year: '2025', hours: '60/60', exam: '年度继续教育测评 91分', certificate: 'CERT-2025-0193', status: '已完成' },
]

const securityItems = [
  { title: '密码管理', desc: '支持重置密码、修改登录密码和首次登录校验。' },
  { title: '登录记录', desc: '查看最近登录设备、登录时间和异常登录提醒。' },
  { title: '单点登录限制', desc: '同一账号不允许多设备同时登录。' },
]

const certificates = [
  { name: '一级建造师继续教育证明', meta: 'CERT-2026-0287 / 88 分 / 60 学时' },
  { name: '安全管理培训结业证明', meta: 'CERT-2025-0211 / 90 分 / 12 学时' },
]
</script>
