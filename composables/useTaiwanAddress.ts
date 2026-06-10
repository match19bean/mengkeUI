import { ref, computed, watch } from 'vue'
import { taiwanCounties } from '@/data/taiwan-address'

export function useTaiwanAddress() {
  const selectedCounty = ref('')
  const selectedDistrict = ref('')

  // 取得所有縣市名稱
  const countyOptions = computed(() => {
    return taiwanCounties.map(county => county.name)
  })

  // 根據選擇的縣市取得區域選項
  const districtOptions = computed(() => {
    if (!selectedCounty.value) return []
    const county = taiwanCounties.find(c => c.name === selectedCounty.value)
    return county ? county.districts : []
  })

  // 當縣市改變時，清空區域選擇
  watch(selectedCounty, () => {
    selectedDistrict.value = ''
  })

  return {
    selectedCounty,
    selectedDistrict,
    countyOptions,
    districtOptions
  }
}
