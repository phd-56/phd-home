<template>
  <div class="diagnosis-criteria">
    <h4>诊断标准</h4>
    <div class="criteria-filters">
      <el-select 
        v-model="activeFilter" 
        placeholder="筛选标准类型" 
        size="small"
        @change="handleFilterChange"
      >
        <el-option label="全部标准" value="all" />
        <el-option label="临床标准" value="clinical" />
        <el-option label="影像学标准" value="imaging" />
        <el-option label="实验室标准" value="laboratory" />
      </el-select>
    </div>
    <div class="criteria-list">
      <div
        v-for="(criterion, index) in filteredCriteria"
        :key="index"
        class="criterion-item"
      >
        <div class="criterion-header">
          <h5>{{ criterion.title }}</h5>
          <el-tag 
            v-if="criterion.evidenceLevel" 
            :type="getEvidenceLevelType(criterion.evidenceLevel)"
            size="mini"
          >
            证据等级: {{ criterion.evidenceLevel }}
          </el-tag>
        </div>
        <p>{{ criterion.description }}</p>
        <div v-if="criterion.guidelines" class="criterion-guidelines">
          <small>参考指南: {{ criterion.guidelines }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { KnowledgeItem } from '@/types'

const props = defineProps<{
  criteria: KnowledgeItem['diagnosisCriteria']
}>()

const activeFilter = ref('all')

const filteredCriteria = computed(() => {
  if (activeFilter.value === 'all') return props.criteria
  // 简单类型匹配（实际可根据业务规则扩展）
  return props.criteria.filter(item => {
    if (activeFilter.value === 'clinical' && item.title.includes('临床')) return true
    if (activeFilter.value === 'imaging' && item.title.includes('影像')) return true
    if (activeFilter.value === 'laboratory' && item.title.includes('实验室')) return true
    return false
  })
})

const handleFilterChange = (value: string) => {
  activeFilter.value = value
}

const getEvidenceLevelType = (level: string) => {
  const levelMap: Record<string, string> = {
    'A': 'success',
    'B': 'primary',
    'C': 'warning',
    'D': 'info'
  }
  return levelMap[level] || 'default'
}
</script>

<style scoped>
.diagnosis-criteria {
  padding: 16px 0;
}
.criteria-filters {
  margin-bottom: 12px;
}
.criterion-item {
  padding: 12px;
  border-radius: 4px;
  background-color: #f9fafb;
  margin-bottom: 10px;
}
.criterion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.criterion-guidelines {
  margin-top: 8px;
  color: #666;
  font-style: italic;
}
</style>