<template>
  <div class="knowledge-base">
    <div class="base-header">
      <h2>医学知识库</h2>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索疾病、症状、治疗方案..."
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <div class="base-content">
      <!-- 左侧：分类导航 -->
      <div class="category-sidebar">
        <h3>疾病分类</h3>
        <el-menu
          :default-active="activeCategory"
          class="category-menu"
          @select="handleCategorySelect"
        >
          <el-menu-item
            v-for="category in diseaseCategories"
            :key="category.id"
            :index="category.id"
          >
            <el-icon><Folder /></el-icon>
            <span>{{ category.name }}</span>
            <span class="count">({{ category.count }})</span>
          </el-menu-item>
        </el-menu>

        <!-- 热门标签 -->
        <div class="hot-tags">
          <h4>热门标签</h4>
          <div class="tags-container">
            <el-tag
              v-for="tag in hotTags"
              :key="tag"
              class="tag"
              :type="selectedTags.includes(tag) ? 'primary' : 'info'"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 中间：知识内容 -->
      <div class="knowledge-main">
        <div class="content-header">
          <h3>{{ currentCategoryName }}知识</h3>
          <div class="sort-options">
            <el-radio-group v-model="sortBy" size="small">
              <el-radio-button label="relevance">相关性</el-radio-button>
              <el-radio-button label="date">最新</el-radio-button>
              <el-radio-button label="views">热度</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div v-if="loading" class="loading-container">
          <el-loading-spinner />
          <p>加载中...</p>
        </div>

        <div v-else-if="filteredKnowledge.length === 0" class="empty-state">
          <el-empty description="没有找到相关知识，请尝试其他搜索条件" />
        </div>

        <div v-else class="knowledge-list">
          <div
            v-for="item in filteredKnowledge"
            :key="item.id"
            class="knowledge-item"
            @click="viewDetail(item)"
          >
            <div class="item-header">
              <h4 class="item-title">{{ item.title }}</h4>
              <div class="item-actions">
                <el-tag v-if="item.isNew" type="danger" size="small">最新</el-tag>
                <el-button 
                  icon="Star" 
                  size="mini" 
                  :class="item.isFavorite ? 'favorited' : ''"
                  @click.stop="toggleFavorite(item)"
                />
              </div>
            </div>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-meta">
              <span class="category">{{ item.category }}</span>
              <span class="date">{{ formatDate(item.updateTime) }}</span>
              <span class="views">
                <el-icon><View /></el-icon>
                {{ item.viewCount }}
              </span>
            </div>
            <div class="item-tags">
              <el-tag
                v-for="tag in item.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="filteredKnowledge.length > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="totalItems"
            layout="total, prev, pager, next"
          />
        </div>
      </div>

      <!-- 右侧：知识详情 -->
      <div class="detail-sidebar" v-if="selectedItem">
        <div class="detail-header">
          <h3>{{ selectedItem.title }}</h3>
          <div class="detail-actions">
            <el-button 
              icon="Star" 
              size="small" 
              :class="selectedItem.isFavorite ? 'favorited' : ''"
              @click.stop="toggleFavorite(selectedItem)"
            />
            <el-button link @click="selectedItem = null">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
        
        <div class="detail-content">
          <div class="detail-meta">
            <el-tag type="primary">{{ selectedItem.category }}</el-tag>
            <span class="update-time">更新: {{ formatDate(selectedItem.updateTime) }}</span>
          </div>

          <div class="detail-body">
            <!-- 疾病概述 -->
            <div class="detail-section">
              <h4>疾病概述</h4>
              <p>{{ selectedItem.overview }}</p>
            </div>

            <!-- 临床表现 -->
            <div class="detail-section">
              <h4>临床表现</h4>
              <ul>
                <li v-for="symptom in selectedItem.symptoms" :key="symptom">
                  {{ symptom }}
                </li>
              </ul>
            </div>

            <!-- 诊断标准 -->
            <div class="detail-section">
              <h4>诊断标准</h4>
              <div class="criteria">
                <div
                  v-for="criterion in selectedItem.diagnosisCriteria"
                  :key="criterion.title"
                  class="criterion-item"
                >
                  <h5>{{ criterion.title }}</h5>
                  <p>{{ criterion.description }}</p>
                </div>
              </div>
            </div>

            <!-- 治疗方案 -->
            <div class="detail-section">
              <h4>治疗方案</h4>
              <el-tabs v-model="activeTab">
                <el-tab-pane label="药物治疗" name="medication">
                  <ul class="treatment-list" v-if="selectedItem.treatments.medication.length > 0">
                    <li v-for="med in selectedItem.treatments.medication" :key="med">
                      {{ med }}
                    </li>
                  </ul>
                  <div class="empty-state" v-else>
                    暂无药物治疗方案
                  </div>
                </el-tab-pane>
                <el-tab-pane label="物理治疗" name="physical">
                  <ul class="treatment-list" v-if="selectedItem.treatments.physical.length > 0">
                    <li v-for="phys in selectedItem.treatments.physical" :key="phys">
                      {{ phys }}
                    </li>
                  </ul>
                  <div class="empty-state" v-else>
                    暂无物理治疗方案
                  </div>
                </el-tab-pane>
                <el-tab-pane label="手术治疗" name="surgical">
                  <ul class="treatment-list" v-if="selectedItem.treatments.surgical.length > 0">
                    <li v-for="surgery in selectedItem.treatments.surgical" :key="surgery">
                      {{ surgery }}
                    </li>
                  </ul>
                  <div class="empty-state" v-else>
                    暂无手术治疗方案
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <!-- 预防建议 -->
            <div class="detail-section">
              <h4>预防建议</h4>
              <div class="prevention-tips">
                <div
                  v-for="tip in selectedItem.preventionTips"
                  :key="tip"
                  class="tip-item"
                >
                  <el-icon><Check /></el-icon>
                  <span>{{ tip }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <el-button 
          class="back-to-top" 
          icon="ArrowUp" 
          size="small"
          @click="scrollToTop"
          v-if="showBackToTop"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Search, Folder, View, Close, Check, Star, ArrowUp } from '@element-plus/icons-vue'
