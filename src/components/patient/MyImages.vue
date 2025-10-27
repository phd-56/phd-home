<template>
  <div class="my-images">
    <div class="page-header">
      <h2>我的影像资料</h2>
      <el-button type="primary" @click="showUploadDialog = true">
        <el-icon><Plus /></el-icon>
        上传新影像
      </el-button>
    </div>

    <!-- 影像库统计 -->
    <div class="image-stats">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-item">
            <div class="stat-value">{{ imageStats.total }}</div>
            <div class="stat-label">总影像数</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item">
            <div class="stat-value">{{ imageStats.thisMonth }}</div>
            <div class="stat-label">本月新增</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item">
            <div class="stat-value">{{ imageStats.totalSize }}</div>
            <div class="stat-label">总存储空间</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 影像筛选 -->
    <div class="image-filters">
      <el-input
        v-model="searchQuery"
        placeholder="搜索影像..."
        clearable
        style="width: 200px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select v-model="filterBodyPart" placeholder="检查部位" clearable>
        <el-option label="膝关节" value="膝关节" />
        <el-option label="髋关节" value="髋关节" />
        <el-option label="腰椎" value="腰椎" />
        <el-option label="颈椎" value="颈椎" />
        <el-option label="肩关节" value="肩关节" />
      </el-select>
      
      <el-select v-model="filterType" placeholder="影像类型" clearable>
        <el-option label="X光" value="xray" />
        <el-option label="CT" value="ct" />
        <el-option label="MRI" value="mri" />
        <el-option label="超声" value="ultrasound" />
      </el-select>
      
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </div>

    <!-- 影像网格 -->
    <div class="image-grid">
      <div
        v-for="image in filteredImages"
        :key="image.id"
        class="image-card"
        @click="viewImageDetail(image)"
      >
        <div class="card-header">
          <el-tag size="small" :type="getImageTypeColor(image.type)">
            {{ getImageTypeText(image.type) }}
          </el-tag>
          <div class="card-actions">
            <el-button link type="primary" @click.stop="downloadImage(image)">
              <el-icon><Download /></el-icon>
            </el-button>
            <el-button link type="danger" @click.stop="deleteImage(image.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        
        <div class="card-image">
          <img :src="image.thumbnail" :alt="image.bodyPart" />
          <div class="image-overlay">
            <el-button type="primary" text @click.stop="viewImageDetail(image)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
          </div>
        </div>
        
        <div class="card-content">
          <h4 class="image-title">{{ image.bodyPart }}影像</h4>
          <p class="image-description">{{ image.description }}</p>
          <div class="image-meta">
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(image.uploadTime) }}
            </span>
            <span class="meta-item">
              <el-icon><Document /></el-icon>
              {{ image.size }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredImages.length === 0" class="empty-state">
      <el-empty description="暂无影像资料">
        <el-button type="primary" @click="showUploadDialog = true">上传影像</el-button>
      </el-empty>
    </div>

    <!-- 上传对话框 -->
    <!-- 暂时注释掉不存在的组件 -->
    <!-- <ImageUploadDialog 
      v-model="showUploadDialog"
      @upload-success="handleUploadSuccess"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
//import { Plus, Search, Download, Delete, View, Calendar, Document } from '@element-plus/icons-vue'

interface MedicalImage {
  id: string
  bodyPart: string
  type: string
  thumbnail: string
  originalUrl: string
  description: string
  uploadTime: string
  size: string
  diagnosis?: string
}

const showUploadDialog = ref(false)
const searchQuery = ref('')
const filterBodyPart = ref('')
const filterType = ref('')
// 修复：使用更明确的类型定义
const dateRange = ref<Date[]>([])

const imageStats = reactive({
  total: 15,
  thisMonth: 3,
  totalSize: '156 MB'
})

// 模拟影像数据
const medicalImages = ref<MedicalImage[]>([
  {
    id: 'IMG001',
    bodyPart: '膝关节',
    type: 'xray',
    thumbnail: 'https://via.placeholder.com/200x150?text=Knee+X-Ray',
    originalUrl: 'https://via.placeholder.com/800x600?text=Knee+X-Ray',
    description: '右膝关节正侧位X光片',
    uploadTime: '2024-01-15T10:30:00',
    size: '2.3 MB',
    diagnosis: '膝关节骨关节炎'
  },
  {
    id: 'IMG002',
    bodyPart: '腰椎',
    type: 'mri',
    thumbnail: 'https://via.placeholder.com/200x150?text=Spine+MRI',
    originalUrl: 'https://via.placeholder.com/800x600?text=Spine+MRI',
    description: '腰椎MRI平扫',
    uploadTime: '2024-01-10T14:20:00',
    size: '15.6 MB',
    diagnosis: '腰椎间盘突出'
  },
  {
    id: 'IMG003',
    bodyPart: '肩关节',
    type: 'ct',
    thumbnail: 'https://via.placeholder.com/200x150?text=Shoulder+CT',
    originalUrl: 'https://via.placeholder.com/800x600?text=Shoulder+CT',
    description: '左肩关节CT三维重建',
    uploadTime: '2024-01-18T09:15:00',
    size: '8.7 MB'
  }
])

const filteredImages = computed(() => {
  let images = medicalImages.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    images = images.filter(image =>
      image.bodyPart.toLowerCase().includes(query) ||
      image.description.toLowerCase().includes(query) ||
      image.diagnosis?.toLowerCase().includes(query)
    )
  }
  
  if (filterBodyPart.value) {
    images = images.filter(image => image.bodyPart === filterBodyPart.value)
  }
  
  if (filterType.value) {
    images = images.filter(image => image.type === filterType.value)
  }
  
  // 修复：安全的日期范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const start = dateRange.value[0]
    const end = dateRange.value[1]
    images = images.filter(image => {
      const uploadTime = new Date(image.uploadTime)
      return uploadTime >= start && uploadTime <= end
    })
  }
  
  return images
})


const getImageTypeColor = (type: string) => {
  const colorMap = {
    xray: 'primary',
    ct: 'success',
    mri: 'warning',
    ultrasound: 'info'
  }
  return colorMap[type as keyof typeof colorMap] || 'info'
}

const getImageTypeText = (type: string) => {
  const textMap = {
    xray: 'X光',
    ct: 'CT',
    mri: 'MRI',
    ultrasound: '超声'
  }
  return textMap[type as keyof typeof textMap] || '其他'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const viewImageDetail = (image: MedicalImage) => {
  ElMessage.info(`查看影像详情: ${image.id}`)
  // 这里可以打开影像查看器或跳转到详情页面
}

const downloadImage = (image: MedicalImage) => {
  ElMessage.success(`开始下载 ${image.bodyPart} 影像`)
  // 这里实现下载逻辑
}

const deleteImage = async (imageId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个影像吗？此操作不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = medicalImages.value.findIndex(img => img.id === imageId)
    if (index > -1) {
      medicalImages.value.splice(index, 1)
      imageStats.total--
      ElMessage.success('影像删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const handleUploadSuccess = (newImage: MedicalImage) => {
  medicalImages.value.unshift(newImage)
  imageStats.total++
  imageStats.thisMonth++
  showUploadDialog.value = false
  ElMessage.success('影像上传成功')
}
</script>

<style scoped>
.my-images {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.image-stats {
  margin-bottom: 24px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.image-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.image-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.image-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.card-content {
  padding: 16px;
}

.image-title {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.image-description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.image-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-state {
  margin-top: 60px;
}
</style>