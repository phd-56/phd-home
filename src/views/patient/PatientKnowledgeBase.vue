<template>
  <div class="patient-knowledge-base">
    <div class="page-header">
      <h1>健康知识库</h1>
      <p>获取专业的医学健康知识，了解更多健康资讯</p>
    </div>

    <el-card>
      <template #header>
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索健康知识..."
            clearable
            @keyup.enter="searchKnowledge"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" @click="searchKnowledge">搜索</el-button>
            </template>
          </el-input>
        </div>
      </template>

      <!-- 分类导航 -->
      <div class="category-nav">
        <el-scrollbar wrap-class="scroll-wrapper">
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-name">{{ category.name }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 热门标签 -->
      <div class="hot-tags">
        <span class="tags-title">热门标签：</span>
        <el-tag
          v-for="tag in hotTags"
          :key="tag"
          size="small"
          effect="plain"
          @click="searchByTag(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>

      <!-- 知识内容区域 -->
      <div v-loading="loading" class="knowledge-content">
        <div v-if="knowledgeList.length > 0" class="knowledge-list">
          <el-card
            v-for="item in pagedKnowledgeList"
            :key="item.id"
            class="knowledge-item"
            @click="viewKnowledgeDetail(item)"
          >
            <template #header>
              <div class="item-header">
                <h3 class="item-title">{{ item.title }}</h3>
                <span class="item-category">{{ getCategoryName(item.categoryId) }}</span>
              </div>
            </template>
            <div class="item-content">
              <div class="item-summary">{{ item.summary }}</div>
              <div class="item-meta">
                <span class="item-author">作者：{{ item.author }}</span>
                <span class="item-date">{{ formatDate(item.publishDate) }}</span>
                <span class="item-views"><View />&nbsp;{{ item.viewCount }}</span>
                <span class="item-likes"><Star />&nbsp;{{ item.likeCount }}</span>
              </div>
            </div>
          </el-card>
        </div>
        
        <div v-else-if="!loading" class="empty-state">
          <el-empty description="暂无相关知识内容" />
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="knowledgeList.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="knowledgeList.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 知识详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      :title="selectedKnowledge?.title || '知识详情'"
      width="80%"
      destroy-on-close
      class="knowledge-detail-dialog"
    >
      <div v-if="selectedKnowledge" class="knowledge-detail-content">
        <div class="detail-header">
          <div class="detail-meta">
            <span class="detail-category">{{ getCategoryName(selectedKnowledge.categoryId) }}</span>
            <span class="detail-date">{{ formatDate(selectedKnowledge.publishDate) }}</span>
            <span class="detail-author">作者：{{ selectedKnowledge.author }}</span>
          </div>
          <div class="detail-stats">
            <span class="detail-views"><View />&nbsp;{{ selectedKnowledge.viewCount }}</span>
            <span class="detail-likes" @click="likeKnowledge"><Star :fill="isLiked ? '#f56c6c' : 'none'" />&nbsp;{{ selectedKnowledge.likeCount }}</span>
          </div>
        </div>
        <div class="detail-body" v-html="selectedKnowledge.content"></div>
        <div class="detail-tags">
          <el-tag
            v-for="tag in selectedKnowledge.tags"
            :key="tag"
            size="small"
            effect="plain"
            @click="searchByTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
//import { Search, View, Star } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const detailVisible = ref(false)
const selectedKnowledge = ref<any>(null)
const isLiked = ref(false)

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: '🏥' },
  { id: 'disease', name: '疾病知识', icon: '📋' },
  { id: 'treatment', name: '治疗方法', icon: '💊' },
  { id: 'prevention', name: '预防保健', icon: '🛡️' },
  { id: 'nutrition', name: '营养健康', icon: '🥗' },
  { id: 'exercise', name: '运动健身', icon: '🏃' },
  { id: 'mental', name: '心理健康', icon: '🧠' },
  { id: 'medical', name: '医学前沿', icon: '🔬' }
])

// 热门标签
const hotTags = ref([
  '高血压', '糖尿病', '心脏病', '防癌', '急救', '中医养生', '疫苗接种',
  '合理用药', '睡眠健康', '儿童保健', '老年健康', '女性健康', '男性健康'
])