import { ElMessage, ElEmpty, ElLoading } from 'element-plus'
import { KnowledgeItem } from '@/types'

// 响应式数据
const searchQuery = ref('')
const activeCategory = ref('all')
const selectedTags = ref<string[]>([])
const sortBy = ref('relevance')
const loading = ref(false)
const selectedItem = ref<KnowledgeItem | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const activeTab = ref('medication')
const showBackToTop = ref(false)
let searchTimer: number | null = null

// 疾病分类
const diseaseCategories = [
  { id: 'all', name: '全部', count: 100 },
  { id: 'arthritis', name: '关节炎', count: 15 },
  { id: 'cardiovascular', name: '心血管疾病', count: 22 },
  { id: 'neurology', name: '神经系统疾病', count: 18 },
  { id: 'respiratory', name: '呼吸系统疾病', count: 16 },
  { id: 'gastrointestinal', name: '消化系统疾病', count: 14 },
  { id: 'endocrine', name: '内分泌疾病', count: 10 },
  { id: 'other', name: '其他疾病', count: 5 }
]

// 热门标签
const hotTags = [
  '高血压', '糖尿病', '肺炎', '骨折', '肿瘤', '感染',
  '心力衰竭', '脑卒中', '哮喘', '胃炎', '关节炎', '肾炎'
]

