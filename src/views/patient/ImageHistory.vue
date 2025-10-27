<template>
  <div class="image-history">
    <div class="page-header">
      <h1>历史影像</h1>
      <p>查看您之前上传的医学影像和AI诊断结果</p>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>上传记录</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索影像名称"
            prefix-icon="el-icon-search"
            class="search-input"
          />
        </div>
      </template>

      <!-- 筛选条件 -->
      <div class="filter-section">
        <el-select v-model="filterType" placeholder="筛选影像类型" clearable class="filter-select">
          <el-option label="全部类型" value="" />
          <el-option label="X光片" value="xray" />
          <el-option label="CT扫描" value="ct" />
          <el-option label="MRI影像" value="mri" />
          <el-option label="超声影像" value="ultrasound" />
          <el-option label="其他影像" value="other" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-picker"
        />
      </div>

      <!-- 历史记录列表 -->
      <div v-if="filteredHistory.length > 0" class="history-list">
        <el-scrollbar height="600px">
          <el-card
            v-for="(record, index) in filteredHistory"
            :key="index"
            class="history-item"
            :body-style="{ padding: '0' }"
          >
            <div class="history-content">
              <!-- 左侧图片预览 -->
              <div class="history-images">
                <div v-for="(image, imgIndex) in record.images" :key="imgIndex" class="history-image-item">
                  <el-image
                    :src="image.url"
                    :alt="image.name"
                    class="history-image"
                    fit="cover"
                    preview-teleported
                  >
                    <template #error>
                      <div class="image-placeholder">图片加载失败</div>
                    </template>
                  </el-image>
                  <p class="image-name">{{ image.name }}</p>
                </div>
              </div>

              <!-- 右侧信息 -->
              <div class="history-info">
                <div class="info-header">
                  <h3>{{ record.images.length > 0 ? record.images[0].name : '影像记录' }}</h3>
                  <el-tag :type="getResultType(record.aiResult?.title)" class="result-tag">
                    {{ record.aiResult?.title || '未分析' }}
                  </el-tag>
                </div>

                <div class="info-content">
                  <div class="info-row">
                    <span class="info-label">上传时间：</span>
                    <span class="info-value">{{ formatDate(record.uploadTime) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">影像类型：</span>
                    <span class="info-value">{{ getImageTypeText(record.imageType) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">检查部位：</span>
                    <span class="info-value">{{ record.bodyPart || '未指定' }}</span>
                  </div>
                  <div class="info-row" v-if="record.description">
                    <span class="info-label">描述：</span>
                    <span class="info-value">{{ record.description }}</span>
                  </div>
                </div>

                <!-- AI诊断结果摘要 -->
                <div v-if="record.aiResult" class="ai-result-summary">
                  <h4>AI诊断摘要</h4>
                  <p>{{ record.aiResult.description }}</p>
                  <el-button type="text" @click="showFullResult(record)">查看完整诊断</el-button>
                </div>

                <!-- 操作按钮 -->
                <div class="history-actions">
                  <el-button type="primary" size="small" @click="viewDetails(record)">
                    <el-icon><View /></el-icon>
                    查看详情
                  </el-button>
                  <el-button size="small" @click="deleteRecord(index)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-scrollbar>
      </div>

      <!-- 无记录提示 -->
      <div v-else class="empty-state">
        <el-empty description="暂无上传记录" />
      </div>
    </el-card>

    <!-- 完整AI诊断对话框 -->
    <el-dialog v-model="fullResultVisible" title="AI完整诊断结果" width="600px">
      <div v-if="currentRecord" class="full-result-content">
        <div class="result-header">
          <h3>{{ currentRecord.aiResult.title }}</h3>
          <p class="result-time">分析时间：{{ formatDate(currentRecord.uploadTime) }}</p>
        </div>
        <div class="result-main">
          <p class="result-description">{{ currentRecord.aiResult.description }}</p>
          <div v-if="currentRecord.aiResult.details" class="result-details">
            <h4>详细分析：</h4>
            <ul>
              <li v-for="(detail, index) in currentRecord.aiResult.details" :key="index">{{ detail }}</li>
            </ul>
          </div>
        </div>
        <div class="result-footer">
          <el-tag type="info">AI辅助诊断仅供参考，请以医生诊断为准</el-tag>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { View, Delete } from '@element-plus/icons-vue'

const authStore = useAuthStore()
const searchKeyword = ref('')
const filterType = ref('')
const dateRange = ref<[Date, Date] | null>(null)
const historyRecords = ref<any[]>([])
const fullResultVisible = ref(false)
const currentRecord = ref<any>(null)

// 加载历史记录
const loadHistoryRecords = () => {
  try {
    const savedRecords = localStorage.getItem('patientImageHistory')
    if (savedRecords) {
      historyRecords.value = JSON.parse(savedRecords)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
    ElMessage.error('加载历史记录失败')
  }
}

// 过滤后的历史记录
const filteredHistory = computed(() => {
  let filtered = [...historyRecords.value]
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(record => 
      record.images.some((img: any) => img.name.toLowerCase().includes(keyword)) ||
      record.description?.toLowerCase().includes(keyword) ||
      record.bodyPart?.toLowerCase().includes(keyword) ||
      record.aiResult?.title?.toLowerCase().includes(keyword)
    )
  }
  
  // 按影像类型筛选
  if (filterType.value) {
    filtered = filtered.filter(record => record.imageType === filterType.value)
  }
  
  // 按日期范围筛选
  if (dateRange.value) {
    const [start, end] = dateRange.value
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.uploadTime)
      return recordDate >= start && recordDate <= end
    })
  }
  
  // 按时间倒序排列
  return filtered.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())
})

