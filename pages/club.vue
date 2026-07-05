<template>
  <BasePageShell>

      <!-- 課程卡片區域 -->
      <section class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <!-- 未登入時顯示標題 -->
          <div v-if="!isAuthenticated" class="space-y-1">
            <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
              你的俱樂部課程
            </BaseTypography>
            <BaseTypography variant="subtitle" tag="p" class="font-primary color-subtitle">
              根據你的學習狀態，這些課程最適合你唷！
            </BaseTypography>
          </div>
          <!-- 登入後顯示分類按鈕與語系下拉 -->
          <div v-else class="flex items-center gap-3 flex-shrink-0">
           <div class="w-[128px]">
              <div class="p-1">
                <BaseDropdown
                  v-model="selectedLanguage"
                  :options="languageOptions"
                  placeholder="全語系"
                  class="dropdown-pill"
                  height="50px"
                  fontSize="15px"
                  fontWeight="900"
                  borderRadius="16px"
                  menuBorderRadius="16px"
                />
              </div>
            </div>

            <div class="flex items-center gap-2 rounded-full p-1">
              <BaseButton
                v-for="tab in courseCategoryTabs"
                :key="tab.value"
                variant="outline"
                size="medium"
                class="!rounded-xl !px-5 !py-2.5 !border-transparent !shadow-lg !transition"
                :class="
                  selectedCourseCategory === tab.value
                    ? '!bg-brown-1 !text-cream'
                    : '!bg-transparent !text-brown-1 !bg-white/70 '
                "
                @click="selectedCourseCategory = tab.value"
              >
                {{ tab.label }}
              </BaseButton>
            </div>
          </div>
          <div class="flex gap-3 flex-shrink-0">
            <BaseButton 
              variant="outline" 
              size="large"
              class="!rounded-lg !pt-[9px] !pb-[9px] !bg-brown-1/50 !text-cream !border-transparent disabled:!bg-brown-9 disabled:!text-white/60 disabled:!cursor-not-allowed"
            >
              當月課表
            </BaseButton>
            <BaseButton 
              variant="outline" 
              size="large"
              class="!rounded-lg !pt-[9px] !pb-[9px] !bg-brown-1/50 !text-cream !border-transparent disabled:!bg-brown-9 disabled:!text-white/60 disabled:!cursor-not-allowed"
              :disabled="!isAuthenticated"
            >
              我的課表
            </BaseButton>
            <BaseButton 
              variant="outline" 
              size="large"
              class="!px-10 !rounded-lg !pt-[9px] !pb-[9px] !bg-primary-1 !text-cream !border-transparent disabled:!bg-brown-9 disabled:!text-white/60 disabled:!cursor-not-allowed"
              :disabled="!isAuthenticated"
            >
              俱樂部選課
            </BaseButton>
          </div>
        </div>
        <div class="overflow-x-auto py- px-2 course-scroll">
          <div class="flex min-w-min pb-6 pt-2">
            <div 
              v-for="course in courses"
              :key="course.id"
              class="flex-shrink-0 w-72"
            >
              <CourseCard
                :title="course.title"
                :status="course.status"
                :status-type="course.statusType"
                :tags="course.tags"
                :show-progress="course.showProgress"
                :progress="course.progress"
                :time-info="course.timeInfo"
                :image="course.image"
                :bookmarked="courseBookmarks[course.id]"
                :can-enter-course="course.canEnterCourse"
                :enter-button-text="course.enterButtonText"
                @toggle-bookmark="toggleCourseBookmark(course.id)"
                @view-detail="openClubCoursePopup(course)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 統計區域 -->
      <section class="grid gap-4 xl:grid-cols-7"> 
        <!-- 課程出席率 -->
        <div class="grid grid-rows-[auto_auto_1fr] gap-2 xl:col-span-3">
          <div class="space-y-1">
            <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
              課程出席率
            </BaseTypography>
            <BaseTypography variant="subtitle" tag="p" class="font-primary color-subtitle">
              依據老師排課及自行選課後，系統自動計算的結果
            </BaseTypography>
          </div>
          <BaseChart
            :percentage="81.25"
            title="出席狀況良好"
            hint="保持學習成果，持續進步！"
            :data="attendanceData"
            chartHeight="240px"
          />
        </div>

        <!-- 剩餘堂數 -->
        <div class="grid grid-rows-[auto_auto_1fr] gap-2 xl:col-span-2">
          <div class="space-y-1">
            <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
              剩餘堂數
            </BaseTypography>
            <BaseTypography variant="subtitle" tag="p" class="font-primary color-subtitle">
              不用再詢問，這邊就是你剩餘的堂數！
            </BaseTypography>
          </div>
          <div class="space-y-4">
            <ClassProgressCard
              title="日文入門班"
              :completed="16"
              :total="30"
              progressColor="#E8996D"
            />
            <ClassProgressCard
              title="英文多言解"
              :completed="29"
              :total="30"
              progressColor="#F2A74B"
            />
            <ClassProgressCard
              title="韓文基數"
              :completed="2"
              :total="12"
              progressColor="#4285F4"
            />
          </div>
        </div>
      </section>

      <ClubCoursePopup
        :model-value="isClubCoursePopupOpen"
        :course-id="activeCourse?.id"
        @update:model-value="(val) => { if (!val) closeClubCoursePopup(); else isClubCoursePopupOpen = true }"
      />
  </BasePageShell>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ClassProgressCard from '@/components/feature/ClassProgressCard.vue'
