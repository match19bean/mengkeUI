<template>
  <Transition name="fade">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-[#F8F7F0] rounded-3xl shadow-popup w-full max-w-[40vw] mx-4 relative">
        <!-- 關閉按鈕 -->
        <button 
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-brown-9 text-brown-3 cursor-pointer transition z-10" 
          @click="closePopup"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Logo 和步驟指示器 -->
        <div class="pt-8 pb-6 px-8">
          <div class="flex justify-center mb-8 mt-4">
            <img src="/images/logo.png" alt="反轉外語" class="h-12 object-contain">
          </div>
          
          <!-- 步驟指示器 -->
          <div class="flex items-start justify-center gap-12">
            <div 
              v-for="step in 3" 
              :key="step"
              class="flex flex-col items-center gap-4"
            >
              <div class="h-6 flex items-center justify-center">
                <div 
                  class="rounded-full transition-all"
                  :class="currentStep === step ? 'w-6 h-6 bg-primary-1' : currentStep > step ? 'w-[10px] h-[10px] bg-primary-1' : 'w-[10px] h-[10px] bg-[#3620101A] border border-[#36201080]'"
                >
                </div>
              </div>
              <span 
                class="text-xs font-genyogothic font-black whitespace-nowrap transition-colors tracking-widest"
                :class="currentStep === step ? 'text-primary-1' : currentStep > step ? 'text-[#36201080]' : 'text-[#362010E5]'"
              >
                {{ stepTitles[step - 1] }}
              </span>
            </div>
          </div>
        </div>

        <!-- 漸淡分隔線 -->
        <div class="h-[1px] mx-8 mb-2 opacity-50" style="background: linear-gradient(to right, #501C1C00, #432C2C 50%, #501C1C00);"></div>

        <!-- 表單內容 -->
        <div class="px-8 py-6 max-h-[70vh] overflow-y-auto">
          <form @submit.prevent="handleNext">
            <!-- 步驟 1: 個人資訊 -->
            <div v-if="currentStep === 1" class="space-y-4">
              <!-- 帳號資訊標題 -->
              <h3 class="text-base font-genyogothic font-black text-[#36201080] mb-3 leading-4 tracking-[2px]">帳號資訊</h3>
              
              <div>
                <BaseInput
                  v-model="form.account"
                  type="text"
                  placeholder="暱稱"
                  text-size="text-xs"
                  :error="hasError('account')"
                  :error-message="getError('account')"
                />
                <p class="text-[10px] font-genyogothic font-black text-[#36201080] mt-1 ml-4 tracking-[2px]">
                  *與其他學習者互動時呈現的名稱，不可更改，請謹慎取名，避免違反善良風俗。
                </p>
              </div>
              

              <div>
                <BaseInput
                  v-model="form.nickname"
                  type="text"
                  placeholder="使用者帳號"
                  text-size="text-xs"
                  :error="hasError('nickname')"
                  :error-message="getError('nickname')"
                />
                <p class="text-[10px] font-genyogothic font-black text-[#36201080] mt-1 ml-4 tracking-[2px]">
                  *登入帳號。
                </p>
              </div>

              <div>
                <BaseInput
                  v-model="form.email"
                  type="email"
                  placeholder="電子郵件"
                  text-size="text-xs"
                  :error="hasError('email')"
                  :error-message="getError('email')"
                  :disabled="emailVerification.codeSent.value"
                  @blur="validateEmail"
                />
              </div>

              <VerificationInput
                v-model="emailVerification.code.value"
                placeholder="電子郵件驗證碼"
                :countdown="emailVerification.countdown.value"
                :is-counting-down="emailVerification.isCountingDown.value"
                :code-sent="emailVerification.codeSent.value"
                :verified="emailVerification.verified.value"
                :error-message="emailVerifyError"
                @send="sendEmailCode"
                @verify="verifyEmailCode"
              />

              <div>
                <BaseInput
                  v-model="form.password"
                  type="password"
                  placeholder="登入密碼"
                  text-size="text-xs"
                  :error="hasError('password')"
                  :error-message="getError('password')"
                  @blur="validatePassword"
                />
                <p class="text-[10px] font-genyogothic font-black text-[#36201080] mt-1 ml-4 tracking-[2px]">
                  *密碼需同時包含「大寫字母」、「小寫字母」、及「特殊符號」，限制8-20字元。
                </p>
              </div>

              <div class="flex gap-3 items-center">
                <div class="w-[248px]">
                  <BaseInput
                    v-model="form.confirmPassword"
                    type="password"
                    placeholder="確認密碼"
                    text-size="text-xs"
                    :error="!!confirmPasswordError"
                    @blur="validateConfirmPassword"
                  />
                </div>
                <div v-if="confirmPasswordError" class="flex items-center h-[32px]">
                  <span class="text-xs text-alert-1 font-medium">{{ confirmPasswordError }}</span>
                </div>
              </div>

              <!-- 漸淡分隔線 -->
              <div class="py-5">
                <div class="h-[1px] mx-8 opacity-50" style="background: linear-gradient(to right, #501C1C00, #432C2C 50%, #501C1C00);"></div>
              </div>

              <!-- 個人資訊標題 -->
              <h3 class="text-base font-genyogothic font-black text-[#36201080] mb-4 leading-4 tracking-[2px]">個人資訊</h3>

             
              <div class="w-[120px]">
                <BaseInput
                    v-model="form.lastName"
                    type="text"
                    placeholder="姓"
                    text-size="text-xs"
                    :error="hasError('lastName')"
                    :error-message="getError('lastName')"
                />
              </div>
              <div class="w-[120px]">
                <BaseInput
                    v-model="form.firstName"
                    type="text"
                    placeholder="名"
                    text-size="text-xs"
                    :error="hasError('firstName')"
                    :error-message="getError('firstName')"
                />
              </div>

              <div class="w-[120px]">
                <BaseDropdown
                  v-model="form.gender"
                  :options="[
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' },
                    { label: '其他', value: 'other' }
                  ]"
                  placeholder="生理性別"
                  :error="hasError('gender')"
                />
              </div>

              <div class="w-[240px]">
                <BaseDatePicker
                  v-model="form.birthDate"
                  placeholder="出生年月日"
                  :error="hasError('birthDate')"
                />
              </div>

              <div class="w-[120px]">
                <BaseDropdown
                  v-model="form.occupation"
                  :options="[
                    { label: '學生', value: 'student' },
                    { label: '上班族', value: 'office' },
                    { label: '自由業', value: 'freelance' },
                    { label: '其他', value: 'other' }
                  ]"
                  placeholder="職業別"
                  :error="hasError('occupation')"
                />
              </div>

              <!-- 漸淡分隔線 -->
              <div class="py-5">
                <div class="h-[1px] mx-8 opacity-50" style="background: linear-gradient(to right, #501C1C00, #432C2C 50%, #501C1C00);"></div>
              </div>

              <!-- 聯絡資訊標題 -->
              <h3 class="text-base font-genyogothic font-black text-[#36201080] mb-4 leading-4 tracking-[2px]">聯絡資訊</h3>

              <div class="flex gap-3 justify-start">
                <div class="w-[120px]">
                  <BaseDropdown
                    v-model="selectedCounty"
                    :options="countyOptions.map(name => ({ label: name, value: name }))"
                    placeholder="居住縣市"
                    :error="hasError('county')"
                  />
                </div>
                <div class="w-[120px]">
                  <BaseDropdown
                    v-model="selectedDistrict"
                    :options="districtOptions.map(name => ({ label: name, value: name }))"
                    placeholder="居住地區"
                    :disabled="!selectedCounty"
                  />
                </div>
              </div>

              <div>
                <BaseInput
                  v-model="form.address"
                  type="text"
                  placeholder="地址"
                  text-size="text-xs"
                  :error="hasError('address')"
                />
              </div>            

              <div class="w-[248px]">
                <BaseInput
                  v-model="form.emergencyContact"
                  type="tel"
                  placeholder="手機號碼 Ex: 0912345678"
                  text-size="text-xs"
                  :error="hasError('emergencyContact')"
                  :disabled="phoneVerification.codeSent.value"
                  @blur="validatePhone"
                />
              </div>

              <VerificationInput
                v-model="phoneVerification.code.value"
                placeholder="手機號碼驗證"
                :countdown="phoneVerification.countdown.value"
                :is-counting-down="phoneVerification.isCountingDown.value"
                :code-sent="phoneVerification.codeSent.value"
                :verified="phoneVerification.verified.value"
                :error-message="phoneVerifyError"
                @send="sendPhoneCode"
                @verify="verifyPhoneCode"
              />

              <div class="w-[164px]">
                <BaseDropdown
                  v-model="form.relationship"
                  :options="[
                    { label: '親友', value: 'parent' },
                    { label: 'FB', value: 'spouse' },
                    { label: '網路搜尋', value: 'friend' }
                  ]"
                  placeholder="從哪裡知道我們"
                  :multiple="true"
                  :error="hasError('relationship')"
                />
              </div>
            </div>

            <!-- 步驟 2: 學習資訊 -->
            <div v-if="currentStep === 2" class="space-y-4">
              <!-- 學習資訊標題 -->
              <h3 class="text-base font-genyogothic font-black text-[#36201080] mb-4 leading-4 tracking-[2px]">學習資訊</h3>

              <div class="w-[200px]">
                <BaseDropdown
                  v-model="form.language"
                  :options="[
                    { label: '英文', value: 'english' },
                    { label: '日文', value: 'japanese' },
                    { label: '韓文', value: 'korean' },
                    { label: '西班牙文', value: 'spanish' },
                    { label: '法文', value: 'french' }
                  ]"
                  placeholder="欲學習的語言別"
                  :error="hasError('language')"
                />
              </div>

              <div class="w-[200px]">
                <BaseDropdown
                  v-model="form.learningGoal"
                  :options="[
                    { label: '日常對話', value: 'daily' },
                    { label: '商務應用', value: 'business' },
                    { label: '考試證照', value: 'exam' },
                    { label: '興趣培養', value: 'hobby' }
                  ]"
                  placeholder="欲達到的目標"
                  :error="hasError('learningGoal')"
                />
              </div>

              <div class="w-[200px]">
                <BaseDropdown
                  v-model="form.learningPurpose"
                  :options="[
                    { label: '工作需求', value: 'work' },
                    { label: '升學考試', value: 'study' },
                    { label: '旅遊', value: 'travel' },
                    { label: '個人興趣', value: 'personal' }
                  ]"
                  placeholder="學習語言的目的"
                  :error="hasError('learningPurpose')"
                />
              </div>

              <div class="w-[200px]">
                <BaseDropdown
                  v-model="form.currentLevel"
                  :options="[
                    { label: '初級', value: 'beginner' },
                    { label: '中級', value: 'intermediate' },
                    { label: '高級', value: 'advanced' }
                  ]"
                  placeholder="目前的程度"
                  :error="hasError('currentLevel')"
                />
              </div>

              <!-- 過往學習標題 -->
              <h3 class="text-base font-genyogothic font-black text-[#36201080] mb-4 leading-4 tracking-[2px]">過往學習</h3>

              <div class="w-[200px]">
                <BaseDropdown
                  v-model="form.education"
                  :options="[
                    { label: '高中職', value: 'highschool' },
                    { label: '大學/專科', value: 'college' },
                    { label: '碩士', value: 'master' },
                    { label: '博士', value: 'phd' }
                  ]"
                  placeholder="最高學歷"
                />
              </div>

              <div class="flex gap-3">
                <div class="w-[200px]">
                  <BaseInput
                    v-model="form.school"
                    type="text"
                    placeholder="就讀學校"
                    text-size="text-xs"
                  />
                </div>
                <div class="w-[200px]">
                  <BaseInput
                    v-model="form.major"
                    type="text"
                    placeholder="就讀科系"
                    text-size="text-xs"
                  />
                </div>
              </div>              
            </div>

            <!-- 步驟 3: 確認註冊內容 -->
            <div v-if="currentStep === 3" class="space-y-4">
              <div class="font-genyogothic">
                <h3 class="text-base font-genyogothic font-black text-[#36201080] mb-8 leading-4 tracking-[2px]">帳號資訊</h3>
                <div class="text-sm text-[#36201080] space-y-1 font-primary font-medium">
                  <div>使用者暱稱：<span>{{ form.account }}</span></div>
                  <div class="flex items-center gap-2">
                    登入密碼：
                    <span>{{ showPassword ? form.password : '●'.repeat(form.password.length) }}</span>
                    <button type="button" @click="showPassword = !showPassword" class="ml-2 focus:outline-none">
                      <img src="/images/eye.png" alt="eye" class="w-5 h-5 object-contain" />
                    </button>
                  </div>
                </div>

                <h3 class="text-base font-genyogothic font-black text-[#36201080] my-6 leading-4 tracking-[2px]">個人資訊</h3>
                <div class="text-sm text-[#36201080] space-y-1 font-primary font-medium">
                  <div>姓名：<span>{{ form.lastName }} {{ form.firstName }}</span></div>
                  <div>生理性別：<span>{{ form.genderText || form.gender }}</span></div>
                  <div>出生年月日：<span>{{ form.birthDate }}</span></div>
                  <div>職業別：<span>{{ form.occupationText || form.occupation }}</span></div>
                </div>

                <h3 class="text-base font-genyogothic font-black text-[#36201080] my-6 leading-4 tracking-[2px]">聯絡資訊</h3>
                <div class="text-sm text-[#36201080] space-y-1 font-primary font-medium">
                  <div>居住城市：<span>{{ selectedCounty }}</span></div>
                  <div>居住區：<span>{{ selectedDistrict }}</span></div>
                  <div>居住地址：<span>{{ form.address }}</span></div>
                  <div>電子郵件：<span>{{ form.email }}</span></div>
                  <div>手機號碼：<span>{{ form.emergencyContact }}</span></div>
                </div>

                <h3 class="text-base font-genyogothic font-black text-[#36201080] my-6 leading-4 tracking-[2px]">學習資訊</h3>
                <div class="text-sm text-[#36201080] space-y-1 font-primary font-medium">
                  <div>欲學習的語言別：<span>{{ form.languageText || form.language }}</span></div>
                  <div>欲達到的目標：<span>{{ form.learningGoalText || form.learningGoal }}</span></div>
                  <div>學習目的：<span>{{ form.learningPurposeText || form.learningPurpose }}</span></div>
                  <div>目前程度：<span>{{ form.currentLevelText || form.currentLevel }}</span></div>
                </div>

                <h3 class="text-base font-genyogothic font-black text-[#36201080] my-6 leading-4 tracking-[2px]">過往學習</h3>
                <div class="text-sm text-[#36201080] space-y-1 font-primary font-medium">
                  <div>最高學歷：<span>{{ form.educationText || form.education }}</span></div>
                  <div>就讀學校：<span>{{ form.school }}</span></div>
                  <div>就讀科系：<span>{{ form.major }}</span></div>
                </div>

                <!-- 漸淡分隔線 -->
                <div class="py-5">
                  <div class="h-[1px] mx-8 opacity-50" style="background: linear-gradient(to right, #501C1C00, #432C2C 50%, #501C1C00);"></div>
                </div>
                <!-- 同意條款 -->
                <div class="mt-6 flex flex-col gap-3">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="agreeTerms" class="w-4 h-4" />
                    我已詳閱並同意 <span class="text-primary-1">本平台使用者規範</span>
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="agreePrivacy" class="w-4 h-4" />
                    我已詳閱並同意 <span class="text-primary-1">本中心個資使用條例</span>
                  </label>
                </div>
              </div>
            </div>

               <!-- 漸淡分隔線 -->
              <div class="py-5">
                <div class="h-[1px] mx-8 opacity-50" style="background: linear-gradient(to right, #501C1C00, #432C2C 50%, #501C1C00);"></div>
              </div>

            <!-- 按鈕區 -->
            <div class="flex gap-3 mt-6 justify-center">
              <button
                v-if="currentStep > 1"
                type="button"
                class="h-[40px] px-6 bg-[#36201080] text-white rounded-[12px] font-genyogothic font-black text-[16px] hover:bg-[#8A7354] transition flex items-center gap-2"
                @click="previousStep"
              >
                回上一步
                <img src="/images/pen.png" alt="edit" class="w-[16px] h-[16px]">
              </button>
              <button
                type="submit"
                :disabled="
                  (currentStep === 1 && (!emailVerification.verified.value || !phoneVerification.verified.value)) ||
                  (currentStep === 2 && !isStep2Complete()) ||
                  (currentStep === 3 && (!agreeTerms || !agreePrivacy))
                "
                :class="[
                  'h-[40px] px-6 text-white rounded-xl text-[16px] font-semibold transition flex items-center gap-2',
                  currentStep === 1 && (!emailVerification.verified.value || !phoneVerification.verified.value)
                    ? 'bg-[#36201080] cursor-not-allowed' 
                    : currentStep === 2 && !isStep2Complete()
                      ? 'bg-[#36201080] cursor-not-allowed' 
                      : currentStep === 3 && (!agreeTerms || !agreePrivacy)
                        ? 'bg-[#36201080] cursor-not-allowed'
                        : 'bg-primary-1 hover:bg-primary-2'
                ]"
              >
                <template v-if="currentStep === 1">
                  <template v-if="!emailVerification.verified.value || !phoneVerification.verified.value">
                    驗證後進入下一步
                    <img src="/images/lock.svg" alt="lock" class="w-[14px] h-[14px]">
                  </template>
                  <template v-else>
                    下一步，填寫學習資訊
                    <img src="/images/next.svg" alt="next" class="w-[14px] h-[8px]">
                  </template>
                </template>
                  <template v-else>
                    <template v-if="currentStep === 2 && !isStep2Complete()">
                      尚有欄位未填寫
                      <img src="/images/lock.svg" alt="lock" class="w-[14px] h-[14px]">
                    </template>
                    <template v-else-if="currentStep === 3 && (!agreeTerms || !agreePrivacy)">
                      尚未同意條款
                      <img src="/images/lock.svg" alt="lock" class="w-[14px] h-[14px]">
                    </template>
                    <template v-else>
                      {{ currentStep === 2 ? '下一步，確認註冊內容' : '完成註冊' }}
                      <img src="/images/next.svg" alt="next" class="w-[14px] h-[8px]">
                    </template>
                  </template>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTaiwanAddress } from '~/composables/useTaiwanAddress'