// 获取影像类型文本
const getImageTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'xray': 'X光片',
    'ct': 'CT扫描',
    'mri': 'MRI影像',
    'ultrasound': '超声影像',
    'other': '其他影像'
  }
  return typeMap[type] || '未知类型'
}

// 获取结果类型
const getResultType = (title?: string) => {
  if (!title) return 'info'
  if (title.includes('正常')) return 'success'
  if (title.includes('疑似') || title.includes('异常')) return 'danger'
  return 'warning'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 显示完整诊断结果
const showFullResult = (record: any) => {
  currentRecord.value = record
  fullResultVisible.value = true
}

// 查看详情
const viewDetails = (record: any) => {
  ElMessage.info('查看详情功能开发中')
  // 这里可以实现跳转到详情页的逻辑
}

// 删除记录
const deleteRecord = (index: number) => {
  ElMessageBox.confirm('确定要删除这条记录吗？此操作不可恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    historyRecords.value.splice(index, 1)
    saveHistoryRecords()
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 保存历史记录到本地存储
const saveHistoryRecords = () => {
  try {
    localStorage.setItem('patientImageHistory', JSON.stringify(historyRecords.value))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

// 组件挂载时加载历史记录
onMounted(() => {
  loadHistoryRecords()
})
</script>

<style scoped>
.image-history {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 300px;
}

.filter-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-select {
  width: 200px;
}

.date-picker {
  width: 300px;
}

.history-list {
  margin-top: 20px;
}

.history-item {
  margin-bottom: 20px;
}

.history-content {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.history-images {
  display: flex;
  gap: 10px;
  max-width: 300px;
}

.history-image-item {
  flex: 1;
  min-width: 0;
}

.history-image {
  width: 100%;
  height: 150px;
  border-radius: 4px;
}

.image-name {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.history-info {
  flex: 1;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.info-header h3 {
  margin: 0;
  color: #303133;
}

.result-tag {
  font-size: 14px;
}

.info-content {
  margin-bottom: 15px;
}

.info-row {
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #606266;
  margin-right: 8px;
}

.info-value {
  color: #303133;
}

.ai-result-summary {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.ai-result-summary h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
}

.ai-result-summary p {
  margin: 0 0 10px 0;
  color: #606266;
  line-height: 1.6;
}

.history-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  padding: 40px 0;
}

.full-result-content {
  line-height: 1.6;
}

.result-header h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.result-time {
  color: #909399;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.result-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 20px;
}

.result-details h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.result-details ul {
  margin: 0;
  padding-left: 20px;
}

.result-details li {
  margin-bottom: 8px;
  color: #606266;
}

.result-footer {
  margin-top: 20px;
  text-align: right;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
  background: #f5f7fa;
  color: #909399;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .history-content {
    flex-direction: column;
  }
  
  .history-images {
    max-width: 100%;
    overflow-x: auto;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .filter-select,
  .date-picker {
    width: 100%;
  }
}
</style>