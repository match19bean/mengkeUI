<template>
  <div class="min-w-[350px] w-full h-full bg-brown-10 rounded-[24px] p-6 shadow-2xl border border-brown-8" style="background-color: #F8F7F0;">
    <!-- 雷達圖 -->
    <div class="relative w-full aspect-square max-w-[320px] mx-auto">
      <svg viewBox="0 0 260 260" class="w-full h-full overflow-visible">
        <defs>
          <!-- 外框陰影 -->
          <filter id="outerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
            <feOffset dx="0" dy="6" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- 堆疊陰影效果 -->
          <filter id="layer5Shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
            <feOffset dx="0" dy="5" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="layer4Shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="layer3Shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="0" dy="3" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="layer2Shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="layer1Shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- 堆疊的背景層（相同大小，通過偏移創造深度） -->
        <g>
          <!-- 第5層（最下面） -->
          <path
            :d="getRoundedPolygonPath(100, 12, 0, 0)"
            fill="#F8F7F0"
            stroke="none"
            filter="url(#outerShadow)"
          />
          
          <!-- 第4層 -->
          <path
            :d="getRoundedPolygonPath(80, 12, 0, 0)"
            fill="#F8F7F0"
            stroke="none"
            filter="url(#layer5Shadow)"
          />
          
          <!-- 第3層 -->
          <path
            :d="getRoundedPolygonPath(60, 12, 0, 0)"
            fill="#F8F7F0"
            stroke="none"
            filter="url(#layer4Shadow)"
          />
          
          <!-- 第2層 -->
          <path
            :d="getRoundedPolygonPath(40, 12, 0, 0)"
            fill="#F8F7F0"
            stroke="none"
            filter="url(#layer3Shadow)"
          />
          
          <!-- 第1層（最上面的背景層） -->
          <path
            :d="getRoundedPolygonPath(20, 12, 0, 0)"
            fill="#F8F7F0"
            stroke="none"
            filter="url(#layer1Shadow)"
          />
        </g>

        <!-- 目標分數多邊形 (橙色，圓角) -->
        <path
          v-if="showTarget"
          :d="getRoundedDataPolygonPath(items.map(item => item.target || 0), 8, 0, 0)"
          :fill="targetColor"
          :fill-opacity="targetOpacity"
          :stroke="targetColor"
          stroke-width="3"
          stroke-linejoin="round"
        />

        <!-- 現況分數多邊形 (棕色，圓角) -->
        <path
          :d="getRoundedDataPolygonPath(items.map(item => item.current), 8, 0, 0)"
          :fill="currentColor"
          :fill-opacity="currentOpacity"
          :stroke="currentColor"
          stroke-width="3"
          stroke-linejoin="round"
        />

        <!-- 標籤文字 -->
        <g v-for="(item, index) in items" :key="'label-' + index">
          <text
            :x="getLabelPoint(index, 0, 0).x"
            :y="getLabelPoint(index, 0, 0).y"
            :text-anchor="getLabelAnchor(index)"
            class="text-small font-black font-secondary fill-brown-1"
            dominant-baseline="middle"
            style="opacity: 0.56;"
          >
            {{ item.label }}
          </text>
        </g>
      </svg>
    </div>

    <!-- 圖例 -->
    <div class="flex items-center justify-center gap-6 mt-6">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: currentColor }"></div>
        <span class="text-sm font-medium text-brown-2">{{ currentLabel }}</span>
      </div>
      <div v-if="showTarget" class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: targetColor }"></div>
        <span class="text-sm font-medium text-brown-2">{{ targetLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface RadarItem {
  label: string
  current: number
  target?: number
}

interface Props {
  items: RadarItem[]
  maxValue?: number
  currentColor?: string
  targetColor?: string
  currentOpacity?: number
  targetOpacity?: number
  currentLabel?: string
  targetLabel?: string
  showTarget?: boolean
  layerSizes?: number[] // 各層的大小百分比 [layer1, layer2, layer3, layer4, layer5]
}

const props = withDefaults(defineProps<Props>(), {
  maxValue: 100,
  currentColor: '#36201080',
  targetColor: '#EE7959',
  currentOpacity: 0.3,
  targetOpacity: 0.25,
  currentLabel: '目前分數',
  targetLabel: '期望分數',
  showTarget: true
})

const angleStep = computed(() => (Math.PI * 2) / props.items.length)

// 獲取多邊形的點位 (radius 為百分比 0-100，支持偏移)
function getPoint(index: number, radius: number, offsetX: number = 0, offsetY: number = 0) {
  const angle = angleStep.value * index - Math.PI / 2
  const centerX = 130 + offsetX
  const centerY = 130 + offsetY
  const maxRadius = 95 // 最大半徑
  const actualRadius = (radius / 100) * maxRadius
  
  return {
    x: centerX + actualRadius * Math.cos(angle),
    y: centerY + actualRadius * Math.sin(angle)
  }
}

// 獲取標籤位置
function getLabelPoint(index: number, offsetX: number = 0, offsetY: number = 0) {
  const angle = angleStep.value * index - Math.PI / 2
  const centerX = 130 + offsetX
  const centerY = 130 + offsetY
  const labelRadius = 118 // 標籤距離中心的半徑
  
  return {
    x: centerX + labelRadius * Math.cos(angle),
    y: centerY + labelRadius * Math.sin(angle)
  }
}

// 獲取背景多邊形的點位字串
function getPolygonPoints(radius: number) {
  return props.items
    .map((_, index) => {
      const point = getPoint(index, radius)
      return `${point.x},${point.y}`
    })
    .join(' ')
}

// 獲取數據多邊形的點位字串
function getDataPolygonPoints(values: number[]) {
  return values
    .map((value, index) => {
      const percentage = (value / props.maxValue) * 100
      const point = getPoint(index, percentage)
      return `${point.x},${point.y}`
    })
    .join(' ')
}

// 獲取標籤對齊方式
function getLabelAnchor(index: number) {
  const angle = (angleStep.value * index - Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)
  if (angle < Math.PI / 6 || angle > Math.PI * 11 / 6) return 'start'
  if (angle > Math.PI * 5 / 6 && angle < Math.PI * 7 / 6) return 'end'
  return 'middle'
}

// 生成圓角多邊形路徑（支持偏移）
function getRoundedPolygonPath(radius: number, cornerRadius: number, offsetX: number = 0, offsetY: number = 0): string {
  const points = props.items.map((_, index) => getPoint(index, radius, offsetX, offsetY))
  if (points.length < 3) return ''
  
  let path = ''
  for (let i = 0; i < points.length; i++) {
    const current = points[i]!
    const next = points[(i + 1) % points.length]!
    const prev = points[(i - 1 + points.length) % points.length]!
    
    // 計算向量
    const dx1 = current.x - prev.x
    const dy1 = current.y - prev.y
    const dx2 = next.x - current.x
    const dy2 = next.y - current.y
    
    // 計算距離
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
    
    // 計算圓角起點和終點
    const radius1 = Math.min(cornerRadius, len1 / 2, len2 / 2)
    const startX = current.x - (dx1 / len1) * radius1
    const startY = current.y - (dy1 / len1) * radius1
    const endX = current.x + (dx2 / len2) * radius1
    const endY = current.y + (dy2 / len2) * radius1
    
    if (i === 0) {
      path += `M ${startX} ${startY}`
    }
    
    path += ` Q ${current.x} ${current.y} ${endX} ${endY}`
    
    if (i < points.length - 1) {
      const nextStart = next
      path += ` L ${endX} ${endY}`
    }
  }
  
  path += ' Z'
  return path
}

// 生成數據圓角多邊形路徑（支持偏移）
function getRoundedDataPolygonPath(values: number[], cornerRadius: number, offsetX: number = 0, offsetY: number = 0): string {
  const points = values.map((value, index) => {
    const percentage = (value / props.maxValue) * 100
    return getPoint(index, percentage, offsetX, offsetY)
  })
  
  if (points.length < 3) return ''
  
  let path = ''
  for (let i = 0; i < points.length; i++) {
    const current = points[i]!
    const next = points[(i + 1) % points.length]!
    const prev = points[(i - 1 + points.length) % points.length]!
    
    const dx1 = current.x - prev.x
    const dy1 = current.y - prev.y
    const dx2 = next.x - current.x
    const dy2 = next.y - current.y
    
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
    
    const radius1 = Math.min(cornerRadius, len1 / 2, len2 / 2)
    const startX = current.x - (dx1 / len1) * radius1
    const startY = current.y - (dy1 / len1) * radius1
    const endX = current.x + (dx2 / len2) * radius1
    const endY = current.y + (dy2 / len2) * radius1
    
    if (i === 0) {
      path += `M ${startX} ${startY}`
    }
    
    path += ` Q ${current.x} ${current.y} ${endX} ${endY}`
    
    if (i < points.length - 1) {
      path += ` L ${endX} ${endY}`
    }
  }
  
  path += ' Z'
  return path
}
</script>