// 模拟数据
const knowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: '膝关节骨关节炎诊断与治疗指南',
    description: '详细介绍膝关节骨关节炎的临床表现、诊断标准和最新治疗方案，包括药物治疗、物理治疗和手术干预。',
    category: '关节炎',
    tags: ['膝关节', '骨关节炎', '诊断', '治疗'],
    overview: '膝关节骨关节炎是一种常见的退行性关节疾病，主要表现为关节软骨的进行性破坏和骨质增生。',
    symptoms: [
      '关节疼痛，活动后加重',
      '关节僵硬，尤其是晨僵',
      '关节活动受限',
      '关节肿胀',
      '关节摩擦感'
    ],
    diagnosisCriteria: [
      {
        title: '临床标准',
        description: '年龄≥50岁，膝关节疼痛，晨僵≤30分钟，活动时有骨摩擦音'
      },
      {
        title: '影像学标准',
        description: 'X线显示关节间隙变窄，软骨下骨硬化，骨赘形成'
      }
    ],
    treatments: {
      medication: [
        '非甾体抗炎药（NSAIDs）',
        '对乙酰氨基酚',
        '关节腔注射糖皮质激素',
        '透明质酸注射'
      ],
      physical: [
        '物理治疗和康复训练',
        '体重管理',
        '辅助器具使用',
        '运动疗法'
      ],
      surgical: [
        '关节镜清理术',
        '截骨术',
        '单髁置换术',
        '全膝关节置换术'
      ]
    },
    preventionTips: [
      '保持健康体重，减轻关节负担',
      '加强下肢肌肉锻炼，增强关节稳定性',
      '避免长时间站立和剧烈运动',
      '注意膝关节保暖',
      '适当补充钙剂和维生素D'
    ],
    updateTime: '2023-10-15',
    viewCount: 1254,
    isFavorite: false,
    isNew: true
  },
  {
    id: '2',
    title: '高血压诊断标准与治疗规范',
    description: '全面介绍高血压的定义、分级、诊断流程和药物治疗方案，以及生活方式干预建议。',
    category: '心血管疾病',
    tags: ['高血压', '诊断标准', '治疗', '心血管'],
    overview: '高血压是最常见的慢性病之一，也是心脑血管病最主要的危险因素。',
    symptoms: [
      '大多数患者无明显症状',
      '部分患者可能出现头痛、头晕',
      '心悸、胸闷',
      '视力模糊',
      '鼻出血'
    ],
    diagnosisCriteria: [
      {
        title: '诊断标准',
        description: '在未使用降压药物的情况下，非同日3次测量诊室血压，收缩压≥140mmHg和（或）舒张压≥90mmHg'
      },
      {
        title: '分级标准',
        description: '1级高血压：收缩压140-159mmHg和（或）舒张压90-99mmHg；2级高血压：收缩压≥160mmHg和（或）舒张压≥100mmHg'
      }
    ],
    treatments: {
      medication: [
        'ACEI类药物（如依那普利）',
        'ARB类药物（如缬沙坦）',
        '钙离子拮抗剂（如氨氯地平）',
        '利尿剂（如氢氯噻嗪）',
        'β受体阻滞剂（如美托洛尔）'
      ],
      physical: [
        '规律有氧运动，每周至少150分钟',
        '减轻体重，BMI控制在18.5-23.9',
        '戒烟限酒',
        '保持健康心态，减轻压力'
      ],
      surgical: []
    },
    preventionTips: [
      '减少钠盐摄入，每人每天不超过5g',
      '增加钾盐摄入，多吃新鲜蔬果',
      '控制脂肪摄入，尤其是饱和脂肪',
      '增加体育锻炼',
      '定期体检，监测血压'
    ],
    updateTime: '2023-09-20',
    viewCount: 2341,
    isFavorite: true,
    isNew: false
  }
]

// 计算属性：当前分类名称
const currentCategoryName = computed(() => {
  const category = diseaseCategories.find(c => c.id === activeCategory.value)
  return category ? category.name : '全部'
})

// 计算属性：过滤后的知识库项
const filteredKnowledge = computed(() => {
  let result = [...knowledgeItems]
  
  // 分类过滤
  if (activeCategory.value !== 'all') {
    const categoryName = diseaseCategories.find(c => c.id === activeCategory.value)?.name
    if (categoryName) {
      result = result.filter(item => item.category === categoryName)
    }
  }
  
  // 标签过滤
  if (selectedTags.value.length > 0) {
    result = result.filter(item => 
      selectedTags.value.every(tag => item.tags.includes(tag))
    )
  }
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'date':
      result.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
      break
    case 'views':
      result.sort((a, b) => b.viewCount - a.viewCount)
      break
    case 'relevance':
    default:
      // 简单的相关性排序，实际应用中可能需要更复杂的算法
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result.sort((a, b) => {
          const aScore = getRelevanceScore(a, query)
          const bScore = getRelevanceScore(b, query)
          return bScore - aScore
        })
      }
      break
  }
  
  // 分页处理
  const startIndex = (currentPage.value - 1) * pageSize.value
  return result.slice(startIndex, startIndex + pageSize.value)
})

