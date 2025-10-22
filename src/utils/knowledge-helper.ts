import { KnowledgeItem } from '@/types'

/**
 * 搜索知识库项（支持多字段匹配）
 */
export const searchKnowledge = (
  items: KnowledgeItem[], 
  query: string, 
  category: string, 
  tags: string[]
): KnowledgeItem[] => {
  if (!query && category === 'all' && tags.length === 0) return items

  return items.filter(item => {
    // 分类过滤
    if (category !== 'all' && item.category !== category) return false
    
    // 标签过滤
    if (tags.length > 0 && !tags.some(tag => item.tags.includes(tag))) return false
    
    // 关键词搜索（多字段匹配）
    if (query) {
      const lowerQuery = query.toLowerCase()
      const matchTitle = item.title.toLowerCase().includes(lowerQuery)
      const matchDesc = item.description.toLowerCase().includes(lowerQuery)
      const matchSymptom = item.symptoms.some(s => s.toLowerCase().includes(lowerQuery))
      const matchCriteria = item.diagnosisCriteria.some(c => 
        c.title.toLowerCase().includes(lowerQuery) || 
        c.description.toLowerCase().includes(lowerQuery)
      )
      if (!matchTitle && !matchDesc && !matchSymptom && !matchCriteria) return false
    }
    
    return true
  })
}

/**
 * 排序知识库项
 */
export const sortKnowledge = (
  items: KnowledgeItem[], 
  sortBy: string
): KnowledgeItem[] => {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
      case 'views':
        return b.viewCount - a.viewCount
      case 'relevance':
      default:
        // 相关性排序可根据实际业务实现（如匹配度评分）
        return 0
    }
  })
}