<template>
  <div ref="dropdownRef" :class="containerClasses">
    <!-- Trigger -->
    <button
      type="button"
      :class="buttonClasses"
      @click="toggleDropdown"
    >
      <span class="truncate">{{ selectedLabel }}</span>

      <svg
        :class="iconClasses"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Dropdown -->
    <transition name="dropdown">
      <div
        v-if="isOpen"
        :class="dropdownClasses"
      >
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          :class="itemClasses"
          @click="selectItem(item)"
        >
          <span :class="itemTextClasses">
            {{ item.label }}
          </span>

          <span
            v-if="item.tag"
            :class="[tagClasses, item.tagClass || 'bg-[#9d9185]']"
          >
            {{ item.tag }}
          </span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface DropdownItem {
  label: string
  value: string | number
  tag?: string
  tagClass?: string
}

type DropdownSize = 'large' | 'medium' | 'small'

const props = withDefaults(
  defineProps<{
    items: DropdownItem[]
    modelValue?: string | number | null
    placeholder?: string
    size?: 'large' | 'medium' | 'small'
  }>(),
  {
    modelValue: null,
    placeholder: '切換課程',
    size: 'small'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', item: DropdownItem): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedItem = computed(() =>
  props.items.find((item) => item.value === props.modelValue)
)

const selectedLabel = computed(() => selectedItem.value?.label || props.placeholder)

const resolvedSize = computed<DropdownSize>(() => props.size ?? 'small')

const sizeConfig: Record<DropdownSize, {
  container: string
  button: string
  icon: string
  dropdown: string
  item: string
  itemText: string
  tag: string
}> = {
  large: {
    container: 'w-[250px]',
    button: 'rounded-[28px] px-10 py-10 text-[28px]',
    icon: 'h-8 w-8',
    dropdown: 'top-[calc(100%+24px)] w-[320px] rounded-[32px] p-6',
    item: 'rounded-2xl px-6 py-5',
    itemText: 'text-[24px]',
    tag: 'px-5 py-2 text-[16px]'
  },
  medium: {
    container: 'w-[160px]',
    button: 'rounded-xl px-6 py-3 text-lg',
    icon: 'h-6 w-6',
    dropdown: 'top-[calc(100%+16px)] w-[250px] rounded-2xl p-4',
    item: 'rounded-xl px-4 py-3',
    itemText: 'text-lg',
    tag: 'px-4 py-1.5 text-sm'
  },
  small: {
    container: 'w-[150px]',
    button: 'rounded-[12px] px-4 py-[9px] text-base',
    icon: 'h-5 w-5',
    dropdown: 'top-[calc(100%+12px)] w-[200px] rounded-xl p-3',
    item: 'rounded-lg px-3 py-2',
    itemText: 'text-base',
    tag: 'px-3 py-1 text-xs'
  }
}

// 容器样式
const containerClasses = computed(() => {
  return ['relative inline-block', sizeConfig[resolvedSize.value].container].join(' ')
})

// 按钮样式
const buttonClasses = computed(() => {
  const baseClasses = 'flex w-full items-center justify-between bg-[#ee7b55] text-left font-extrabold text-white shadow-sm transition hover:opacity-95'

  return [baseClasses, sizeConfig[resolvedSize.value].button].join(' ')
})

// 图标样式
const iconClasses = computed(() => {
  const baseClasses = 'ml-4 flex-shrink-0 transition-transform duration-200'
  const rotateClass = isOpen.value ? 'rotate-180' : ''

  return [baseClasses, sizeConfig[resolvedSize.value].icon, rotateClass].filter(Boolean).join(' ')
})

// 下拉菜单样式
const dropdownClasses = computed(() => {
  const baseClasses = 'absolute left-0 z-20 bg-[#f4f1eb] shadow-[0_20px_60px_rgba(0,0,0,0.12)]'

  return [baseClasses, sizeConfig[resolvedSize.value].dropdown].join(' ')
})

// 下拉项样式
const itemClasses = computed(() => {
  const baseClasses = 'flex w-full items-center justify-between text-left transition hover:bg-[#ebe5dc]'

  return [baseClasses, sizeConfig[resolvedSize.value].item].join(' ')
})

// 下拉项文字样式
const itemTextClasses = computed(() => {
  const baseClasses = 'font-extrabold text-[#9d9185]'

  return [baseClasses, sizeConfig[resolvedSize.value].itemText].join(' ')
})

// 标签样式
const tagClasses = computed(() => {
  const baseClasses = 'ml-4 rounded-full font-extrabold text-white'

  return [baseClasses, sizeConfig[resolvedSize.value].tag].join(' ')
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item: DropdownItem) => {
  emit('update:modelValue', item.value)
  emit('change', item)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>