import { useVerificationCode } from '~/composables/useVerificationCode'
import { usePasswordValidation } from '~/composables/usePasswordValidation'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'complete': [data: any]
}>()

const currentStep = ref(1)

// 台灣縣市地址選擇器
const { selectedCounty, selectedDistrict, countyOptions, districtOptions } = useTaiwanAddress()

// 驗證碼管理
const emailVerification = useVerificationCode()
const phoneVerification = useVerificationCode()

// 密碼驗證
const { validatePassword: checkPassword } = usePasswordValidation()

const stepTitles = [
  '個人資訊',
  '學習資訊', 
  '確認註冊內容'
]

const form = ref({
  account: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  lastName: '',
  firstName: '',
  gender: '',
  birthDate: '',
  occupation: '',
  occupationText: '',
  phone: '',
  landline: '',
  address: '',
  emergencyContact: '',
  relationship: [] as (string | number)[],
  // 學習資訊
  language: '',
  learningGoal: '',
  learningPurpose: '',
  currentLevel: '',
  education: '',
  // display text for summary (store literal text)
  languageText: '',
  learningGoalText: '',
  learningPurposeText: '',
  currentLevelText: '',
  educationText: '',
  genderText: '',
  school: '',
  major: ''
})

const emailVerifyError = ref('')
const phoneVerifyError = ref('')
const confirmPasswordError = ref('')
const agreeTerms = ref(false)
const agreePrivacy = ref(false)
const showPassword = ref(false)