// 计算总条目数
const totalItems = computed(() => {
  // 这里复用过滤逻辑来计算总数
  let result = [...knowledgeItems]
  
  if (activeCategory.value !== 'all') {
    const categoryName = diseaseCategories.find(c => c.id === activeCategory.value)?.name
    if (categoryName) {
      result = result.filter(item => item.category === categoryName)
    }
  }
  
  if (selectedTags.value.length > 0) {
    result = result.filter(item => 
      selectedTags.value.every(tag => item.tags.includes(tag))
    )
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  return result.length
})

// 计算相关性分数
const getRelevanceScore = (item: KnowledgeItem, query: string) => {
  let score = 0
  
  if (item.title.toLowerCase().includes(query)) {
    score += 3
  }
  
  if (item.description.toLowerCase().includes(query)) {
    score += 2
  }
  
  if (item.tags.some(tag => tag.toLowerCase().includes(query))) {
    score += 2
  }
  
  if (item.category.toLowerCase().includes(query)) {
    score += 1
  }
  
  return score
}

// 防抖处理搜索
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    loading.value = true
    // 模拟网络请求延迟
    setTimeout(() => {
      currentPage.value = 1
      loading.value = false
    }, 300)
  }, 300) as unknown as number
}

const handleCategorySelect = (categoryId: string) => {
  loading.value = true
  activeCategory.value = categoryId
  // 模拟网络请求延迟
  setTimeout(() => {
    currentPage.value = 1
    loading.value = false
  }, 300)
}

const toggleTag = (tag: string) => {
  loading.value = true
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  // 模拟网络请求延迟
  setTimeout(() => {
    currentPage.value = 1
    loading.value = false
  }, 300)
}

const viewDetail = (item: KnowledgeItem) => {
  loading.value = true
  // 模拟网络请求延迟
  setTimeout(() => {
    selectedItem.value = item
    // 增加查看次数
    item.viewCount++
    loading.value = false
  }, 300)
}

// 切换收藏状态
const toggleFavorite = (item: KnowledgeItem) => {
  item.isFavorite = !item.isFavorite
  ElMessage.success(item.isFavorite ? '已添加到收藏' : '已取消收藏')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 监听详情页滚动，控制回到顶部按钮显示
watch(selectedItem, (newVal) => {
  if (newVal) {
    const handleScroll = () => {
      const detailContent = document.querySelector('.detail-content')
      if (detailContent) {
        showBackToTop.value = (detailContent as HTMLElement).scrollTop > 300
      }
    }
    
    const detailContent = document.querySelector('.detail-content')
    if (detailContent) {
      detailContent.addEventListener('scroll', handleScroll)
      
      // 清理函数
      return () => {
        detailContent.removeEventListener('scroll', handleScroll)
      }
    }
  } else {
    showBackToTop.value = false
  }
})

// 滚动到顶部
const scrollToTop = () => {
  const detailContent = document.querySelector('.detail-content')
  if (detailContent) {
    (detailContent as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  // 模拟初始加载数据
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.knowledge-base {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.base-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  width: 400px;
}

.base-content {
  display: flex;
  flex: 1;
  gap: 20px;
  height: calc(100vh - 160px);
}

.category-sidebar {
  width: 250px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.category-menu {
  border: none;
  background: transparent;
  flex: 1;
}

.category-menu .el-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  margin-bottom: 5px;
  border-radius: 4px;
}

.count {
  font-size: 12px;
  color: #999;
}

.hot-tags {
  margin-top: 20px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  cursor: pointer;
}

.knowledge-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.knowledge-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.knowledge-item {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.knowledge-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.item-title {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-description {
  margin: 0 0 10px 0;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 10px;
}

.views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pagination {
  margin-top: 15px;
  align-self: flex-end;
}

.detail-sidebar {
  width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.detail-header {
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 12px;
  color: #6b7280;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-section h4::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: #409eff;
  border-radius: 2px;
}

.detail-section p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.detail-section ul {
  margin: 0;
  padding-left: 20px;
  color: #4b5563;
}

.detail-section li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.detail-section li:last-child {
  margin-bottom: 0;
}

.criteria {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.criterion-item h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.treatment-plan {
  padding: 16px 0;
}

.treatment-list {
  padding-left: 20px;
}

.treatment-list li {
  margin: 8px 0;
  line-height: 1.6;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #999;
  background-color: #f9fafb;
  border-radius: 4px;
}

.prevention-tips {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #4b5563;
  line-height: 1.6;
}

.tip-item .el-icon {
  margin-top: 4px;
  color: #10b981;
}

.back-to-top {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #409eff;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.back-to-top:hover {
  background: #66b1ff;
}

:deep(.el-button--icon-only.is-small) {
  width: 32px;
  height: 32px;
}

.favorited {
  color: #f56c6c;
}
</style>