import ClubCoursePopup from '@/components/feature/ClubCoursePopup.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { token } = useAuth()
const isAuthenticated = computed(() => !!token.value)

interface Course {
  id: string
  title: string
  status: string
  statusType: 'ongoing' | 'today' | 'other'
  tags: string[]
  showProgress: boolean
  progress?: number
  timeInfo: string
  image?: string
  canEnterCourse: boolean
  enterButtonText?: string
}

type CourseCategory = 'recommend' | 'vocabulary-grammar' | 'exam' | 'speaking' | 'task'
type LanguageFilter = 'japanese' | 'english' | 'all'

interface CourseCategoryTab {
  label: string
  value: CourseCategory
}

interface LanguageOption {
  label: string
  value: LanguageFilter
}

const selectedCourseCategory = ref<CourseCategory>('recommend')
const selectedLanguage = ref<LanguageFilter>('all')
const isClubCoursePopupOpen = ref(false)
const activeCourse = ref<Course | null>(null)

onMounted(() => {
  const courseQueryId = route.query.course as string | undefined
  if (courseQueryId) {
    activeCourse.value = { id: courseQueryId } as Course
    isClubCoursePopupOpen.value = true
  }
})

const courseCategoryTabs: CourseCategoryTab[] = [
  { label: '推薦課程', value: 'recommend' },
  { label: '單字文法', value: 'vocabulary-grammar' },
  { label: '檢定測驗', value: 'exam' },
  { label: '口說發表', value: 'speaking' },
  { label: '學習任務', value: 'task' }
]

const languageOptions: LanguageOption[] = [
  { label: '全語系', value: 'all' },
  { label: '日文', value: 'japanese' },
  { label: '英文', value: 'english' }
]