// 简化的错误状态管理
const errors = ref<Record<string, string>>({})

const hasError = (field: string) => !!errors.value[field]
const getError = (field: string) => errors.value[field] || ''
const setError = (field: string, message: string) => {
  errors.value[field] = message
}
const clearError = (field: string) => {
  delete errors.value[field]
}
const clearAllErrors = () => {
  errors.value = {}
}

const closePopup = () => {
  emit('update:modelValue', false)
  // 重置表單
  setTimeout(() => {
    currentStep.value = 1
    form.value = {
      account: '',
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      lastName: '',
      firstName: '',
      gender: '',
      birthDate: '',
      occupation: '',
      occupationText: '',
      phone: '',
      landline: '',
      address: '',
      emergencyContact: '',
      relationship: [] as (string | number)[],
      // 學習資訊
      language: '',
      learningGoal: '',
      learningPurpose: '',
      currentLevel: '',
      education: '',
      // display text for summary
      languageText: '',
      learningGoalText: '',
      learningPurposeText: '',
      currentLevelText: '',
      educationText: '',
      genderText: '',
      school: '',
      major: ''
    }
    
    selectedCounty.value = ''
    selectedDistrict.value = ''
    
    emailVerification.reset()
    phoneVerification.reset()
    
    clearAllErrors()
  }, 300)
}

