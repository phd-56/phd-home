<template>
  <div class="patient-education">
    <h4>患者教育内容</h4>
    <div class="education-filters">
      <el-button 
        type="primary" 
        size="small" 
        @click="exportEducationContent"
        icon="Download"
      >
        导出教育材料
      </el-button>
    </div>
    <div class="education-list">
      <div
        v-for="(item, index) in educationContent"
        :key="index"
        class="education-item"
        :class="`importance-${item.importance}`"
      >
        <div class="education-header">
          <h5>{{ index + 1 }}. {{ item.title }}</h5>
          <el-tag 
            :type="getImportanceType(item.importance)"
            size="mini"
          >
            {{ getImportanceText(item.importance) }}
          </el-tag>
        </div>
        <p class="education-content">{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KnowledgeItem } from '@/types'
import { ElMessage } from 'element-plus'
import { PDFGenerator } from '@/utils/pdf-generator'

const props = defineProps<{
  educationContent: KnowledgeItem['patientEducation']
  title: string  // 疾病标题，用于导出文件名
}>()

const getImportanceType = (importance: string) => {
  const typeMap: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return typeMap[importance] || 'default'
}

const getImportanceText = (importance: string) => {
  const textMap: Record<string, string> = {
    high: '重要',
    medium: '一般',
    low: '次要'
  }
  return textMap[importance] || '未分类'
}

const exportEducationContent = async () => {
  try {
    // 生成临时DOM用于PDF导出
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = `
      <h2>${props.title} - 患者教育材料</h2>
      ${props.educationContent.map((item, i) => `
        <div style="margin: 16px 0;">
          <h3>${i + 1}. ${item.title}</h3>
          <p>${item.content}</p>
        </div>
      `).join('')}
    `
    document.body.appendChild(tempDiv)
    
    await PDFGenerator.generateFromHtml(tempDiv, {}, `${props.title}_患者教育材料.pdf`)
    ElMessage.success('教育材料导出成功')
    document.body.removeChild(tempDiv)
  } catch (error) {
    ElMessage.error('导出失败，请重试')
    console.error('Export error:', error)
  }
}
</script>

<style scoped>
.patient-education {
  padding: 16px 0;
}
.education-filters {
  margin-bottom: 12px;
  text-align: right;
}
.education-list {
  margin-top: 12px;
}
.education-item {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 10px;
  border-left: 4px solid transparent;
}
.education-item.importance-high {
  background-color: #fff1f0;
  border-left-color: #f5222d;
}
.education-item.importance-medium {
  background-color: #fff7e6;
  border-left-color: #faad14;
}
.education-item.importance-low {
  background-color: #f0f9ff;
  border-left-color: #1890ff;
}
.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.education-content {
  line-height: 1.6;
}
</style>