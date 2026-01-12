<template>
  <div class="flex gap-3">
    <div class="w-[128px]">
      <BaseInput
        v-model="code"
        type="text"
        text-size="text-xs"
        :placeholder="placeholder"
      />
    </div>
    <div class="flex items-end">
      <button
        type="button"
        :disabled="isCountingDown"
        :class="[
          'h-[32px] px-4 text-white rounded-full font-medium text-sm transition whitespace-nowrap',
          isCountingDown ? 'bg-[#36201040] cursor-not-allowed' : 'bg-[#36201080] hover:bg-[#9B8365]'
        ]"
        @click="handleSendCode"
      >
        {{ isCountingDown ? `已寄出，重新寄出${countdown}s` : '獲取驗證碼' }}
      </button>
    </div>
    <div class="flex items-end">
      <button
        type="button"
        :disabled="!codeSent"
        :class="[
          'h-[32px] px-4 text-white rounded-full font-medium text-sm transition whitespace-nowrap',
          codeSent ? 'bg-[#36201080] hover:bg-[#9B8365]' : 'bg-[#3620101A] cursor-not-allowed opacity-50'
        ]"
        @click="handleVerify"
      >
        驗證
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  modelValue: string
  countdown: number
  isCountingDown: boolean
  codeSent: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '驗證碼'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'send': []
  'verify': []
}>()

const code = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleSendCode = () => {
  emit('send')
}

const handleVerify = () => {
  emit('verify')
}
</script>
