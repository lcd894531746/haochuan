<template>
  <section class="page-grid two-col user-permissions-page">
    <article class="surface-card element-card user-permissions-main">
      <div class="section-head">
        <h2 class="page-main-title with-icon">
          <span class="page-main-title-icon">▣</span>
          <span>用户权限管理</span>
        </h2>
        <div class="action-row">
          <el-button type="primary">新增账号</el-button>
          <el-button>导入 Excel</el-button>
        </div>
      </div>

      <div class="element-filter-form">
        <el-form :inline="true" :model="filters" class="element-filter-fields">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.idNo" placeholder="身份证号" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.department" placeholder="部门" clearable style="width: 140px">
              <el-option label="总部" value="总部" />
              <el-option label="工程管理部" value="工程管理部" />
              <el-option label="武汉项目部" value="武汉项目部" />
              <el-option label="华中分公司" value="华中分公司" />
              <el-option label="行政中心" value="行政中心" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.role" placeholder="角色" clearable style="width: 140px">
              <el-option v-for="r in roleOptions" :key="r" :label="r" :value="r" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="element-filter-actions">
          <el-button type="primary">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </div>

      <div class="element-table-wrap">
        <el-table :data="users" class="element-table" border stripe height="100%" @row-click="onRowClick">
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="name" label="姓名" min-width="100" />
          <el-table-column prop="idNo" label="身份证号" min-width="160" show-overflow-tooltip />
          <el-table-column prop="department" label="部门" min-width="120" />
          <el-table-column prop="position" label="岗位" width="100" />
          <el-table-column prop="role" label="角色" width="110" />
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="row.stateType" effect="light" size="small">{{ row.state }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right" align="center">
            <template #default="{ row }">
              <span class="op-buttons-wrap" @click.stop>
                <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                <el-button link type="danger" @click="onDelete(row)">删除</el-button>
                <el-button link type="primary" @click="openAuthorize(row)">授权</el-button>
                <el-button link type="warning" @click="onResetPassword(row)">重置密码</el-button>
              </span>
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

    <aside class="user-permissions-side detail-panel-wrap">
      <!-- 行数据详情（点击行时展示） -->
      <div v-if="panelMode === 'detail'" class="surface-card side-panel-mod detail-panel">
        <div class="detail-panel-head">
          <h3 class="side-panel-title">用户详情</h3>
          <el-button link type="info" @click="closePanel">关闭</el-button>
        </div>
        <div v-if="detailUser" class="detail-form">
          <div class="detail-readonly-item"><span class="detail-form-label">姓名</span><span>{{ detailUser.name }}</span></div>
          <div class="detail-readonly-item"><span class="detail-form-label">身份证号</span><span>{{ detailUser.idNo }}</span></div>
          <div class="detail-readonly-item"><span class="detail-form-label">部门</span><span>{{ detailUser.department }}</span></div>
          <div class="detail-readonly-item"><span class="detail-form-label">岗位</span><span>{{ detailUser.position }}</span></div>
          <div class="detail-readonly-item"><span class="detail-form-label">角色</span><span>{{ detailUser.role }}</span></div>
          <div class="detail-readonly-item"><span class="detail-form-label">状态</span><span><el-tag :type="detailUser.stateType" size="small">{{ detailUser.state }}</el-tag></span></div>
          <div class="detail-form-footer">
            <el-button @click="closePanel">关闭</el-button>
            <el-button type="primary" @click="openEditFromDetail">编辑</el-button>
          </div>
        </div>
      </div>

      <!-- 空状态：提示选择操作 -->
      <div v-else-if="panelMode === 'none'" class="surface-card side-panel-mod detail-panel detail-panel-empty">
        <p class="detail-panel-hint">在左侧表格选择操作：</p>
        <ul class="detail-panel-actions">
          <li><strong>编辑</strong> — 修改账号基本信息（姓名、部门、岗位、状态等）</li>
          <li><strong>授权</strong> — 为该账号分配角色，角色已与路由绑定，分配后即拥有对应菜单</li>
        </ul>
        <el-button type="primary" link class="detail-panel-link" @click="panelMode = 'roleMenuConfig'; selectedRoleForMenu = ''">
          配置各角色授权菜单
        </el-button>
        <p class="detail-panel-tip">教学视频等任务下发时，勾选角色即可推送给该角色下所有用户。</p>
      </div>

      <!-- 编辑账号 -->
      <div v-else-if="panelMode === 'edit'" class="surface-card side-panel-mod detail-panel">
        <div class="detail-panel-head">
          <h3 class="side-panel-title">编辑账号</h3>
          <el-button link type="info" @click="closePanel">关闭</el-button>
        </div>
        <el-form v-if="selectedUser" :model="editForm" label-width="80px" class="detail-form">
          <el-form-item label="姓名">
            <el-input v-model="editForm.name" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="editForm.idNo" />
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="editForm.department" placeholder="部门" style="width: 100%">
              <el-option label="总部" value="总部" />
              <el-option label="工程管理部" value="工程管理部" />
              <el-option label="武汉项目部" value="武汉项目部" />
              <el-option label="华中分公司" value="华中分公司" />
              <el-option label="行政中心" value="行政中心" />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位">
            <el-input v-model="editForm.position" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="editForm.role" placeholder="角色" style="width: 100%">
              <el-option v-for="r in roleOptions" :key="r" :label="r" :value="r" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="editForm.state" style="width: 100%">
              <el-option label="启用" value="启用" />
              <el-option label="禁用" value="禁用" />
            </el-select>
          </el-form-item>
          <div class="detail-form-footer">
            <el-button @click="closePanel">取消</el-button>
            <el-button type="primary" @click="saveEdit">保存</el-button>
          </div>
        </el-form>
      </div>

      <!-- 授权：直接勾选该用户授权菜单（不通过角色） -->
      <div v-else-if="panelMode === 'authorize'" class="surface-card side-panel-mod detail-panel">
        <div class="detail-panel-head">
          <h3 class="side-panel-title">授权</h3>
          <el-button link type="info" @click="closePanel">关闭</el-button>
        </div>
        <p class="detail-panel-desc">勾选该账号可见的菜单，保存后该用户侧栏与顶栏只显示已选菜单。</p>
        <div v-if="authorizeUser" class="detail-form">
          <el-form label-width="0">
            <el-form-item>
              <span class="detail-form-label">当前用户</span>
              <span>{{ authorizeUser.name }}</span>
              <span class="muted">（{{ authorizeUser.idNo }}）</span>
            </el-form-item>
            <el-form-item>
              <span class="detail-form-label">授权菜单</span>
            </el-form-item>
            <el-form-item>
              <el-checkbox-group v-model="authorizeMenuChecked" class="role-menu-checkgroup">
                <div v-for="item in navItems" :key="item.routeName" class="role-menu-checkitem">
                  <el-checkbox :label="item.routeName">{{ item.name }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div class="detail-form-footer">
            <el-button @click="closePanel">取消</el-button>
            <el-button type="primary" @click="saveAuthorize">保存</el-button>
          </div>
        </div>
      </div>

      <!-- 配置各角色授权菜单 -->
      <div v-else-if="panelMode === 'roleMenuConfig'" class="surface-card side-panel-mod detail-panel">
        <div class="detail-panel-head">
          <h3 class="side-panel-title">配置各角色授权菜单</h3>
          <el-button link type="info" @click="closePanel">关闭</el-button>
        </div>
        <p class="detail-panel-desc">勾选该角色可访问的菜单（对应路由），保存后该角色下的用户侧栏与顶栏只显示已选菜单。下发任务时勾选角色即可覆盖该角色下所有人。</p>
        <el-form label-width="0" class="detail-form">
          <el-form-item>
            <el-select v-model="selectedRoleForMenu" placeholder="选择要配置的角色" style="width: 100%; margin-bottom: 12px">
              <el-option v-for="r in roleOptions" :key="r" :label="r" :value="r" />
            </el-select>
          </el-form-item>
          <template v-if="selectedRoleForMenu">
            <el-checkbox-group v-model="roleMenuChecked" class="role-menu-checkgroup">
              <div v-for="item in navItems" :key="item.routeName" class="role-menu-checkitem">
                <el-checkbox :label="item.routeName">{{ item.name }}</el-checkbox>
              </div>
            </el-checkbox-group>
            <div class="detail-form-footer">
              <el-button type="primary" @click="saveRoleMenuConfig">保存</el-button>
            </div>
          </template>
        </el-form>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoleMenus } from '@/composables/useRoleMenus'

const { navItems, getMenusByRole, setRoleMenus, getUserMenus, setUserMenus } = useRoleMenus()

const roleOptions = ['系统管理员', '教务管理员', '普通学员']

const filters = reactive({
  name: '',
  idNo: '',
  department: '',
  role: '',
})

const users = ref([
  { name: '张晓娜', idNo: '420*****3421', department: '文书部', position: '安全管理', role: '教务管理员', state: '启用', stateType: 'success' },
  { name: '李斯琴', idNo: '420*****1987', department: '工程管理部', position: '技术人员', role: '普通学员', state: '启用', stateType: 'success' },
  { name: '王珊', idNo: '420*****9023', department: '行政中心', position: '行政人员', role: '普通学员', state: '禁用', stateType: 'danger' },
  { name: '常乐', idNo: '420*****1039', department: '华中分公司', position: '系统管理', role: '系统管理员', state: '启用', stateType: 'success' },
  { name: '周凯', idNo: '420*****1128', department: '武汉项目部', position: '一级建造师', role: '教务管理员', state: '启用', stateType: 'success' },
  { name: '刘明', idNo: '420*****2056', department: '工程管理部', position: '安管人员', role: '普通学员', state: '启用', stateType: 'success' },
])

const total = 2485
const currentPage = ref(1)
const pageSize = ref(10)

const panelMode = ref('none') // 'none' | 'detail' | 'edit' | 'authorize' | 'roleMenuConfig'
const selectedUser = ref(null)
const detailUser = ref(null)
const authorizeUser = ref(null)
const authorizeMenuChecked = ref([])
const selectedRoleForMenu = ref('')
const roleMenuChecked = ref([])

const editForm = reactive({
  name: '',
  idNo: '',
  department: '',
  position: '',
  role: '',
  state: '启用',
})

watch(selectedRoleForMenu, (role) => {
  if (role) roleMenuChecked.value = [...getMenusByRole(role)]
}, { immediate: true })

function onRowClick(row) {
  detailUser.value = row
  panelMode.value = 'detail'
}

function openEditFromDetail() {
  if (detailUser.value) openEdit(detailUser.value)
}

function onResetPassword(row) {
  ElMessage.success('密码重置成功')
}

function openEdit(row) {
  selectedUser.value = row
  Object.assign(editForm, {
    name: row.name,
    idNo: row.idNo,
    department: row.department,
    position: row.position,
    role: row.role,
    state: row.state,
  })
  panelMode.value = 'edit'
}

function saveEdit() {
  if (!selectedUser.value) return
  Object.assign(selectedUser.value, {
    name: editForm.name,
    idNo: editForm.idNo,
    department: editForm.department,
    position: editForm.position,
    role: editForm.role,
    state: editForm.state,
    stateType: editForm.state === '启用' ? 'success' : 'danger',
  })
  closePanel()
}

function openAuthorize(row) {
  authorizeUser.value = row
  const userMenus = getUserMenus(row.idNo)
  authorizeMenuChecked.value = userMenus.length > 0 ? [...userMenus] : [...getMenusByRole(row.role)]
  panelMode.value = 'authorize'
}

function saveAuthorize() {
  if (!authorizeUser.value) return
  setUserMenus(authorizeUser.value.idNo, authorizeMenuChecked.value)
  closePanel()
}

function saveRoleMenuConfig() {
  if (selectedRoleForMenu.value) {
    setRoleMenus(selectedRoleForMenu.value, roleMenuChecked.value)
  }
}

function onDelete(row) {
  const idx = users.value.findIndex((u) => u.name === row.name && u.idNo === row.idNo)
  if (idx !== -1) users.value.splice(idx, 1)
}

function closePanel() {
  panelMode.value = 'none'
  selectedUser.value = null
  detailUser.value = null
  authorizeUser.value = null
  selectedRoleForMenu.value = ''
}

function resetFilters() {
  filters.name = ''
  filters.idNo = ''
  filters.department = ''
  filters.role = ''
}
</script>