// 課程數據
const courses = ref<Course[]>([
  {
    id: 'course1',
    title: 'N5綜合養成',
    status: '進行中',
    statusType: 'ongoing',
    tags: ['N5', '語彙', '聽解'],
    showProgress: true,
    progress: 50,
    timeInfo: '22:30 - 23:00',
    canEnterCourse: true
  },
  {
    id: 'course2',
    title: '日文口說養成',
    status: '今日',
    statusType: 'today',
    tags: ['N2', '主題', '聽解'],
    showProgress: true,
    progress: 0,
    timeInfo: '10:00 - 12:30',
    canEnterCourse: false
  },
  {
    id: 'course3',
    title: '日文主題班',
    status: '星期四',
    statusType: 'other',
    tags: ['N3', '文法', '閱讀'],
    showProgress: true,
    progress: 0,
    timeInfo: '10:00 - 12:30',
    canEnterCourse: false,
    enterButtonText: '提醒我'
  },
  {
    id: 'course4',
    title: 'N3文法養成',
    status: '11/4',
    statusType: 'other',
    tags: ['N3', '文法', '閱讀'],
    showProgress: true,
    progress: 0,
    timeInfo: '10:00 - 12:30',
    canEnterCourse: true
  },
  {
    id: 'course5',
    title: 'N2聽力突破',
    status: '進行中',
    statusType: 'ongoing',
    tags: ['N2', '聽解', '實戰'],
    showProgress: true,
    progress: 75,
    timeInfo: '19:00 - 20:30',
    canEnterCourse: true
  },
  {
    id: 'course6',
    title: '敬語與商務日文',
    status: '星期一',
    statusType: 'other',
    tags: ['N1', '敬語', '商務'],
    showProgress: true,
    progress: 0,
    timeInfo: '14:00 - 16:00',
    canEnterCourse: false,
    enterButtonText: '提醒我'
  },
  {
    id: 'course7',
    title: '日文漢字速成',
    status: '今日',
    statusType: 'today',
    tags: ['N4', '漢字', '基礎'],
    showProgress: true,
    progress: 0,
    timeInfo: '11:00 - 12:00',
    canEnterCourse: true
  },
  {
    id: 'course8',
    title: '日本文化與語言',
    status: '進行中',
    statusType: 'ongoing',
    tags: ['文化', '語言', '拓展'],
    showProgress: true,
    progress: 30,
    timeInfo: '20:00 - 21:00',
    canEnterCourse: true
  }
])

// 課程書籤狀態
const courseBookmarks = ref<Record<string, boolean>>({
  course1: true,
  course2: true,
  course3: false,
  course4: false
})

const toggleCourseBookmark = (courseId: string) => {
  courseBookmarks.value[courseId] = !courseBookmarks.value[courseId]
}

const openClubCoursePopup = (course: Course) => {
  activeCourse.value = course
  isClubCoursePopupOpen.value = true
  router.replace({ query: { ...route.query, course: course.id } })
}

const closeClubCoursePopup = () => {
  isClubCoursePopupOpen.value = false
  activeCourse.value = null
  const { course: _removed, ...restQuery } = route.query
  router.replace({ query: restQuery })
}

// 搜尋相關
const searchQuery = ref('')

const searchSuggestions = [
  {
    title: '日文課程推薦',
    url: '/courses/japanese',
    type: '課程',
    badge: '日文討論區',
    badgeColor: 'primary',
    selectable: true
  },
  {
    title: '商業日文會話',
    url: '/courses/business-jp',
    type: '課程',
    badge: '聚樂部',
    badgeColor: 'secondary',
    selectable: true
  },
  {
    title: '日文快閃文章參照',
    url: '/posts/jp-flash',
    type: '文章',
    badge: '學習任務',
    badgeColor: 'alert',
    selectable: true
  },
  {
    title: 'N5 學習任務清單',
    url: '/tasks/n5',
    type: '學習任務',
    badge: '任務',
    badgeColor: 'primary',
    selectable: true
  }
]

const handleSearchSelect = (suggestion: any) => {
  console.log('選擇了:', suggestion)
}

// 出席率圖表數據
const attendanceData = ref([
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 0, expected: 0 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 2, expected: 2 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 5, expected: 8 },
  { actual: 1, expected: 1 },
  { actual: 5, expected: 5 },
  { actual: 1, expected: 2 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 },
  { actual: 1, expected: 1 }
])
</script>

<style scoped>
.course-scroll::-webkit-scrollbar {
  height: 8px;
}

.course-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.course-scroll::-webkit-scrollbar-thumb {
  background-color: #EE7959;
  border-radius: 4px;
}

.course-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #D87E55;
}
</style>
