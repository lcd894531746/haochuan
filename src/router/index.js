import { createRouter, createWebHashHistory } from 'vue-router'
import PlatformLayout from '@/layouts/PlatformLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import UserPermissions from '@/views/UserPermissions.vue'
import TrainingPlans from '@/views/TrainingPlans.vue'
import CourseResources from '@/views/CourseResources.vue'
import LearningCenter from '@/views/LearningCenter.vue'
import ExamCenter from '@/views/ExamCenter.vue'
import ExamSession from '@/views/ExamSession.vue'
import CertificatesArchive from '@/views/CertificatesArchive.vue'
import AnalyticsCenter from '@/views/AnalyticsCenter.vue'
import SystemSettings from '@/views/SystemSettings.vue'
import PersonalCenter from '@/views/PersonalCenter.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录',
      description: '身份证号 + 密码登录，首次登录完善个人信息。',
    },
  },
  {
    path: '/home',
    component: PlatformLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: '培训学习平台首页',
          headerTitle: '首页总览',
          description: '围绕资料上传、在线学习、在线考试、发证与统计导出的业务闭环门户。',
        },
      },
      {
        path: 'users',
        name: 'users',
        component: UserPermissions,
        meta: {
          title: '用户与权限管理',
          headerTitle: '账号增删改查',
          description: '管理账号生命周期、部门结构和角色权限。',
        },
      },
      {
        path: 'plans',
        name: 'plans',
        component: TrainingPlans,
        meta: {
          title: '培训计划管理',
          headerTitle: '计划增删改查',
          description: '按年度规划课程包、岗位学时和发布通知。',
        },
      },
      {
        path: 'courses',
        name: 'courses',
        component: CourseResources,
        meta: {
          title: '课程资源管理',
          headerTitle: '课程管理',
          description: '集中管理课程、视频章节、学时和有效期。',
        },
      },
      {
        path: 'learning',
        name: 'learning',
        component: LearningCenter,
        meta: {
          title: '学习中心',
          headerTitle: '学习中心',
          description: '查看课程学习记录、学习进度与课程分类。',
        },
      },
      {
        path: 'exams',
        name: 'exams',
        component: ExamCenter,
        meta: {
          title: '在线考试系统',
          headerTitle: '在线考试',
          description: '题库、组卷、考试配置与考试记录的统一入口。',
        },
      },
      {
        path: 'exams/session',
        name: 'exam-session',
        component: ExamSession,
        meta: {
          title: '在线答题',
          headerTitle: '在线答题',
          description: '进行单选题考试并提交得分结果。',
        },
      },
      {
        path: 'certificates',
        name: 'certificates',
        component: CertificatesArchive,
        meta: {
          title: '证书与培训档案',
          headerTitle: '证书档案',
          description: '管理电子证书、培训档案、学时汇总和导出。',
        },
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: AnalyticsCenter,
        meta: {
          title: '数据统计分析',
          headerTitle: '统计分析',
          description: '查看趋势、排行和多维统计报表。',
        },
      },
      {
        path: 'settings',
        name: 'settings',
        component: SystemSettings,
        meta: {
          title: '系统配置',
          headerTitle: '系统配置',
          description: '负责系统运维、基础数据配置、课程分类、全局参数、证书模板和账号配置。',
        },
      },
      {
        path: 'profile',
        name: 'profile',
        component: PersonalCenter,
        meta: {
          title: '个人中心',
          headerTitle: '个人中心',
          description: '查看个人资料、学习档案、证书记录与账号安全设置。',
        },
      },
    ],
  },
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
