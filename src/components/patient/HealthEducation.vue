<template>
  <div class="health-education">
    <div class="page-header">
      <h2>健康教育</h2>
      <p class="page-subtitle">了解疾病知识，掌握健康生活方式</p>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <el-menu
        :default-active="activeCategory"
        mode="horizontal"
        @select="handleCategorySelect"
      >
        <el-menu-item index="all">全部</el-menu-item>
        <el-menu-item index="arthritis">关节炎</el-menu-item>
        <el-menu-item index="osteoporosis">骨质疏松</el-menu-item>
        <el-menu-item index="fracture">骨折康复</el-menu-item>
        <el-menu-item index="lifestyle">生活方式</el-menu-item>
        <el-menu-item index="prevention">疾病预防</el-menu-item>
      </el-menu>
    </div>

    <!-- 精选内容 -->
    <div class="featured-section" v-if="activeCategory === 'all'">
      <h3 class="section-title">精选内容</h3>
      <div class="featured-grid">
        <div
          v-for="article in featuredArticles"
          :key="article.id"
          class="featured-card"
          @click="viewArticle(article)"
        >
          <div class="card-image">
            <img :src="article.coverImage" :alt="article.title" />
            <div class="card-badge">精选</div>
          </div>
          <div class="card-content">
            <h4 class="card-title">{{ article.title }}</h4>
            <p class="card-description">{{ article.description }}</p>
            <div class="card-meta">
              <span class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ article.readingTime }}分钟阅读
              </span>
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ article.viewCount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容网格 -->
    <div class="content-grid">
      <div class="grid-header">
        <h3 class="section-title">{{ categoryTitle }}知识</h3>
        <div class="grid-sort">
          <el-radio-group v-model="sortBy" size="small">
            <el-radio-button label="latest">最新</el-radio-button>
            <el-radio-button label="popular">热门</el-radio-button>
            <el-radio-button label="recommend">推荐</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="articles-grid">
        <div
          v-for="article in sortedArticles"
          :key="article.id"
          class="article-card"
          @click="viewArticle(article)"
        >
          <div class="article-image">
            <img :src="article.coverImage" :alt="article.title" />
          </div>
          <div class="article-content">
            <div class="article-category">
              <el-tag size="small">{{ article.category }}</el-tag>
            </div>
            <h4 class="article-title">{{ article.title }}</h4>
            <p class="article-description">{{ article.description }}</p>
            <div class="article-meta">
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(article.publishTime) }}
              </span>
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ article.viewCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="sortedArticles.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalArticles"
          layout="total, prev, pager, next"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="sortedArticles.length === 0" class="empty-state">
        <el-empty :description="`暂无${categoryTitle}相关内容`" />
      </div>
    </div>

    <!-- 文章详情对话框 -->
    <el-dialog
      v-model="showArticleDialog"
      :title="selectedArticle?.title"
      width="80%"
      top="5vh"
    >
      <ArticleDetail 
        v-if="selectedArticle"
        :article="selectedArticle"
        @close="showArticleDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Clock, View, Calendar } from '@element-plus/icons-vue'
import ArticleDetail from './components/ArticleDetail.vue'

interface HealthArticle {
  id: string
  title: string
  description: string
  content: string
  category: string
  coverImage: string
  publishTime: string
  readingTime: number
  viewCount: number
  isFeatured: boolean
  tags: string[]
}

const activeCategory = ref('all')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(12)
const showArticleDialog = ref(false)
const selectedArticle = ref<HealthArticle | null>(null)

// 模拟健康教育文章数据
const healthArticles = ref<HealthArticle[]>([
  {
    id: 'ART001',
    title: '膝关节骨关节炎的日常护理指南',
    description: '详细介绍膝关节骨关节炎患者的日常护理方法，包括运动、饮食和生活习惯的调整。',
    content: '完整的文章内容...',
    category: '关节炎',
    coverImage: 'https://via.placeholder.com/300x200?text=Knee+Care',
    publishTime: '2024-01-15T10:30:00',
    readingTime: 8,
    viewCount: 1245,
    isFeatured: true,
    tags: ['膝关节', '骨关节炎', '护理', '康复']
  },
  {
    id: 'ART002',
    title: '预防骨质疏松的饮食建议',
    description: '了解哪些食物有助于骨骼健康，如何通过饮食预防骨质疏松症。',
    content: '完整的文章内容...',
    category: '骨质疏松',
    coverImage: 'https://via.placeholder.com/300x200?text=Osteoporosis+Diet',
    publishTime: '2024-01-12T14:20:00',
    readingTime: 6,
    viewCount: 892,
    isFeatured: true,
    tags: ['骨质疏松', '饮食', '预防', '营养']
  },
  {
    id: 'ART003',
    title: '骨折后的康复训练计划',
    description: '针对不同部位骨折的康复训练方案，帮助患者尽快恢复功能。',
    content: '完整的文章内容...',
    category: '骨折康复',
    coverImage: 'https://via.placeholder.com/300x200?text=Fracture+Rehab',
    publishTime: '2024-01-10T09:15:00',
    readingTime: 10,
    viewCount: 756,
    isFeatured: false,
    tags: ['骨折', '康复', '训练', '物理治疗']
  }
])

const categoryTitle = computed(() => {
  const categoryMap = {
    all: '全部',
    arthritis: '关节炎',
    osteoporosis: '骨质疏松',
    fracture: '骨折康复',
    lifestyle: '生活方式',
    prevention: '疾病预防'
  }
  return categoryMap[activeCategory.value as keyof typeof categoryMap] || '全部'
})

const featuredArticles = computed(() => {
  return healthArticles.value.filter(article => article.isFeatured)
})

const filteredArticles = computed(() => {
  if (activeCategory.value === 'all') {
    return healthArticles.value
  }
  return healthArticles.value.filter(article => 
    article.category === categoryTitle.value
  )
})

const sortedArticles = computed(() => {
  let articles = [...filteredArticles.value]
  
  switch (sortBy.value) {
    case 'latest':
      articles.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())
      break
    case 'popular':
      articles.sort((a, b) => b.viewCount - a.viewCount)
      break
    case 'recommend':
      articles.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.viewCount - a.viewCount)
      break
  }
  
  return articles
})

const totalArticles = computed(() => sortedArticles.value.length)

const handleCategorySelect = (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
}

const viewArticle = (article: HealthArticle) => {
  selectedArticle.value = article
  showArticleDialog.value = true
  // 增加查看次数
  article.viewCount++
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.health-education {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 16px;
}

.category-nav {
  margin-bottom: 24px;
}

.category-nav .el-menu {
  border-bottom: 1px solid #e6e6e6;
}

.category-nav .el-menu-item {
  font-size: 16px;
}

.section-title {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
}

.featured-section {
  margin-bottom: 32px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.featured-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.featured-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f56c6c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.card-content {
  padding: 16px;
}

.card-title {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  line-height: 1.4;
}

.card-description {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
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

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.article-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.article-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.article-image {
  height: 160px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 16px;
}

.article-category {
  margin-bottom: 8px;
}

.article-title {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
}

.empty-state {
  margin-top: 60px;
}
</style>