const validateStep1 = () => {
  clearAllErrors()
  
  let hasError = false

  // 帳號資訊驗證
  if (!form.value.account) {
    setError('account', '請輸入暱稱')
    hasError = true
  }

  if (!form.value.nickname) {
    setError('nickname', '請輸入使用者帳號')
    hasError = true
  }

  if (!form.value.email) {
    setError('email', '請輸入電子郵件')
    hasError = true
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      setError('email', '請輸入有效的電子郵件格式')
      hasError = true
    }
  }

  if (!emailVerification.verified.value) {
    setError('email', '請先驗證電子郵件')
    hasError = true
  }

  if (!form.value.password) {
    setError('password', '請輸入密碼')
    hasError = true
  }

  if (form.value.password !== form.value.confirmPassword) {
    setError('confirmPassword', '兩次密碼輸入不一致')
    hasError = true
  }

  // 個人資訊驗證
  if (!form.value.lastName) {
    setError('lastName', '請輸入姓氏')
    hasError = true
  }

  if (!form.value.firstName) {
    setError('firstName', '請輸入名字')
    hasError = true
  }

  if (!form.value.gender) {
    setError('gender', '請選擇生理性別')
    hasError = true
  }

  if (!form.value.birthDate) {
    setError('birthDate', '請選擇出生年月日')
    hasError = true
  }

  if (!form.value.occupation) {
    setError('occupation', '請選擇職業別')
    hasError = true
  }

  // 聯絡資訊驗證
  if (!selectedCounty.value || !selectedDistrict.value) {
    setError('county', '請選擇居住縣市和地區')
    hasError = true
  }

  if (!form.value.address) {
    setError('address', '請輸入地址')
    hasError = true
  }

  if (!form.value.emergencyContact) {
    setError('emergencyContact', '請輸入手機號碼')
    hasError = true
  } else {
    const phoneRegex = /^09\d{8}$/
    if (!phoneRegex.test(form.value.emergencyContact)) {
      setError('emergencyContact', '請輸入有效的手機號碼格式')
      hasError = true
    }
  }

  if (!phoneVerification.verified.value) {
    setError('emergencyContact', '請先驗證手機號碼')
    hasError = true
  }

  if (!form.value.relationship || (Array.isArray(form.value.relationship) && form.value.relationship.length === 0)) {
    setError('relationship', '請選擇從哪裡知道我們')
    hasError = true
  }

  return !hasError
}