// 模拟知识数据
const knowledgeList = ref([
  {
    id: '1',
    title: '高血压患者的日常饮食管理',
    categoryId: 'disease',
    summary: '本文详细介绍了高血压患者的饮食原则，包括低盐饮食、控制热量摄入、增加蔬果摄入等方面的建议...',
    content: `<p>高血压是一种常见的慢性疾病，饮食管理是控制血压的重要手段。以下是高血压患者的饮食建议：</p>
    <h4>1. 低盐饮食</h4>
    <p>世界卫生组织建议每人每天盐摄入量不超过5克。高血压患者应特别注意减少食盐的摄入，避免食用腌制食品、加工食品等高盐食物。</p>
    <h4>2. 均衡膳食</h4>
    <p>增加新鲜蔬菜和水果的摄入，每天应摄入500克以上的蔬菜和200-350克的水果。选择全谷物、低脂乳制品、瘦肉、鱼类等。</p>
    <h4>3. 控制总热量</h4>
    <p>保持健康体重，避免肥胖。计算并控制每日总热量摄入，适当增加运动量。</p>
    <h4>4. 限制饮酒</h4>
    <p>尽量不饮酒，如必须饮酒，应限制量。男性每日酒精摄入量不超过25克，女性不超过15克。</p>
    <h4>5. 补充钾、钙、镁</h4>
    <p>增加富含钾、钙、镁的食物摄入，如香蕉、橙子、牛奶、坚果等。</p>`,
    author: '张医生',
    publishDate: '2024-06-20T08:30:00',
    viewCount: 1568,
    likeCount: 230,
    tags: ['高血压', '饮食管理', '慢性病']
  },
  {
    id: '2',
    title: '日常运动对心脏健康的重要性',
    categoryId: 'exercise',
    summary: '适量的运动有助于增强心肺功能，降低心血管疾病风险。本文介绍了适合不同人群的运动方式和注意事项...',
    content: `<p>运动对心脏健康的益处已被多项研究证实。适量的运动可以：</p>
    <ul>
      <li>增强心肌收缩力</li>
      <li>降低血压</li>
      <li>改善血脂水平</li>
      <li>减轻体重</li>
      <li>降低心血管疾病风险</li>
    </ul>
    <h4>适合的运动类型</h4>
    <p>有氧运动是对心脏最有益的运动类型，如快走、慢跑、游泳、骑自行车等。建议每周至少进行150分钟中等强度的有氧运动。</p>
    <h4>运动强度控制</h4>
    <p>运动时应注意控制强度，可以通过心率来监测：</p>
    <p>中等强度运动：心率=（220-年龄）×（60%-70%）</p>
    <p>高强度运动：心率=（220-年龄）×（70%-85%）</p>
    <h4>注意事项</h4>
    <p>运动前应进行热身，运动后进行拉伸。如有心脏病史或其他慢性疾病，应在医生指导下进行运动。</p>`,
    author: '李医生',
    publishDate: '2024-06-15T10:20:00',
    viewCount: 2134,
    likeCount: 328,
    tags: ['运动', '心脏健康', '预防保健']
  },
  {
    id: '3',
    title: '中医养生：四季养生要点',
    categoryId: 'prevention',
    summary: '中医认为人与自然是一个整体，不同季节有不同的养生重点。本文介绍了春、夏、秋、冬四季的养生方法...',
    content: `<h4>春季养生</h4>
    <p>春季阳气升发，养生重点是：</p>
    <ul>
      <li>早睡早起，顺应自然</li>
      <li>适量增加户外活动，吸收阳气</li>
      <li>饮食宜温补，可食用春笋、荠菜等时令蔬菜</li>
      <li>注意保持情绪舒畅，避免肝气郁结</li>
    </ul>
    <h4>夏季养生</h4>
    <p>夏季阳气旺盛，养生重点是：</p>
    <ul>
      <li>作息规律，适当午休</li>
      <li>注意防暑降温，避免长时间在烈日下活动</li>
      <li>饮食宜清淡，多吃清热祛湿的食物</li>
      <li>避免过度贪凉，保护阳气</li>
    </ul>
    <h4>秋季养生</h4>
    <p>秋季阳气收敛，养生重点是：</p>
    <ul>
      <li>早睡早起，顺应收敛之势</li>
      <li>注意防燥润肺，多喝水，多吃梨、百合等润肺食物</li>
      <li>适当增加锻炼，提高免疫力</li>
      <li>保持情绪稳定，避免悲秋情绪</li>
    </ul>
    <h4>冬季养生</h4>
    <p>冬季阳气潜藏，养生重点是：</p>
    <ul>
      <li>早睡晚起，顺应潜藏之势</li>
      <li>注意保暖，尤其是背部和脚部</li>
      <li>饮食宜温补，可适当食用羊肉、栗子等温补食物</li>
      <li>适当减少户外活动，保存阳气</li>
    </ul>`,
    author: '王中医',
    publishDate: '2024-06-10T14:15:00',
    viewCount: 1876,
    likeCount: 290,
    tags: ['中医养生', '四季养生', '保健']
  }
])

