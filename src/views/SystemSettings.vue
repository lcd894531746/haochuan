<template>
  <section class="page-grid two-col">
    <article class="surface-card">
      <div class="section-head">
        <div>
          <p class="section-kicker">系统配置</p>
          <h2>基础参数增删改查</h2>
        </div>
        <div class="action-row">
          <button class="mini-button primary">新增配置</button>
          <button class="mini-button">保存配置</button>
        </div>
      </div>

      <div class="crud-filter-bar">
        <div class="crud-filter-item">配置项</div>
        <div class="crud-filter-item">配置类型</div>
        <div class="crud-filter-item">状态</div>
        <div class="crud-filter-item wide">参数说明关键字</div>
        <button class="crud-btn primary">查询</button>
        <button class="crud-btn">重置</button>
      </div>

      <div class="crud-table-wrap">
        <table class="data-table compact">
          <thead>
            <tr>
              <th>序号</th>
              <th>配置项</th>
              <th>当前值</th>
              <th>配置类型</th>
              <th>说明</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in params" :key="item.name">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.desc }}</td>
              <td><span class="tag" :class="item.stateClass">{{ item.state }}</span></td>
              <td>
                <div class="inline-actions">
                  <a href="#">编辑</a>
                  <a href="#">复制</a>
                  <a href="#">删除</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="crud-pagination">
        <span>共 18 条</span>
        <div class="crud-page-size">10条/页</div>
        <div class="crud-pages">
          <span class="active">1</span>
          <span>2</span>
        </div>
      </div>
    </article>

    <article class="stack">
      <div class="surface-card side-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">基础数据</p>
            <h2>部门、职位、课程分类</h2>
          </div>
        </div>
        <ul class="tree-list">
          <li v-for="item in baseData" :key="item.name">
            <strong>{{ item.name }}</strong>
            <span>{{ item.meta }}</span>
          </li>
        </ul>
      </div>

      <div class="surface-card side-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">模板管理</p>
            <h2>证书模板与账号规则</h2>
          </div>
        </div>
        <div class="feature-list">
          <div v-for="item in templates" :key="item.title" class="feature-item">
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
const params = [
  { name: '课程完成标准', value: '90%', type: '学习规则', desc: '视频观看达到 90% 视为课程完成。', state: '启用', stateClass: 'ok' },
  { name: '学时定义', value: '25-45 分钟 / 学时段', type: '学时规则', desc: '按视频章节时长累计学时。', state: '启用', stateClass: 'ok' },
  { name: '考试次数', value: '3 次', type: '考试规则', desc: '默认允许补考 3 次。', state: '启用', stateClass: 'ok' },
  { name: '证书编号规则', value: 'CERT-YYYY-XXXX', type: '证书规则', desc: '考试通过后自动生成唯一编码。', state: '启用', stateClass: 'ok' },
]

const baseData = [
  { name: '部门管理', meta: '总部、分公司、项目部多级维护，可新增/编辑/停用。' },
  { name: '职位管理', meta: '建造师、安管人员、技术人员、行政人员等岗位配置。' },
  { name: '课程分类', meta: '水利施工、安全管理、质量检测、项目管理、新员工。' },
]

const templates = [
  { title: '证书模板配置', desc: '配置结业证书抬头、内容字段、二维码与打印版式。' },
  { title: '账号管理规则', desc: '支持启用/禁用、重置密码、首次登录完善资料规则。' },
  { title: '系统日志与运维', desc: '保留登录日志、操作日志与导出记录。' },
]
</script>