const validateStep2 = () => {
  clearAllErrors()
  let hasError = false

  if (!form.value.language) {
    setError('language', '請選擇欲學習的語言別')
    hasError = true
  }
  if (!form.value.learningGoal) {
    setError('learningGoal', '請選擇欲達到的目標')
    hasError = true
  }
  if (!form.value.learningPurpose) {
    setError('learningPurpose', '請選擇學習語言的目的')
    hasError = true
  }
  if (!form.value.currentLevel) {
    setError('currentLevel', '請選擇目前的程度')
    hasError = true
  }
  if (!form.value.education) {
    setError('education', '請選擇最高學歷')
    hasError = true
  }
  if (!form.value.school) {
    setError('school', '請輸入就讀學校')
    hasError = true
  }
  if (!form.value.major) {
    setError('major', '請輸入就讀科系')
    hasError = true
  }
  return !hasError
}

// Non-mutating check used by the template to avoid triggering validations
// (calling `validateStep2()` in the template caused immediate error highlighting).
const isStep2Complete = () => {
  return !!form.value.language &&
    !!form.value.learningGoal &&
    !!form.value.learningPurpose &&
    !!form.value.currentLevel &&
    !!form.value.education &&
    !!form.value.school &&
    !!form.value.major
}

const handleNext = () => {
  if (currentStep.value === 1) {
    if (!validateStep1()) return
  }
  if (currentStep.value === 2) {
    if (!validateStep2()) return
  }
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    // 完成註冊
    console.log('註冊資料:', form.value)
    emit('complete', form.value)
    closePopup()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const validateEmail = () => {
  if (!form.value.email) {
    clearError('email')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    setError('email', '請輸入有效的電子郵件格式')
  } else {
    clearError('email')
  }
}

const validatePhone = () => {
  if (!form.value.emergencyContact) {
    clearError('emergencyContact')
    return
  }
  
  const phoneRegex = /^09\d{8}$/
  if (!phoneRegex.test(form.value.emergencyContact)) {
    setError('emergencyContact', '請輸入有效的手機號碼格式')
  } else {
    clearError('emergencyContact')
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    clearError('password')
    return
  }
  
  const result = checkPassword(form.value.password)
  
  if (!result.isValid) {
    setError('password', result.error)
  } else {
    clearError('password')
  }
}

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    confirmPasswordError.value = ''
    return
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    confirmPasswordError.value = '兩次密碼輸入不一致'
  } else {
    confirmPasswordError.value = ''
  }
}

