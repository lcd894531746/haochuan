<template>
  <section class="exam-paper-page" :class="[`theme-${activeTheme}`]" :style="fontScaleStyle">
    <header class="exam-paper-topbar">
      <div class="exam-paper-user">
        <div class="exam-paper-avatar">周</div>
        <div class="exam-paper-user-meta">
          <strong>姓名：周凯</strong>
          <span>手机号：199****2317</span>
        </div>
      </div>

      <div class="exam-paper-breadcrumb">题库 &gt; 在线考试 &gt; {{ exam.title }}</div>

      <div class="exam-paper-actions">
        <div class="exam-paper-timer">
          <span>答题耗时</span>
          <strong :class="{ warning: remainingSeconds <= 300 }">{{ formattedRemainingTime }}</strong>
        </div>
        <el-button type="warning" class="exam-paper-submit" @click="submitExam">交卷</el-button>
      </div>
    </header>

    <div class="exam-paper-body">
      <aside class="exam-paper-sidebar">
        <div
          v-for="group in questionGroups"
          :key="group.type"
          class="exam-paper-side-group"
        >
          <div class="exam-paper-side-head">
            <strong>{{ group.label }}</strong>
            <span>共 {{ group.items.length }} 题</span>
          </div>

          <div class="exam-paper-nav">
            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              class="exam-paper-nav-item"
              :class="{
                active: currentQuestionIndex === item.index,
                answered: isAnswered(item.question),
                marked: markedQuestions.includes(item.id),
              }"
              @click="currentQuestionIndex = item.index"
            >
              {{ item.index + 1 }}
            </button>
          </div>
        </div>

        <div class="exam-paper-note">
          <p>说明：</p>
          <p>1. 蓝底题号表示当前题目。</p>
          <p>2. 绿色题号表示已作答。</p>
          <p>3. 橙色边框表示已标记。</p>
          <p>4. 倒计时结束后系统自动交卷。</p>
        </div>
      </aside>

      <main class="exam-paper-main">
        <template v-if="!submitted">
          <div class="exam-paper-toolbar">
            <div class="exam-paper-toolbar-tab">试卷</div>
            <div class="exam-paper-toolbar-actions">
              <div class="exam-paper-toolbar-group">
                <span class="exam-paper-toolbar-label">切换风格</span>
                <button
                  v-for="theme in themes"
                  :key="theme.key"
                  type="button"
                  class="exam-paper-tool-btn"
                  :class="[`theme-chip-${theme.key}`, { active: activeTheme === theme.key }]"
                  @click="activeTheme = theme.key"
                >
                  {{ theme.label }}
                </button>
              </div>
              <div class="exam-paper-toolbar-group">
                <span class="exam-paper-toolbar-label">字体大小</span>
                <button
                  type="button"
                  class="exam-paper-tool-btn"
                  :disabled="fontStep === 0"
                  @click="changeFontStep(-1)"
                >
                  字体小
                </button>
                <button
                  type="button"
                  class="exam-paper-tool-btn"
                  :disabled="fontStep === fontScaleSteps.length - 1"
                  @click="changeFontStep(1)"
                >
                  字体大
                </button>
              </div>
              <span>{{ exam.duration }}</span>
              <span>合格线 {{ exam.passLine }}</span>
              <span>{{ questionTypeLabelMap[currentQuestion.type] }}</span>
            </div>
          </div>

          <div class="exam-paper-section-title">
            {{ sectionDescription }}
          </div>

          <article class="exam-paper-question">
            <div class="exam-paper-question-head">
              <strong>第 {{ currentQuestionIndex + 1 }} 题</strong>
              <el-tag size="small" type="primary" effect="plain">{{ currentQuestion.score }} 分</el-tag>
            </div>

            <div class="exam-paper-question-title">
              {{ currentQuestion.title }}
            </div>

            <div class="exam-paper-options">
              <template v-if="currentQuestion.type === 'single' || currentQuestion.type === 'judge'">
                <label
                  v-for="option in currentQuestion.options"
                  :key="option.key"
                  class="exam-paper-option"
                  :class="{ active: answers[currentQuestion.id] === option.key }"
                >
                  <input v-model="answers[currentQuestion.id]" type="radio" :value="option.key" />
                  <span class="option-key">{{ option.key }}</span>
                  <span>{{ option.label }}</span>
                </label>
              </template>

              <template v-else>
                <label
                  v-for="option in currentQuestion.options"
                  :key="option.key"
                  class="exam-paper-option"
                  :class="{ active: answers[currentQuestion.id].includes(option.key) }"
                >
                  <input
                    v-model="answers[currentQuestion.id]"
                    type="checkbox"
                    :value="option.key"
                  />
                  <span class="option-key">{{ option.key }}</span>
                  <span>{{ option.label }}</span>
                </label>
              </template>
            </div>
          </article>

          <footer class="exam-paper-footer">
            <label class="exam-paper-mark">
              <input v-model="markChecked" type="checkbox" @change="toggleMark(currentQuestion.id)" />
              <span>标记</span>
            </label>

            <div class="exam-paper-footer-center">
              <el-button :disabled="currentQuestionIndex === 0" @click="currentQuestionIndex -= 1">上一题</el-button>
              <strong>第{{ currentQuestionIndex + 1 }}题</strong>
              <template v-if="currentQuestion.type === 'single' || currentQuestion.type === 'judge'">
                <el-radio-group v-model="answers[currentQuestion.id]" size="small">
                  <el-radio-button
                    v-for="option in currentQuestion.options"
                    :key="option.key"
                    :label="option.key"
                    :value="option.key"
                  />
                </el-radio-group>
              </template>
              <template v-else>
                <el-checkbox-group v-model="answers[currentQuestion.id]" size="small">
                  <el-checkbox-button
                    v-for="option in currentQuestion.options"
                    :key="option.key"
                    :label="option.key"
                    :value="option.key"
                  />
                </el-checkbox-group>
              </template>
              <el-button
                type="primary"
                :disabled="currentQuestionIndex === exam.questions.length - 1"
                @click="currentQuestionIndex += 1"
              >
                下一题
              </el-button>
            </div>
          </footer>
        </template>

        <div v-else class="exam-paper-result">
          <div class="exam-paper-result-score">
            <strong>{{ score }} 分</strong>
            <span>{{ passed ? '考试通过' : '考试未通过' }}</span>
          </div>

          <div class="exam-paper-result-grid">
            <div class="exam-paper-result-item">
              <span>正确题数</span>
              <strong>{{ correctCount }}/{{ exam.questions.length }}</strong>
            </div>
            <div class="exam-paper-result-item">
              <span>合格线</span>
              <strong>{{ exam.passLine }}</strong>
            </div>
            <div class="exam-paper-result-item">
              <span>考试用时</span>
              <strong>{{ formattedUsedTime }}</strong>
            </div>
          </div>

          <div v-if="passed" class="exam-paper-certificate">
            <strong>证书已生成</strong>
            <p>安全管理培训结业证明</p>
            <span>CERT-2026-0312</span>
          </div>

          <div class="exam-paper-result-actions">
            <el-button @click="router.push({ name: 'exams' })">返回考试列表</el-button>
            <el-button v-if="passed" type="primary">查看证书</el-button>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const exam = {
  title: '安全管理岗位季度考试',
  duration: '考试时长 20 分钟',
  passLine: '60 分',
  questions: [
    {
      id: 'q1',
      type: 'single',
      title: '水利施工现场开展班前安全活动的主要目的是什么？',
      score: 10,
      answer: 'B',
      options: [
        { key: 'A', label: '增加施工时间' },
        { key: 'B', label: '识别风险并明确安全措施' },
        { key: 'C', label: '减少管理人员巡查' },
        { key: 'D', label: '简化交底程序' },
      ],
    },
    {
      id: 'q2',
      type: 'single',
      title: '围堰施工时，以下哪项属于重点监测内容？',
      score: 10,
      answer: 'C',
      options: [
        { key: 'A', label: '办公区绿化情况' },
        { key: 'B', label: '食堂卫生情况' },
        { key: 'C', label: '渗流、变形和稳定状态' },
        { key: 'D', label: '材料仓库照明亮度' },
      ],
    },
    {
      id: 'q3',
      type: 'multi',
      title: '关于水利施工现场高处作业管理，下列哪些说法正确？',
      score: 10,
      answer: ['A', 'B', 'D'],
      options: [
        { key: 'A', label: '作业人员应正确佩戴安全带' },
        { key: 'B', label: '临边洞口应设置防护栏杆' },
        { key: 'C', label: '可以抛掷工具和材料' },
        { key: 'D', label: '恶劣天气应停止露天高处作业' },
      ],
    },
    {
      id: 'q4',
      type: 'multi',
      title: '施工现场临时用电管理中，哪些属于规范要求？',
      score: 10,
      answer: ['A', 'C'],
      options: [
        { key: 'A', label: '实行三级配电、二级保护' },
        { key: 'B', label: '所有人员均可私自接电' },
        { key: 'C', label: '配电箱应做到一机一闸一漏一箱' },
        { key: 'D', label: '漏电保护器失效后可继续使用' },
      ],
    },
    {
      id: 'q5',
      type: 'judge',
      title: '新入场人员未经三级安全教育，也可以先上岗后补培训。',
      score: 10,
      answer: 'B',
      options: [
        { key: 'A', label: '正确' },
        { key: 'B', label: '错误' },
      ],
    },
    {
      id: 'q6',
      type: 'judge',
      title: '发生安全事故后，应立即报告并启动应急处置流程。',
      score: 10,
      answer: 'A',
      options: [
        { key: 'A', label: '正确' },
        { key: 'B', label: '错误' },
      ],
    },
    {
      id: 'q7',
      type: 'single',
      title: '高边坡施工作业前，首先应完成哪项工作？',
      score: 10,
      answer: 'A',
      options: [
        { key: 'A', label: '专项安全技术交底' },
        { key: 'B', label: '直接安排机械进场' },
        { key: 'C', label: '减少现场巡视' },
        { key: 'D', label: '取消个人防护检查' },
      ],
    },
    {
      id: 'q8',
      type: 'single',
      title: '施工现场临时用电应遵循哪一原则？',
      score: 10,
      answer: 'D',
      options: [
        { key: 'A', label: '随接随用，不必检查' },
        { key: 'B', label: '由班组自行接线' },
        { key: 'C', label: '优先满足进度需要' },
        { key: 'D', label: '三级配电、二级保护' },
      ],
    },
    {
      id: 'q9',
      type: 'single',
      title: '发生安全事故后，第一时间应做什么？',
      score: 10,
      answer: 'B',
      options: [
        { key: 'A', label: '隐瞒情况继续施工' },
        { key: 'B', label: '立即报告并组织应急处置' },
        { key: 'C', label: '删除监控记录' },
        { key: 'D', label: '等待领导到场再处理' },
      ],
    },
  ],
}

