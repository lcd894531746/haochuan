# 内部培训学习平台

湖北浩川水利水电工程有限公司内部培训学习平台前端项目，基于 Vue 3 + Vite + Element Plus 构建，包含登录、培训计划、课程资源、在线学习、在线考试、证书档案、统计分析、系统配置和个人中心等页面。

## 技术栈

- Vue 3
- Vite
- Vue Router
- Element Plus
- ECharts / ECharts GL

## 功能模块

- 登录页：身份证号 + 密码登录入口
- 首页总览：展示培训进度、学时覆盖、平台数据概览
- 用户权限：账号、组织架构、角色权限管理
- 培训计划：年度培训计划与任务安排
- 课程管理：课程、视频、课件和分类管理
- 视频学习：学习进度、记录查看与课程学习入口
- 在线考试：题库、组卷、考试记录与在线答题
- 证书档案：培训证书、学时档案、导出管理
- 统计分析：培训、考试、学习相关统计报表
- 系统配置：基础数据、参数、模板和菜单配置
- 个人中心：个人资料、学习档案和证书记录

## 快速开始

```bash
npm install
npm run dev
```

默认开发地址以 Vite 输出为准，通常为 [http://localhost:5173](http://localhost:5173) 。

## 构建命令

```bash
npm run build
npm run preview
```

`npm run build` 会在生成 `dist` 后同步复制 `404.html`，便于静态部署。

## 项目结构

```text
haochuan/
├── doc/                     # 需求说明、功能说明书、报价单
├── src/
│   ├── layouts/             # 平台主布局
│   ├── views/               # 各业务页面
│   ├── router/              # 路由配置
│   ├── composables/         # 组合式逻辑
│   ├── data/                # 菜单和页面数据
│   ├── App.vue              # 根组件
│   ├── main.js              # 应用入口
│   └── style.css            # 全局样式
├── index.html
├── package.json
└── vite.config.js
```

## 文档目录

- [doc/培训平台功能说明书_v1.docx](/Users/xiaoadong/Desktop/WORK/haochuan/doc/培训平台功能说明书_v1.docx)
- [doc/培训平台报价单_v2.docx](/Users/xiaoadong/Desktop/WORK/haochuan/doc/培训平台报价单_v2.docx)
- [doc/内部培训平台需求-20260302.xlsx](/Users/xiaoadong/Desktop/WORK/haochuan/doc/内部培训平台需求-20260302.xlsx)

## 说明

- 当前仓库以前端原型/演示实现为主
- 路由使用 `hash` 模式
- 如需接入后端接口，可在现有页面基础上继续补充 API 调用与权限控制
