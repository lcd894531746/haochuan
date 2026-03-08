<template>
  <section class="login-page">
    <div class="login-backdrop"></div>

    <div class="login-layout">
      <section class="login-hero">
        <div class="login-brand">
          <img class="login-brand-logo" :src="haochuanLogo" alt="湖北浩川水利水电工程有限公司" />
          <div>
            <p class="login-brand-name">湖北浩川水利水电工程有限公司</p>
            <p class="login-brand-subtitle">内部培训学习平台</p>
          </div>
        </div>

        <div class="login-hero-copy">
          <p class="section-kicker">水利水电企业内部培训平台</p>
          <h1>培训资料、在线学习、考试发证一体化</h1>
          <p>
            面向学员、教务管理员与系统管理员统一使用，覆盖课程上传、视频学习、在线考试、证书发放和培训档案统计。
          </p>
        </div>

        <div class="login-feature-grid">
          <div v-for="item in flow" :key="item.title" class="login-feature-card">
            <span>{{ item.step }}</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </div>

        <div class="login-summary">
          <div class="login-summary-item">
            <strong>128</strong>
            <span>课程资源</span>
          </div>
          <div class="login-summary-item">
            <strong>2,486</strong>
            <span>参训人数</span>
          </div>
          <div class="login-summary-item">
            <strong>92.4%</strong>
            <span>考试通过率</span>
          </div>
        </div>
      </section>

      <section class="login-panel">
        <div class="login-card">
          <div class="login-card-head">
            <p class="section-kicker">账号登录</p>
            <h2>身份证号 + 密码登录</h2>
            <p>首次登录后需完善姓名、部门、岗位及证书编号等信息。</p>
          </div>

          <el-form :model="form" label-position="top" class="login-form">
            <el-form-item label="身份证号">
              <el-input v-model="form.idNo" size="large" placeholder="请输入身份证号" />
            </el-form-item>
            <el-form-item label="登录密码">
              <el-input
                v-model="form.password"
                size="large"
                type="password"
                show-password
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-form>

          <div class="login-actions">
            <el-button type="primary" size="large" class="login-submit">登录系统</el-button>
            <RouterLink class="login-link" :to="{ name: 'dashboard' }">查看原型首页</RouterLink>
          </div>

          <div class="first-login-panel">
            <div class="first-login-head">
              <div>
                <p class="section-kicker">首次登录</p>
                <h3>需补充个人资料</h3>
              </div>
              <span class="first-login-badge">必填</span>
            </div>
            <div class="first-login-grid">
              <div v-for="item in firstLoginFields" :key="item" class="first-login-item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import haochuanLogo from '@/assets/brand/haochuan-logo.png'

const form = reactive({
  idNo: '',
  password: '',
})

const flow = [
  { step: '01', title: '培训资料上传', desc: '课程、视频、题库与证书模板统一维护。' },
  { step: '02', title: '在线视频学习', desc: '按培训计划完成课程学习并累计学时。' },
  { step: '03', title: '在线考试测评', desc: '支持单选、多选、判断题和自动判分。' },
  { step: '04', title: '合格自动发证', desc: '考试通过后自动生成电子证书并归档。' },
]

const firstLoginFields = [
  '姓名',
  '所属部门',
  '岗位',
  '证书编号（建造师 / 安管人员）',
  '联系方式',
]
</script>
