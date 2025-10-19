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

        <div class="knowledge-list">
          <div
            v-for="item in filteredKnowledge"
            :key="item.id"
            class="knowledge-item"
            @click="viewDetail(item)"
          >
            <div class="item-header">
              <h4 class="item-title">{{ item.title }}</h4>
              <el-tag v-if="item.isNew" type="danger" size="small">最新</el-tag>
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
        <div class="pagination">
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
          <el-button link @click="selectedItem = null">
            <el-icon><Close /></el-icon>
          </el-button>
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
              <el-tabs v-model="activeTreatmentTab">
                <el-tab-pane label="药物治疗" name="medication">
                  <div class="treatment-content">
                    <h5>常用药物</h5>
                    <ul>
                      <li v-for="drug in selectedItem.treatments.medication" :key="drug">
                        {{ drug }}
                      </li>
                    </ul>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="物理治疗" name="physical">
                  <div class="treatment-content">
                    <h5>物理疗法</h5>
                    <ul>
                      <li v-for="therapy in selectedItem.treatments.physical" :key="therapy">
                        {{ therapy }}
                      </li>
                    </ul>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="手术治疗" name="surgical">
                  <div class="treatment-content">
                    <h5>手术选项</h5>
                    <ul>
                      <li v-for="surgery in selectedItem.treatments.surgical" :key="surgery">
                        {{ surgery }}
                      </li>
                    </ul>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, Folder, View, Close, Check } from '@element-plus/icons-vue'

interface KnowledgeItem {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  overview: string
  symptoms: string[]
  diagnosisCriteria: Array<{
    title: string
    description: string
  }>
  treatments: {
    medication: string[]
    physical: string[]
    surgical: string[]
  }
  preventionTips: string[]
  viewCount: number
  updateTime: string
  isNew: boolean
}

const searchQuery = ref('')
const activeCategory = ref('all')
const selectedTags = ref<string[]>([])
const sortBy = ref('relevance')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedItem = ref<KnowledgeItem | null>(null)
const activeTreatmentTab = ref('medication')

const diseaseCategories = [
  { id: 'all', name: '全部疾病', count: 156 },
  { id: 'arthritis', name: '关节炎', count: 34 },
  { id: 'fracture', name: '骨折', count: 28 },
  { id: 'osteoporosis', name: '骨质疏松', count: 22 },
  { id: 'disc', name: '椎间盘疾病', count: 19 },
  { id: 'tumor', name: '骨肿瘤', count: 15 },
  { id: 'infection', name: '骨感染', count: 12 },
  { id: 'metabolic', name: '代谢性骨病', count: 10 },
  { id: 'congenital', name: '先天性骨病', count: 8 },
  { id: 'other', name: '其他', count: 8 }
]

const hotTags = [
  '膝关节', '腰椎', '骨质疏松', '关节炎', '骨折',
  '康复治疗', '手术治疗', '药物治疗', '预防', '诊断标准'
]

// 模拟知识库数据
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
      '保持适当体重',
      '规律进行低冲击运动',
      '避免关节过度负荷',
      '注意关节保暖',
      '定期进行关节检查'
    ],
    viewCount: 1245,
    updateTime: '2024-01-10T14:30:00',
    isNew: true
  },
  {
    id: '2',
    title: '骨质疏松症的诊断与防治',
    description: '全面介绍骨质疏松症的发病机制、风险评估、诊断方法和预防治疗策略。',
    category: '骨质疏松',
    tags: ['骨质疏松', '骨折风险', '骨密度', '预防'],
    overview: '骨质疏松症是以骨量减少、骨微结构破坏为特征的全身性骨骼疾病，导致骨脆性增加和骨折风险增高。',
    symptoms: [
      '通常无症状，直到发生骨折',
      '身高变矮',
      '脊柱后凸',
      '背痛'
    ],
    diagnosisCriteria: [
      {
        title: '骨密度诊断',
        description: '双能X线吸收测定法（DXA）T值≤-2.5'
      },
      {
        title: '骨折风险评估',
        description: 'FRAX工具评估10年主要骨质疏松性骨折风险'
      }
    ],
    treatments: {
      medication: [
        '双膦酸盐类药物',
        '选择性雌激素受体调节剂',
        '甲状旁腺激素类似物',
        'RANK配体抑制剂'
      ],
      physical: [
        '负重运动',
        '平衡训练',
        '营养补充（钙和维生素D）'
      ],
      surgical: [
        '椎体成形术',
        '后凸成形术',
        '骨折内固定术'
      ]
    },
    preventionTips: [
      '保证充足的钙和维生素D摄入',
      '规律进行负重运动',
      '避免吸烟和过量饮酒',
      '预防跌倒',
      '定期骨密度检查'
    ],
    viewCount: 892,
    updateTime: '2024-01-08T09:15:00',
    isNew: false
  }
]

const currentCategoryName = computed(() => {
  const category = diseaseCategories.find(c => c.id === activeCategory.value)
  return category ? category.name : '全部'
})

const filteredKnowledge = computed(() => {
  let items = knowledgeItems
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    items = items.filter(item => 
      item.category === currentCategoryName.value
    )
  }
  
  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 按标签筛选
  if (selectedTags.value.length > 0) {
    items = items.filter(item =>
      selectedTags.value.every(tag => item.tags.includes(tag))
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'date':
      items.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
      break
    case 'views':
      items.sort((a, b) => b.viewCount - a.viewCount)
      break
    case 'relevance':
    default:
      // 默认按更新时间倒序
      items.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
  }
  
  return items
})

const totalItems = computed(() => filteredKnowledge.value.length)

const handleSearch = () => {
  currentPage.value = 1
}

const handleCategorySelect = (categoryId: string) => {
  activeCategory.value = categoryId
  currentPage.value = 1
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
}

const viewDetail = (item: KnowledgeItem) => {
  selectedItem.value = item
  // 增加查看次数
  item.viewCount++
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  // 可以在这里加载真实数据
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
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.knowledge-list {
  flex: 1;
  overflow-y: auto;
}

.knowledge-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  border-left: 4px solid #409eff;
}

.knowledge-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.item-title {
  margin: 0;
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.item-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.item-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.item-meta .category {
  color: #409eff;
  font-weight: bold;
}

.item-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.detail-sidebar {
  width: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px 8px 0 0;
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
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.update-time {
  font-size: 12px;
  color: #999;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  color: #409eff;
  margin-bottom: 10px;
  border-left: 3px solid #409eff;
  padding-left: 8px;
}

.detail-section h5 {
  color: #333;
  margin: 10px 0 5px 0;
}

.detail-section p {
  line-height: 1.6;
  margin: 0;
}

.detail-section ul {
  margin: 0;
  padding-left: 20px;
}

.detail-section li {
  line-height: 1.6;
  margin-bottom: 5px;
}

.criteria {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.criterion-item {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border-left: 3px solid #67c23a;
}

.treatment-content {
  padding: 10px 0;
}

.prevention-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.tip-item .el-icon {
  color: #67c23a;
}
</style>