const sendEmailCode = () => {
  if (!form.value.email) {
    setError('email', '請先輸入電子郵件')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    setError('email', '請輸入有效的電子郵件格式')
    return
  }
  
  if (emailVerification.isCountingDown.value) return
  
  clearError('email')
  
  console.log('發送驗證碼至:', form.value.email)
  // 使用假數據：驗證碼為 1234
  emailVerification.code.value = '1234'
  
  emailVerification.startCountdown()
}

const sendPhoneCode = () => {
  if (!form.value.emergencyContact) {
    setError('emergencyContact', '請先輸入手機號碼')
    return
  }
  
  const phoneRegex = /^09\d{8}$/
  if (!phoneRegex.test(form.value.emergencyContact)) {
    setError('emergencyContact', '請輸入有效的手機號碼格式')
    return
  }
  
  if (phoneVerification.isCountingDown.value) return
  
  clearError('emergencyContact')
  
  console.log('發送驗證碼至:', form.value.emergencyContact)
  // 使用假數據：驗證碼為 1234
  phoneVerification.code.value = '1234'
  
  phoneVerification.startCountdown()
}

const verifyEmailCode = () => {
  if (!emailVerification.code.value) {
    emailVerifyError.value = '請輸入驗證碼'
    return
  }
  
  // 使用假數據驗證：只接受 1234
  if (emailVerification.code.value !== '1234') {
    emailVerifyError.value = '驗證碼錯誤'
    return
  }
  
  console.log('驗證郵件驗證碼:', emailVerification.code.value)
  
  emailVerification.verify()
  emailVerifyError.value = ''
  clearError('email')
}

