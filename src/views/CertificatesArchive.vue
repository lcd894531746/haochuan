<template>
  <section class="page-grid two-col">
    <article class="surface-card">
      <div class="section-head">
        <div>
          <p class="section-kicker">电子证书</p>
          <h2>证书发放与防伪编码</h2>
        </div>
        <button class="mini-button">下载 PDF</button>
      </div>
      <ul class="certificate-list-page">
        <li v-for="item in certificates" :key="item.code">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.owner }}</p>
            <small>{{ item.meta }}</small>
          </div>
          <span>{{ item.code }}</span>
        </li>
      </ul>
    </article>

    <article class="stack">
      <div class="surface-card">
        <div class="section-head">
          <div>
            <p class="section-kicker">培训档案</p>
            <h2>个人培训记录</h2>
          </div>
        </div>
        <div class="archive-list">
          <div v-for="item in archives" :key="item.name" class="archive-item">
            <strong>{{ item.name }}</strong>
            <p>{{ item.meta }}</p>
          </div>
        </div>
      </div>

      <div class="surface-card">
        <div class="section-head">
          <div>
            <p class="section-kicker">导出能力</p>
            <h2>档案与汇总表</h2>
          </div>
        </div>
        <div class="feature-list">
          <div v-for="item in exports" :key="item.title" class="feature-item">
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
const certificates = [
  { name: '安全生产管理培训结业证明', owner: '王雪峰 | 成绩 90 分', meta: '培训内容：安全管理专项 / 学时 30', code: 'CERT-2026-0312' },
  { name: '一级建造师继续教育证明', owner: '周凯 | 成绩 88 分', meta: '培训内容：年度继续教育 / 学时 60', code: 'CERT-2026-0287' },
  { name: '新员工入职培训合格证', owner: '陈思雨 | 成绩 95 分', meta: '培训内容：新员工训练营 / 学时 10', code: 'CERT-2026-0173' },
]

const archives = [
  { name: '张志鹏', meta: '已学 42/60 学时，证书 2 张，最近考试 84 分。' },
  { name: '李晨曦', meta: '已学 21/30 学时，待参加技术岗位考试。' },
  { name: '王雪', meta: '已学 5/5 学时，行政岗年度培训已完成。' },
]

const exports = [
  { title: '参训信息汇总表', desc: '按年度、部门、岗位导出 Excel，用于上报与存档。' },
  { title: '个人培训档案', desc: '汇总学时、课程、考试成绩和证书编号。' },
  { title: '历年对比报表', desc: '支持跨年度对比培训完成率与发证情况。' },
]
</script>
