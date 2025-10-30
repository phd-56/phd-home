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
          <el-icon><Loading /></el-icon>
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
                  size="small" 
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
//import { Search, Folder, View, Close, Check, Star, ArrowUp } from '@element-plus/icons-vue'
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
  { id: 'musculoskeletal', name: '肌肉骨骼疾病', count: 25 },
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
  },
  {
    id: '3',
    title: '腰椎间盘突出症的诊治与康复',
    description: '详细介绍腰椎间盘突出症的病因、临床表现、诊断方法和综合治疗方案，以及康复锻炼指导。',
    category: '肌肉骨骼疾病',
    tags: ['腰椎', '椎间盘突出', '腰痛', '康复', '神经压迫'],
    overview: '腰椎间盘突出症是指腰椎间盘发生退行性变后，在外力作用下，纤维环部分或全部破裂，髓核向外突出，刺激或压迫神经根、马尾神经所引起的一种综合征。',
    symptoms: [
      '腰痛，可放射至臀部和下肢',
      '下肢放射痛（坐骨神经痛）',
      '下肢麻木、无力',
      '腰部活动受限',
      '严重者可出现大小便功能障碍'
    ],
    diagnosisCriteria: [
      {
        title: '临床症状',
        description: '典型的腰痛伴下肢放射痛，咳嗽、喷嚏时加重'
      },
      {
        title: '体征',
        description: '腰椎侧凸，腰部活动受限，直腿抬高试验阳性，相应神经根支配区感觉、运动障碍'
      },
      {
        title: '影像学检查',
        description: 'CT或MRI显示椎间盘突出，压迫神经根或硬膜囊'
      }
    ],
    treatments: {
      medication: [
        '非甾体抗炎药（如布洛芬、塞来昔布）',
        '肌肉松弛剂（如乙哌立松）',
        '神经营养药物（如甲钴胺）',
        '糖皮质激素（短期使用）'
      ],
      physical: [
        '卧床休息（急性期）',
        '腰椎牵引',
        '物理因子治疗（中频、超短波等）',
        '核心肌群锻炼',
        '麦肯基疗法',
        '针灸、推拿治疗'
      ],
      surgical: [
        '微创椎间盘髓核摘除术',
        '椎间孔镜手术',
        '开放性椎间盘切除椎间融合术',
        '人工椎间盘置换术'
      ]
    },
    preventionTips: [
      '保持正确的坐姿和站姿，避免久坐久站',
      '加强腰背肌锻炼，如小燕飞、五点支撑等',
      '避免弯腰搬重物，如需搬运应屈膝下蹲',
      '控制体重，减轻腰椎负担',
      '选择合适的床垫，保持腰椎正常生理曲度'
    ],
    updateTime: '2023-11-05',
    viewCount: 1876,
    isFavorite: false,
    isNew: true
  },
  {
    id: '4',
    title: '肩关节周围炎（肩周炎）防治指南',
    description: '全面介绍肩周炎的发病机制、临床分期、诊断要点和治疗策略，包括保守治疗和手术治疗的适应症。',
    category: '肌肉骨骼疾病',
    tags: ['肩关节', '肩周炎', '冻结肩', '肩部疼痛', '活动受限'],
    overview: '肩关节周围炎，又称冻结肩、五十肩，是一种以肩关节疼痛和活动受限为主要特征的常见疾病，多发生于40-60岁人群，女性发病率略高于男性。',
    symptoms: [
      '肩关节疼痛，夜间加重',
      '肩关节主动和被动活动均受限',
      '肩部肌肉痉挛',
      '肩部肌肉萎缩（晚期）',
      '日常生活活动受限（如梳头、穿衣困难）'
    ],
    diagnosisCriteria: [
      {
        title: '临床表现',
        description: '肩关节疼痛持续加重，各方向活动受限，尤其是外旋受限明显'
      },
      {
        title: '影像学检查',
        description: 'X线检查多无异常，MRI可显示肩关节囊增厚、炎症改变'
      },
      {
        title: '鉴别诊断',
        description: '需排除肩袖损伤、肩峰下撞击综合征、肩关节脱位等疾病'
      }
    ],
    treatments: {
      medication: [
        '非甾体抗炎药（如塞来昔布、依托考昔）',
        '局部注射糖皮质激素',
        '外用止痛贴膏',
        '口服肌肉松弛剂'
      ],
      physical: [
        '早期镇痛治疗',
        '关节松动术',
        '循序渐进的主动和被动关节活动度训练',
        '物理因子治疗（超声波、激光等）',
        '中医治疗（针灸、推拿）'
      ],
      surgical: [
        '关节镜下肩关节松解术',
        '手法松解术（在麻醉下进行）',
        '开放性肩关节囊松解术'
      ]
    },
    preventionTips: [
      '避免肩部受凉和过度劳累',
      '加强肩部肌肉锻炼，如爬墙练习、钟摆运动',
      '保持正确的姿势，避免长时间固定姿势',
      '肩部急性损伤后及时治疗，避免发展为肩周炎',
      '定期进行肩部保健按摩和热疗'
    ],
    updateTime: '2023-10-28',
    viewCount: 1452,
    isFavorite: true,
    isNew: true
  },
  {
    id: '5',
    title: '骨质疏松症的诊断与防治',
    description: '详细介绍骨质疏松症的危险因素、诊断标准、药物治疗和非药物干预措施，以及骨折预防策略。',
    category: '肌肉骨骼疾病',
    tags: ['骨质疏松', '骨密度', '骨折风险', '钙剂', '维生素D'],
    overview: '骨质疏松症是一种以骨量低下、骨微结构破坏，导致骨脆性增加，易发生骨折为特征的全身性骨病。常见于绝经后女性和老年男性。',
    symptoms: [
      '多数患者早期无明显症状',
      '腰背疼痛或全身骨痛',
      '身高缩短、驼背',
      '易发生脆性骨折（如椎体压缩性骨折、髋部骨折、桡骨远端骨折）',
      '呼吸困难（严重脊柱变形时）'
    ],
    diagnosisCriteria: [
      {
        title: '骨密度检查',
        description: '双能X线吸收法（DXA）测量的骨密度T值≤-2.5即可诊断骨质疏松症'
      },
      {
        title: '脆性骨折',
        description: '发生脆性骨折（轻微外伤或日常活动中发生的骨折）即可诊断为严重骨质疏松症'
      },
      {
        title: '实验室检查',
        description: '血生化检查、骨代谢标志物等有助于病因诊断'
      }
    ],
    treatments: {
      medication: [
        '钙剂和维生素D补充',
        '双膦酸盐类药物（如阿仑膦酸钠、唑来膦酸）',
        '降钙素类药物',
        '甲状旁腺激素类似物',
        '雌激素替代治疗（适用于绝经后女性）',
        '选择性雌激素受体调节剂'
      ],
      physical: [
        '负重运动和抗阻训练',
        '平衡训练，预防跌倒',
        '物理因子治疗（脉冲电磁场等）',
        '营养支持，摄入足够的蛋白质'
      ],
      surgical: [
        '椎体成形术或后凸成形术（用于椎体压缩性骨折）',
        '骨折内固定术（用于髋部、腕部等骨折）'
      ]
    },
    preventionTips: [
      '摄入富含钙和维生素D的食物（如牛奶、鱼类、豆制品）',
      '适当晒太阳，促进维生素D合成',
      '规律运动，特别是负重运动',
      '避免吸烟和过量饮酒',
      '预防跌倒，改善家居环境安全性',
      '定期进行骨密度检查（特别是绝经后女性和50岁以上男性）'
    ],
    updateTime: '2023-11-10',
    viewCount: 2105,
    isFavorite: false,
    isNew: true
  },
  {
    id: '6',
    title: '骨折的分类、急救与治疗原则',
    description: '全面介绍骨折的分类方法、现场急救技术和临床治疗原则，包括保守治疗和手术治疗的选择依据。',
    category: '肌肉骨骼疾病',
    tags: ['骨折', '急救', '固定', '复位', '康复'],
    overview: '骨折是指骨的完整性或连续性中断，可由创伤、骨骼疾病等原因引起。正确的分类和及时有效的治疗对预后至关重要。',
    symptoms: [
      '局部疼痛、肿胀',
      '肢体畸形或反常活动',
      '骨擦音或骨擦感',
      '功能障碍',
      '严重者可出现休克、发热等全身症状'
    ],
    diagnosisCriteria: [
      {
        title: '外伤史',
        description: '有明确的外伤史或骨骼疾病史'
      },
      {
        title: '临床表现',
        description: '局部疼痛、肿胀、畸形、功能障碍等典型表现'
      },
      {
        title: '影像学检查',
        description: 'X线检查可明确骨折的部位、类型和移位情况，复杂骨折需CT或MRI检查'
      }
    ],
    treatments: {
      medication: [
        '止痛药（如对乙酰氨基酚、阿片类药物）',
        '抗生素（开放性骨折或术后预防感染）',
        '抗凝药物（下肢骨折预防深静脉血栓）',
        '促进骨折愈合药物'
      ],
      physical: [
        '手法复位和外固定（石膏、支具等）',
        '牵引治疗',
        '早期功能锻炼',
        '物理治疗（促进消肿、缓解疼痛）',
        '康复训练（恢复关节活动度和肌肉力量）'
      ],
      surgical: [
        '切开复位内固定术（钢板、螺钉、髓内钉等）',
        '闭合复位内固定术',
        '外固定架固定',
        '骨折不愈合或畸形愈合的手术治疗',
        '人工关节置换术（严重关节内骨折）'
      ]
    },
    preventionTips: [
      '加强安全意识，避免意外伤害',
      '儿童和老年人注意防跌倒',
      '进行体育活动前充分热身',
      '佩戴适当的防护装备',
      '积极治疗骨质疏松等骨骼疾病',
      '保持良好的肌肉力量和平衡能力'
    ],
    updateTime: '2023-10-20',
    viewCount: 1689,
    isFavorite: true,
    isNew: false
  },
  {
    id: '7',
    title: '肌腱炎与腱鞘炎的诊断与治疗',
    description: '详细介绍常见肌腱炎和腱鞘炎的病因、临床表现、诊断和治疗方法，包括药物治疗、物理治疗和手术治疗。',
    category: '肌肉骨骼疾病',
    tags: ['肌腱炎', '腱鞘炎', '网球肘', '鼠标手', '过度使用'],
    overview: '肌腱炎和腱鞘炎是由于肌肉过度使用、反复强烈牵拉引起的肌腱和腱鞘的炎症反应，常见于运动员、体力劳动者和长时间重复特定动作的人群。',
    symptoms: [
      '病变部位疼痛、压痛',
      '局部肿胀',
      '活动受限',
      '有时可触及结节',
      '活动时出现弹响或卡顿感（腱鞘炎）'
    ],
    diagnosisCriteria: [
      {
        title: '病史',
        description: '有过度使用或反复动作的病史'
      },
      {
        title: '临床表现',
        description: '病变部位疼痛、肿胀、活动受限，局部压痛明显'
      },
      {
        title: '影像学检查',
        description: '超声或MRI检查可显示肌腱增厚、炎症改变或腱鞘积液'
      },
      {
        title: '特殊检查',
        description: '如网球肘的Mill征、腕管综合征的Tinel征和Phalen试验'
      }
    ],
    treatments: {
      medication: [
        '非甾体抗炎药（如布洛芬、萘普生）',
        '局部注射糖皮质激素（封闭治疗）',
        '外用止痛贴膏或凝胶',
        '口服肌肉松弛剂'
      ],
      physical: [
        '休息和制动（急性期）',
        '冰敷（急性期）',
        '物理因子治疗（超声波、冲击波等）',
        '康复训练（肌肉拉伸、力量训练）',
        '支具固定',
        '针灸、推拿治疗'
      ],
      surgical: [
        '腱鞘切开减压术',
        '肌腱修复或重建术',
        '神经松解术（如腕管综合征）'
      ]
    },
    preventionTips: [
      '避免长时间重复同一动作',
      '工作和运动时保持正确姿势',
      '定期休息，进行适当的伸展运动',
      '加强相关肌肉的力量训练',
      '使用正确的工具和设备',
      '控制运动强度，循序渐进'
    ],
    updateTime: '2023-11-02',
    viewCount: 1357,
    isFavorite: false,
    isNew: true
  },
  {
    id: '8',
    title: '颈椎病诊断与治疗进展',
    description: '全面介绍颈椎病的分型、临床表现、诊断方法和最新治疗技术，包括保守治疗和手术治疗的适应症选择。',
    category: '肌肉骨骼疾病',
    tags: ['颈椎病', '颈椎间盘突出', '神经根型', '脊髓型', '颈椎牵引'],
    overview: '颈椎病是指颈椎间盘退行性变及其继发性椎间关节退行性变所致脊髓、神经、血管损害而表现的相应症状和体征，是中老年人的常见病、多发病。',
    symptoms: [
      '颈肩痛，可放射至上肢',
      '上肢麻木、无力',
      '头痛、头晕（椎动脉型）',
      '行走不稳、踩棉花感（脊髓型）',
      '恶心、耳鸣、视物模糊',
      '严重者可出现大小便功能障碍'
    ],
    diagnosisCriteria: [
      {
        title: '临床症状和体征',
        description: '根据不同分型（神经根型、脊髓型、椎动脉型等）有相应的表现'
      },
      {
        title: '影像学检查',
        description: 'X线显示颈椎生理曲度改变、骨质增生、椎间隙变窄；CT或MRI显示椎间盘突出、脊髓或神经根受压'
      },
      {
        title: '神经电生理检查',
        description: '肌电图等检查有助于评估神经损伤程度'
      }
    ],
    treatments: {
      medication: [
        '非甾体抗炎药（如塞来昔布、依托考昔）',
        '神经营养药物（如甲钴胺、维生素B1）',
        '肌肉松弛剂（如乙哌立松）',
        '脱水剂（急性期神经水肿）',
        '改善脑循环药物（椎动脉型）'
      ],
      physical: [
        '颈椎牵引',
        '物理因子治疗（中频、超短波等）',
        '中医治疗（针灸、推拿）',
        '颈椎康复锻炼（如颈部米字操）',
        '颈托固定（急性期）'
      ],
      surgical: [
        '前路椎间盘切除椎间融合术',
        '后路椎管扩大成形术',
        '颈椎人工椎间盘置换术',
        '微创颈椎手术'
      ]
    },
    preventionTips: [
      '保持正确的坐姿和睡姿',
      '避免长时间低头工作或使用手机',
      '选择合适的枕头，高度适中',
      '加强颈部肌肉锻炼',
      '注意颈部保暖，避免受凉',
      '定期进行颈部保健活动'
    ],
    updateTime: '2023-11-08',
    viewCount: 1987,
    isFavorite: true,
    isNew: true
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