const verifyPhoneCode = () => {
  if (!phoneVerification.code.value) {
    phoneVerifyError.value = '請輸入驗證碼'
    return
  }
  
  // 使用假數據驗證：只接受 1234
  if (phoneVerification.code.value !== '1234') {
    phoneVerifyError.value = '驗證碼錯誤'
    return
  }
  
  console.log('驗證手機驗證碼:', phoneVerification.code.value)
  
  phoneVerification.verify()
  phoneVerifyError.value = ''
  clearError('emergencyContact')
}

// Watch selections and store their display text directly
watch(() => form.value.language, (val) => {
  const map: Record<string,string> = {
    english: '英文',
    japanese: '日文',
    korean: '韓文',
    spanish: '西班牙文',
    french: '法文'
  }
  form.value.languageText = val ? (map[val] || val) : ''
})

watch(() => form.value.learningGoal, (val) => {
  const map: Record<string,string> = {
    daily: '日常對話',
    business: '商務應用',
    exam: '考試證照',
    hobby: '興趣培養'
  }
  form.value.learningGoalText = val ? (map[val] || val) : ''
})

watch(() => form.value.learningPurpose, (val) => {
  const map: Record<string,string> = {
    work: '工作需求',
    study: '升學考試',
    travel: '旅遊',
    personal: '個人興趣'
  }
  form.value.learningPurposeText = val ? (map[val] || val) : ''
})

watch(() => form.value.currentLevel, (val) => {
  const map: Record<string,string> = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '高級'
  }
  form.value.currentLevelText = val ? (map[val] || val) : ''
})

watch(() => form.value.education, (val) => {
  const map: Record<string,string> = {
    highschool: '高中職',
    college: '大學/專科',
    master: '碩士',
    phd: '博士'
  }
  form.value.educationText = val ? (map[val] || val) : ''
})

watch(() => form.value.occupation, (val) => {
  const map: Record<string,string> = {
    student: '學生',
    office: '上班族',
    freelance: '自由業',
    other: '其他'
  }
  form.value.occupationText = val ? (map[val] || val) : ''
})

watch(() => form.value.gender, (val) => {
  const map: Record<string,string> = {
    male: '男',
    female: '女',
    other: '其他'
  }
  form.value.genderText = val ? (map[val] || val) : ''
})

// 统一的字段清除逻辑
watch(form, (newForm) => {
  Object.keys(newForm).forEach(key => {
    if (newForm[key as keyof typeof newForm]) {
      clearError(key)
    }
  })
}, { deep: true })

watch([selectedCounty, selectedDistrict], ([county, district]) => {
  if (county && district) {
    clearError('county')
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .bg-white {
  transition: transform 0.3s ease;
}

.fade-enter-from .bg-white {
  transform: scale(0.95);
}
</style>
