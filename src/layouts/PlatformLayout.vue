<template>
  <div class="platform-shell" :class="{ collapsed: sidebarCollapsed }">
    <aside class="shell-sidebar">
      <div class="brand">
        <img class="brand-logo" :src="haochuanLogo" alt="湖北浩川水利水电工程有限公司" />
        <div v-if="!sidebarCollapsed">
          <p class="brand-name">湖北浩川水利水电工程有限公司</p>
          <p class="brand-subtitle">内部培训学习平台</p>
        </div>
      </div>

      <nav class="shell-nav">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.routeName"
          class="shell-nav-item"
          :to="{ name: item.routeName }"
          :title="item.name"
        >
          <span class="shell-nav-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <section v-if="!sidebarCollapsed" class="shell-side-card">
        <p class="shell-kicker">平台概况</p>
        <h3>2026 年水利水电培训任务</h3>
        <div class="shell-ring">
          <div>
            <strong>78%</strong>
            <span>年度完成</span>
          </div>
        </div>
        <p class="shell-note">已完成 4,862 学时，覆盖施工、安全、质量、技术与项目管理岗位，移动端学习占比 38%。</p>
      </section>
    </aside>

    <div class="shell-main">
      <div class="shell-tabbar">
        <button class="shell-tabbar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '☰' : '☷' }}
        </button>

        <RouterLink
          v-for="tab in visibleNavItems"
          :key="tab.routeName"
          class="shell-tab"
          :class="{ active: route.name === tab.routeName }"
          :to="{ name: tab.routeName }"
        >
          <span>{{ tab.name }}</span>
        </RouterLink>

        <div class="shell-tabbar-user">
          <span class="shell-user-avatar">周</span>
          <div class="shell-user-meta">
            <strong>周凯</strong>
            <span>一级建造师</span>
          </div>
        </div>
      </div>

      <div class="shell-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useRoleMenus } from '@/composables/useRoleMenus'
import haochuanLogo from '@/assets/brand/haochuan-logo.png'

const route = useRoute()
const sidebarCollapsed = ref(false)

// 当前登录用户（演示用，实际从登录态或接口获取）
const currentUserRole = ref('系统管理员')
const currentUserIdNo = ref(null) // 若有值则优先用该用户授权里勾选的菜单
const { getVisibleNavItems } = useRoleMenus()
const visibleNavItems = computed(() => getVisibleNavItems(currentUserRole.value, currentUserIdNo.value))
</script>
