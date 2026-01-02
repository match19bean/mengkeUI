<template>
  <div class="min-h-screen bg-brown-10 py-8 px-4">
    <div class="max-w-lg mx-auto">
      <!-- 頂部導航 -->
      <header class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <img src="/images/logo.png" alt="反轉外語" class="h-10 w-[auto] object-contain">
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/">
            <BaseButton variant="outline-rounded" size="medium">
              已有帳號
            </BaseButton>
          </NuxtLink>
          <BaseButton variant="outline-rounded" size="medium">
            使用LINE註冊 ⚪
          </BaseButton>
        </div>
      </header>

      <!-- 註冊表單 -->
      <form @submit.prevent="handleSignup" class="space-y-8">
        <!-- 註冊資料 -->
        <section>
          <h2 class="text-2xl font-bold text-brown-1 mb-6">註冊資料｜Signup</h2>
          
          <div class="space-y-4">
            <!-- 使用者帳號 -->
            <div class="flex items-end gap-3">
              <BaseInput
                v-model="form.phone"
                type="tel"
                label="使用者帳號"
                placeholder="0912345678"
                class="flex-1"
              />
              <button type="button" class="h-[50px] px-6 border-2 border-brown-1 text-brown-1 rounded-xl font-semibold text-base hover:bg-brown-9 transition-all whitespace-nowrap">
                確認帳號
              </button>
            </div>
            <p class="text-xs text-brown-5 -mt-2">*與其他學習者互動時呈現的名稱，不可更改，請謹慎取名，避免違反善良風俗。</p>

            <!-- 電子信箱 -->
            <div class="flex items-end gap-3">
              <BaseInput
                v-model="form.email"
                type="email"
                label="電子信箱"
                placeholder="example@mkplus.tw"
                class="flex-1"
              />
              <button type="button" class="h-[50px] px-6 border-2 border-brown-1 text-brown-1 rounded-xl font-semibold text-base hover:bg-brown-9 transition-all whitespace-nowrap">
                獲取驗證碼
              </button>
            </div>
            <p class="text-xs text-brown-5 -mt-2">*登入用帳號，避免使用免費信箱，以免收不到信箱驗證碼，或可能影響後續帳號權益。</p>

            <!-- 請輸入驗證碼 -->
            <BaseInput
              v-model="form.verificationCode"
              type="text"
              label="請輸入驗證碼"
              placeholder="請輸入驗證碼"
            />
            <p class="text-xs text-brown-5 -mt-2">* 驗證碼請勿提供給他人。</p>

            <!-- 登入密碼 -->
            <BaseInput
              v-model="form.password"
              type="password"
              label="登入密碼"
              placeholder="請輸入密碼"
            />
            <p class="text-xs text-brown-5 -mt-2">* 請輸入長度至少12位以上包含英文及數字特殊符號。</p>

            <!-- 請再輸入一次密碼 (Error狀態) -->
            <BaseInput
              v-model="form.passwordConfirm"
              type="password"
              label="請再輸入一次密碼！"
              placeholder="請輸入密碼"
              :error="false"
              error-message=""
            />

            <!-- 手機驗證碼 (Error狀態) -->
            <BaseInput
              v-model="form.phoneVerification"
              type="text"
              label="手機驗證碼請！"
              placeholder="請輸入驗證碼"
              :error="false"
              error-message=""
            />
          </div>
        </section>

        <!-- 基本資料 -->
        <section>
          <h2 class="text-2xl font-bold text-brown-1 mb-6">基本資料｜Common Identity</h2>
          
          <div class="space-y-4">
            <!-- 姓氏和名字 -->
            <div class="grid grid-cols-2 gap-3">
              <BaseInput
                v-model="form.lastName"
                type="text"
                label="姓氏"
                placeholder="王"
              />
              <BaseInput
                v-model="form.firstName"
                type="text"
                label="名字"
                placeholder="小明"
              />
            </div>

            <!-- 生理性別 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">生理性別 ⓘ</label>
              <select v-model="form.gender" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>

            <!-- 出生年月日 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">出生年月日 ⓘ</label>
              <select v-model="form.birthDate" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
              </select>
            </div>

            <!-- 職業別 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">職業別 ⓘ</label>
              <select v-model="form.occupation" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
              </select>
            </div>

            <!-- 居住城市和區域 -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">居住城市 ⓘ</label>
                <select v-model="form.city" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                  <option value="">請選擇</option>
                </select>
              </div>
              <div>
                <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">居住區域 ⓘ</label>
                <select v-model="form.district" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                  <option value="">請選擇</option>
                </select>
              </div>
            </div>

            <!-- 居住地址 -->
            <BaseInput
              v-model="form.address"
              type="text"
              label="居住地址"
              placeholder="請輸入地址"
            />

            <!-- 如何知道我們的 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">如何知道我們的？ ⓘ</label>
              <select v-model="form.howKnow" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 學習資訊 -->
        <section>
          <h2 class="text-2xl font-bold text-brown-1 mb-6">學習資訊｜Learning Information</h2>
          
          <div class="space-y-4">
            <!-- 最高學歷 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">最高學歷 ⓘ</label>
              <select v-model="form.education" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
              </select>
            </div>

            <!-- 學校名稱 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">學校名稱 ⓘ</label>
              <select v-model="form.school" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
              </select>
            </div>

            <!-- 就讀科系 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">就讀科系 ⓘ</label>
              <select v-model="form.major" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
              </select>
            </div>

            <!-- 職業別 -->
            <div>
              <label class="text-subtitle text-brown-1 font-semibold tracking-wide mb-2 block">職業別 ⓘ</label>
              <select v-model="form.jobType" class="w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] border-[#362010] rounded-xl bg-white text-brown-1 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30">
                <option value="">請選擇</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 提交按鈕 -->
        <div class="pt-4">
          <BaseButton
            variant="primary"
            size="large"
            type="submit"
          >
            註冊
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  phone: '',
  email: '',
  verificationCode: '',
  password: '',
  passwordConfirm: '',
  phoneVerification: '',
  lastName: '',
  firstName: '',
  gender: '',
  birthDate: '',
  occupation: '',
  city: '',
  district: '',
  address: '',
  howKnow: '',
  education: '',
  school: '',
  major: '',
  jobType: ''
})

const handleSignup = () => {
  console.log('註冊資料:', form.value)
}
</script>
