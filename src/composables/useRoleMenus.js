import { reactive, computed, watch } from 'vue'
import { navItems } from '@/data/platform'

const STORAGE_KEY = 'dp_role_menus'
const USER_MENUS_KEY = 'dp_user_menus'

const allRouteNames = navItems.map((item) => item.routeName)

const defaultRoleMenus = {
  系统管理员: [...allRouteNames],
  教务管理员: ['dashboard', 'courses', 'learning', 'exams', 'certificates', 'analytics', 'plans', 'users', 'profile'],
  普通学员: ['dashboard', 'learning', 'exams', 'profile'],
}

function loadRoleMenus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...defaultRoleMenus, ...parsed }
    }
  } catch (_) {}
  return { ...defaultRoleMenus }
}

function saveRoleMenus(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (_) {}
}

function loadUserMenus() {
  try {
    const raw = localStorage.getItem(USER_MENUS_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (_) {}
  return {}
}

function saveUserMenus(data) {
  try {
    localStorage.setItem(USER_MENUS_KEY, JSON.stringify(data))
  } catch (_) {}
}

const roleMenusState = reactive(loadRoleMenus())
const userMenusState = reactive(loadUserMenus())

export function useRoleMenus() {
  const roleMenus = computed(() => ({ ...roleMenusState }))

  function setRoleMenus(role, routeNames) {
    if (role && Array.isArray(routeNames)) {
      roleMenusState[role] = routeNames
      saveRoleMenus(roleMenusState)
    }
  }

  function getMenusByRole(role) {
    if (!role) return []
    const list = roleMenusState[role]
    return Array.isArray(list) ? list : defaultRoleMenus[role] || []
  }

  /**
   * 获取某用户可见的菜单项（优先用该用户单独配置的菜单，否则用角色默认菜单）
   * @param {string} role - 用户角色
   * @param {string} [userKey] - 用户标识（如 idNo），用于查单独配置的菜单
   */
  function getVisibleNavItems(role, userKey) {
    let allowed = []
    if (userKey && userMenusState[userKey] && Array.isArray(userMenusState[userKey])) {
      allowed = userMenusState[userKey]
    } else {
      allowed = getMenusByRole(role)
    }
    const set = new Set(allowed)
    return navItems.filter((item) => set.has(item.routeName))
  }

  function getUserMenus(userKey) {
    if (!userKey) return []
    const list = userMenusState[userKey]
    return Array.isArray(list) ? list : []
  }

  function setUserMenus(userKey, routeNames) {
    if (!userKey) return
    if (Array.isArray(routeNames) && routeNames.length > 0) {
      userMenusState[userKey] = routeNames
    } else {
      delete userMenusState[userKey]
    }
    saveUserMenus(userMenusState)
  }

  /**
   * 按角色取用户列表（教学视频等任务下发时：勾选角色即可推送给该角色下所有人）
   * @param {string[]} roleNames - 角色名称数组，如 ['教务管理员', '普通学员']
   * @param {Array} userList - 用户列表，每项需含 role 字段；不传则需由调用方从接口获取后传入
   * @returns {Array} 属于这些角色的用户
   */
  function getUsersByRoles(roleNames, userList = []) {
    if (!Array.isArray(roleNames) || roleNames.length === 0) return []
    const set = new Set(roleNames)
    return userList.filter((u) => u && set.has(u.role))
  }

  return {
    navItems,
    allRouteNames,
    roleMenus,
    setRoleMenus,
    getMenusByRole,
    getVisibleNavItems,
    getUserMenus,
    setUserMenus,
    getUsersByRoles,
  }
}