const answers = reactive({
  q1: '',
  q2: '',
  q3: [],
  q4: [],
  q5: '',
  q6: '',
  q7: '',
  q8: '',
  q9: '',
})

const currentQuestionIndex = ref(0)
const submitted = ref(false)
const markedQuestions = ref([])
const markChecked = ref(false)
const activeTheme = ref('three')
const fontStep = ref(1)
const totalSeconds = 20 * 60
const remainingSeconds = ref(totalSeconds)
let timerId = null

const themes = [
  { key: 'one', label: '风格一' },
  { key: 'two', label: '风格二' },
  { key: 'three', label: '风格三' },
  { key: 'four', label: '风格四' },
  { key: 'five', label: '风格五' },
]

const fontScaleSteps = [
  { question: '16px', option: '14px' },
  { question: '18px', option: '16px' },
  { question: '20px', option: '18px' },
  { question: '22px', option: '20px' },
]

const currentQuestion = computed(() => exam.questions[currentQuestionIndex.value])
const fontScaleStyle = computed(() => ({
  '--exam-question-size': fontScaleSteps[fontStep.value].question,
  '--exam-option-size': fontScaleSteps[fontStep.value].option,
}))

const questionTypeLabelMap = {
  single: '单项选择题',
  multi: '多项选择题',
  judge: '判断题',
}