// 分页后的知识列表
const pagedKnowledgeList = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filterKnowledgeList.value.slice(start, end)
})

// 根据搜索条件和分类过滤知识
const filterKnowledgeList = computed(() => {
  let result = [...knowledgeList.value]
  
  // 根据分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(item => item.categoryId === selectedCategory.value)
  }
  
  // 根据搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 按发布日期降序排列
  result.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  
  return result
})

// 加载知识数据
const loadKnowledge = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 实际应用中这里会从服务器获取数据
    // knowledgeList.value = await api.getKnowledgeList(selectedCategory.value, searchQuery.value)
  } catch (error) {
    ElMessage.error('加载知识内容失败')
    console.error('加载知识失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索知识
const searchKnowledge = () => {
  pagination.currentPage = 1
  loadKnowledge()
}

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  pagination.currentPage = 1
  loadKnowledge()
}

// 按标签搜索
const searchByTag = (tag: string) => {
  searchQuery.value = tag
  pagination.currentPage = 1
  loadKnowledge()
}

// 查看知识详情
const viewKnowledgeDetail = (item: any) => {
  selectedKnowledge.value = item
  detailVisible.value = true
  // 更新浏览次数
  item.viewCount++
  // 重置点赞状态
  isLiked.value = false
}

// 点赞
const likeKnowledge = () => {
  if (!isLiked.value) {
    selectedKnowledge.value.likeCount++
    isLiked.value = true
    ElMessage.success('点赞成功')
  } else {
    selectedKnowledge.value.likeCount--
    isLiked.value = false
    ElMessage.info('取消点赞')
  }
}

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未知分类'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
}

// 返回患者工作台
const goBack = () => {
  router.push('/dashboard/patient')
}

// 组件挂载时加载数据
onMounted(() => {
  loadKnowledge()
})
</script>

<style scoped>
.patient-knowledge-base {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #1890ff;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  margin: 0;
}

.search-section {
  margin-bottom: 20px;
}

.search-section .el-input {
  width: 100%;
  max-width: 600px;
}

/* 分类导航 */
.category-nav {
  margin-bottom: 20px;
}

.scroll-wrapper {
  max-width: 100%;
}

.category-list {
  display: flex;
  gap: 15px;
  padding: 10px 0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f5f7fa;
  min-width: 80px;
}

.category-item:hover {
  background: #e6f7ff;
  transform: translateY(-2px);
}

.category-item.active {
  background: #1890ff;
  color: white;
}

.category-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.category-name {
  font-size: 14px;
  text-align: center;
}

/* 热门标签 */
.hot-tags {
  margin-bottom: 25px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tags-title {
  font-weight: 500;
  margin-right: 10px;
  color: #333;
}

.hot-tags .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.hot-tags .el-tag:hover {
  transform: scale(1.05);
}

/* 知识列表 */
.knowledge-content {
  margin-bottom: 20px;
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.knowledge-item {
  cursor: pointer;
  transition: all 0.3s;
}

.knowledge-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.item-category {
  padding: 4px 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
}

.item-content {
  line-height: 1.8;
}

.item-summary {
  color: #666;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 分页 */
.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

/* 详情对话框 */
.knowledge-detail-dialog .el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}

.knowledge-detail-content {
  line-height: 1.8;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.detail-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.detail-category {
  padding: 4px 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
}

.detail-stats {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.detail-stats span {
  cursor: pointer;
  transition: color 0.3s;
}

.detail-stats span:hover {
  color: #f56c6c;
}

.detail-body {
  color: #333;
  margin-bottom: 20px;
}

.detail-body h4 {
  color: #1890ff;
  margin-top: 20px;
  margin-bottom: 10px;
}

.detail-body p {
  margin-bottom: 10px;
}

.detail-body ul,
.detail-body ol {
  margin-bottom: 10px;
  padding-left: 20px;
}

.detail-tags {
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-tags .el-tag {
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .patient-knowledge-base {
    padding: 10px;
  }
  
  .category-list {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .category-item {
    min-width: auto;
    flex: 1;
    min-width: 60px;
  }
  
  .hot-tags {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .item-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .detail-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>