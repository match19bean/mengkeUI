<template>
  <div class="min-h-screen flex bg-brown-10">
    <!-- 左側 - 宣傳區域（微調後） -->
    <div class="hidden lg:flex lg:w-1/2 flex-col pt-12 pb-0 relative bg-brown-10 overflow-hidden shadow-[8px_0_24px_rgba(0,0,0,0.08)]">
      <!-- Logo -->
      <div class="flex-1 flex items-center justify-center px-16">
        <img src="/images/logo.png" alt="反轉外語" class="h-[53px] w-[377px] object-contain select-none block">
      </div>
      
      <!-- 中間插圖 -->
      <div class="flex-1 flex items-end justify-center px-16">
        <img src="/images/seepic.png" alt="學習插圖" class="w-full max-w-[596px] select-none pointer-events-none">
      </div>

      <!-- 底部橘色資訊面板（寬度填滿） -->
      <div class="bg-primary-1 text-white pt-10 pb-6 rounded-t-[32px] px-8 sm:px-16">
        <h2 class="text-3xl sm:text-[44px] leading-tight font-extrabold tracking-wide text-center mb-7">不是你不會，是你學不對</h2>
        <div class="bg-white min-h-[51px] h-auto px-[22px] py-[3px] rounded-[100px] flex items-center justify-center gap-[10px] mx-auto w-full max-w-[526px] shadow-[0_4px_10px_rgba(0,0,0,0.06)] mb-8">
          <p class="text-primary-2 text-sm sm:text-base md:text-xl font-extrabold leading-snug sm:leading-none tracking-normal text-center break-all sm:break-normal">英、日、韓教學｜導遊領隊｜留遊學｜口譯筆譯</p>
        </div>

        <div class="grid grid-cols-2 gap-x-4 sm:gap-x-16 gap-y-3 text-sm sm:text-base leading-relaxed font-semibold mb-3 max-w-[526px] mx-auto">
          <div class="space-y-3">
            <p class="break-words">桃園市中壢區中山路185號6樓</p>
            <p>03-280-5270</p>
          </div>
          <div class="space-y-3 text-right">
            <p>平日 13:00 - 21:30</p>
            <p>假日 09:30 - 18:00</p>
          </div>
        </div>

        <div class="pt-3 border-t border-dashed border-white/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-[10px] sm:text-xs leading-tight tracking-wide max-w-[526px] mx-auto">
          <p class="opacity-90">府教字第號 1080185694</p>
          <p class="text-left sm:text-right opacity-90 break-words">萌客股份有限公司附設私立萌客外語短期補習班</p>
        </div>
      </div>
    </div>

    <!-- 右側 - 登入表單 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-brown-10">
      <div class="w-full max-w-md px-4">
        <!-- 標題和吉祥物 -->
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-brown-1 mb-6">一起學好外語吧！</h1>
          <div class="flex justify-center mb-6">
            <img src="/images/theo-waving.png" alt="吉祥物" class="w-72 h-auto object-contain">
          </div>
        </div>

        <!-- 登入表單 -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- 帳號 -->
          <BaseInput
            v-model="form.email"
            type="email"
            label="帳號"
            placeholder="example@mkplus.tw"
            :error="errors.email"
            :error-message="errors.emailMessage"
          />

          <!-- 密碼 -->
          <BaseInput
            v-model="form.password"
            type="password"
            label="密碼"
            placeholder="請輸入密碼"
            :error="errors.password"
            :error-message="errors.passwordMessage"
          />

          <!-- 按鈕組 -->
          <div class="grid grid-cols-3 gap-3 pt-2">
            <!-- 登入按鈕 -->
            <BaseButton
              variant="outline"
              size="large"
              type="submit"
            >
              登入
            </BaseButton>
            
            <!-- LINE 登入按鈕 -->
            <button
              type="button"
              class="col-span-2 h-[60px] px-[22px] py-2 bg-[#06C755] text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#05b34b] transition-all duration-250 border-2 border-transparent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              使用LINE登入
            </button>
          </div>
          
          <!-- 底部連結 -->
          <div class="flex items-center justify-end gap-6 text-sm pt-1">
            <NuxtLink to="/signup" class="text-primary-1 hover:text-primary-2 font-medium">免費註冊</NuxtLink>
            <a href="#" class="text-brown-5 hover:text-brown-3">忘記密碼</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: false,
  emailMessage: '',
  password: false,
  passwordMessage: ''
})

const handleLogin = () => {
  // 重置錯誤
  errors.value = {
    email: false,
    emailMessage: '',
    password: false,
    passwordMessage: ''
  }

  // 簡單驗證
  let hasError = false

  if (!form.value.email) {
    errors.value.email = true
    errors.value.emailMessage = '請輸入帳號'
    hasError = true
  }

  if (!form.value.password) {
    errors.value.password = true
    errors.value.passwordMessage = '請輸入密碼'
    hasError = true
  }

  if (hasError) return

  // 這裡處理登入邏輯
  console.log('登入資料:', form.value)
}
</script>