const questionGroupLabelMap = {
  single: '一、单项选择题',
  multi: '二、多项选择题',
  judge: '三、判断题',
}

const questionGroups = computed(() =>
  Object.entries(questionGroupLabelMap)
    .map(([type, label]) => ({
      type,
      label,
      items: exam.questions
        .map((question, index) => ({ ...question, index }))
        .filter((item) => item.type === type)
        .map((item) => ({
          id: item.id,
          index: item.index,
          question: item,
        })),
    }))
    .filter((group) => group.items.length),
)

const sectionDescription = computed(() => {
  if (currentQuestion.value.type === 'single') {
    return '单项选择题。每题所设选项中只有一个正确答案，多选、错选或不选均不得分。'
  }

  if (currentQuestion.value.type === 'multi') {
    return '多项选择题。每题有两个或两个以上正确答案，少选、多选、错选或不选均不得分。'
  }

  return '判断题。请根据题意判断正误，选对得分，选错或不选不得分。'
})

const isAnswered = (question) => {
  const value = answers[question.id]
  if (Array.isArray(value)) return value.length > 0
  return !!value
}

const correctCount = computed(() =>
  exam.questions.filter((item) => {
    const value = answers[item.id]

    if (Array.isArray(item.answer)) {
      return (
        Array.isArray(value) &&
        value.length === item.answer.length &&
        [...value].sort().join(',') === [...item.answer].sort().join(',')
      )
    }

    return value === item.answer
  }).length,
)

const score = computed(() => correctCount.value * 10)
const passed = computed(() => score.value >= 60)
const usedSeconds = computed(() => totalSeconds - remainingSeconds.value)

const formatSeconds = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const formattedRemainingTime = computed(() => formatSeconds(remainingSeconds.value))
const formattedUsedTime = computed(() => formatSeconds(usedSeconds.value))

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

const submitExam = () => {
  if (submitted.value) return
  stopTimer()
  submitted.value = true
}

const toggleMark = (questionId) => {
  if (markChecked.value) {
    if (!markedQuestions.value.includes(questionId)) {
      markedQuestions.value.push(questionId)
    }
    return
  }

  markedQuestions.value = markedQuestions.value.filter((item) => item !== questionId)
}

const changeFontStep = (offset) => {
  const next = fontStep.value + offset
  if (next < 0 || next >= fontScaleSteps.length) return
  fontStep.value = next
}

watch(currentQuestionIndex, () => {
  markChecked.value = markedQuestions.value.includes(currentQuestion.value.id)
})

onMounted(() => {
  markChecked.value = markedQuestions.value.includes(currentQuestion.value.id)

  timerId = setInterval(() => {
    if (submitted.value) {
      stopTimer()
      return
    }

    if (remainingSeconds.value <= 1) {
      remainingSeconds.value = 0
      submitExam()
      return
    }

    remainingSeconds.value -= 1
  }, 1000)
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>
