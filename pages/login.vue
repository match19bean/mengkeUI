<template>
  <div class="min-h-screen flex flex-col bg-brown-10">
    <!-- 上半部 - 左右分欄 -->
    <div class="flex flex-1">
      <!-- 左側 - 宣傳區域 -->
      <div class="flex w-2/3 flex-col pt-[65px] relative bg-brown-10 overflow-hidden">
        <!-- Logo -->
        <div class="flex flex-1 items-center justify-center">
          <img src="/images/logo.png" alt="反轉外語" class="object-contain select-none block">
        </div>
        
        <!-- 中間插圖 -->
        <div class="flex flex-1 items-end justify-center">
          <img src="/images/seepic.png" alt="學習插圖" class="w-full max-w-[900px] ">
        </div>
      </div>

      <!-- 右側 - 登入表單 -->
      <div class="flex w-1/3  items-center justify-center p-8 bg-brown-10">
      <div class="w-full max-w-md px-10">
        <!-- 標題和吉祥物 -->
        <div class="flex justify-center mb-6">
          <img src="/images/theo-waving.png" alt="吉祥物" class="w-full h-auto object-contain">
        </div>

        <!-- 登入表單 -->
        <form @submit.prevent="handleLogin" class="space-y-3">
          <!-- 帳號 -->
          <div>
            <label class="block text-primary-1 text-[20px] font-black mb-2 py-2">帳號</label>
            <BaseInput
              v-model="form.account"
              type="text"
              placeholder="請輸入帳號"
              :error="errors.account"
              :error-message="errors.accountMessage"
              textSize="text-[22px]"
              textAlign="center"
              textColor="text-[#F8F7F0]"
              bgColor="bg-[#EE795959]"
            />
          </div>

          <!-- 密碼 -->
          <div>
            <label class="block text-primary-1 text-[20px] font-black mb-2 py-2">密碼</label>
            <BaseInput
              v-model="form.password"
              type="password"
              placeholder="請輸入密碼"
              :error="errors.password"
              :error-message="errors.passwordMessage"
              textSize="text-[20px]"
              textAlign="center"
              textColor="text-[#F8F7F0]"
              bgColor="bg-[#EE795959]"
            />
          </div>
        </form>
      </div>
    </div>
    </div>

    <!-- 底部橘色資訊面板 - 填滿整個寬度 -->
    <div class="bg-primary-1 text-white pt-10 py-10 w-full">
      <!-- 主要内容区 - 左右分栏 -->
      <div class="flex flex-row items-start gap-0 w-full">
        <!-- 左侧区域 -->
        <div class="w-2/3 px-8 flex flex-col justify-center">
          <div class="flex flex-col w-[700px] mx-auto">
            <h2 class="text-[60px] leading-tight font-extrabold tracking-wide mb-7 text-center">不是你不會，是你學不對</h2>
            <div class="bg-white min-h-[51px] h-auto w-full px-10 py-[3px] rounded-full flex items-center justify-center gap-[10px] mb-8 mx-auto">
              <p class="text-primary-1 text-[27px] font-extrabold leading-snug sm:leading-none tracking-normal text-center break-all sm:break-normal">英、日、韓教學｜導遊領隊｜留遊學｜口譯筆譯</p>
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm leading-relaxed font-semibold mb-3 mx-full">
              <div class="space-y-3 text-left">
                <p class="break-words">桃園市中壢區中山路185號6樓</p>
                <p>03-280-5270</p>
              </div>
              <div class="space-y-3 text-right">
                <p>平日 13:00 - 21:30</p>
                <p>假日 09:30 - 18:00</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧 - 登入按钮区 -->
        <div class="w-1/3 px-8 sm:px-16">
          <div class="flex flex-col gap-3 justify-center">
            <!-- 登入按鈕 -->
            <button
              @click="handleLogin"
              type="button"
              :disabled="isLoading"
              :class="[
                'w-full h-[60px] px-[22px] py-2 rounded-3xl font-black text-[28px] flex items-center justify-center transition-all duration-250',
                isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#F8F7F0] text-primary-1 hover:bg-white'
              ]"
            >
              {{ isLoading ? '登入中...' : '登入' }}
            </button>
            
            <!-- LINE 登入按鈕 -->
            <button
              type="button"
              class="w-full h-[60px] px-[22px] py-2 bg-[#06C755] text-white rounded-3xl font-semibold text-[20px] flex items-center justify-center gap-2 hover:bg-[#05b34b] transition-all duration-250 tracking-widest font-genyogothic"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              使用LINE登入
            </button>

            <!-- 底部連結 -->
            <div class="flex items-center justify-end gap-6 text-sm pt-[16px]">
              <button 
                @click="showSignup = true"
                class="text-white hover:text-[#F8F7F0] font-medium cursor-pointer bg-transparent border-none"
              >
                免費註冊
              </button>
              <a href="#" class="text-white/80 hover:text-white">忘記密碼</a>
            </div>

            <!-- 底部版權資訊 -->
            <div class="w-full flex flex-row items-start justify-between gap-2 text-[10px] pt-[35px] tracking-wide">
              <div class="space-y-3 text-left">
                <p class="opacity-90">府教字第號 1080185694</p>
              </div>
              <div class="space-y-3 text-right">
                <p class="text-left sm:text-right opacity-90 break-words">萌客股份有限公司附設私立萌客外語短期補習班</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>

    <!-- 註冊彈窗 -->
    <SignupPopup 
      v-model="showSignup" 
      @complete="handleSignupComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showSignup = ref(false)
const { login } = useAuth()
const router = useRouter()

const form = ref({
  account: '',
  password: ''
})

const errors = ref({
  account: false,
  accountMessage: '',
  password: false,
  passwordMessage: ''
})

const isLoading = ref(false)

const handleLogin = async () => {
  // 重置錯誤
  errors.value = {
    account: false,
    accountMessage: '',
    password: false,
    passwordMessage: ''
  }

  // 簡單驗證
  let hasError = false

  if (!form.value.account) {
    errors.value.account = true
    errors.value.accountMessage = '請輸入帳號'
    hasError = true
  }

  if (!form.value.password) {
    errors.value.password = true
    errors.value.passwordMessage = '請輸入密碼'
    hasError = true
  }

  if (hasError) return

  // 呼叫登入 API
  isLoading.value = true
  
  try {
    const result = await login({
      account: form.value.account,
      password: form.value.password
    })

    if (result.success) {
      router.push('/')
    } else {
      // 顯示錯誤訊息
      alert(result.message || '登入失敗')
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    alert('登入失敗，請稍後再試')
  } finally {
    isLoading.value = false
  }
}

const handleSignupComplete = (data: any) => {
  console.log('註冊完成:', data)
  // 這裡可以處理註冊完成後的邏輯，例如自動登入或顯示成功訊息
}
</script>
