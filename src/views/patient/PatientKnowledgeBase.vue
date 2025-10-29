<template>
  <div class="knowledge-page">
    <div class="patient-knowledge">
          <!-- 页面标题 -->
    <div class="page-header">
            <div>
              <h1 class="text-2xl font-semibold text-black mb-1" style="color: black;">知识库</h1>
              <p class="text-sm text-gray-500">骨骼疾病诊断指南、影像图谱与临床案例库</p>
            </div>
            <div class="header-actions">
              <button class="back-to-dashboard-btn" @click="backToDashboard">
                <i class="fas fa-arrow-left"></i>
                返回工作台
              </button>
            </div>
    </div>

      <!-- 智能检索模块 -->
      <div class="search-module">
        <h3>智能医学知识检索</h3>
        <p class="search-description">快速查找骨骼疾病诊断相关的指南、图谱和案例</p>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索疾病名称、症状、解剖部位或关键词..."
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch">
            <i class="fas fa-search"></i>
            搜索
          </button>
        </div>
        <div class="search-links">
          热门搜索:
          <a href="#" @click.prevent="searchByKeyword('半月板损伤')" :class="{ active: searchQuery === '半月板损伤' }">半月板损伤</a>
          <a href="#" @click.prevent="searchByKeyword('骨折分型')" :class="{ active: searchQuery === '骨折分型' }">骨折分型</a>
          <a href="#" @click.prevent="searchByKeyword('MRI影像解读')" :class="{ active: searchQuery === 'MRI影像解读' }">MRI影像解读</a>
          <a href="#" @click.prevent="searchByKeyword('更多')">查看更多</a>
        </div>
      </div>

      <!-- 快速入口网格 -->
      <div class="quick-links-grid">
        <div class="quick-card" @click="showPage('all-guides')">
          <div class="card-icon iconify-c1">
            <i class="fas fa-file-medical"></i>
            </div>
          <div class="card-content">
            <h4>诊断指南</h4>
            <p>最新骨骼疾病诊断标准、治疗流程和临床路径</p>
            <span class="count">128 新指南</span>
          </div>
          <i class="fas fa-arrow-right card-arrow"></i>
        </div>
        <div class="quick-card" @click="showPage('all-atlases')">
          <div class="card-icon iconify-c2">
            <i class="fas fa-images"></i>
          </div>
          <div class="card-content">
            <h4>影像图谱</h4>
            <p>正常与异常骨骼影像对比、解剖结构标注和典型病例影像</p>
            <span class="count">356 组图谱</span>
          </div>
          <i class="fas fa-arrow-right card-arrow"></i>
        </div>
        <div class="quick-card" @click="showPage('all-cases')">
          <div class="card-icon iconify-c3">
            <i class="fas fa-user-md"></i>
          </div>
          <div class="card-content">
            <h4>临床案例</h4>
            <p>疑难病例分析、误诊案例讨论和多学科会诊记录</p>
            <span class="count">245 个案例</span>
          </div>
          <i class="fas fa-arrow-right card-arrow"></i>
        </div>
        <div class="quick-card" @click="showPage('all-literature')">
          <div class="card-icon iconify-c4">
            <i class="fas fa-book-open"></i>
          </div>
          <div class="card-content">
            <h4>医学文献</h4>
            <p>骨骼疾病领域最新研究进展、指南解读和专家评论</p>
            <span class="count">512 篇文献</span>
          </div>
          <i class="fas fa-arrow-right card-arrow"></i>
        </div>
      </div>

      <!-- 主布局容器 -->
      <div class="main-layout">
        <!-- 知识库侧边栏 -->
        <div class="knowledge-sidebar">
          <div class="sidebar-header">
            <h2>骨骼疾病分类</h2>
            <p>按解剖部位和疾病类型浏览</p>
          </div>
          <ul class="sidebar-nav">
            <li class="nav-item" :class="{ 'is-expanded': expandedItems.includes('spine') }">
              <div class="nav-item-title" @click="toggleExpanded('spine')">
                <i class="fas fa-chevron-right" :class="{ 'rotated': expandedItems.includes('spine') }"></i>
                脊柱疾病
              </div>
              <ul class="sub-nav" v-show="expandedItems.includes('spine')">
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'herniation' }]" @click.prevent="selectDisease('herniation')">腰椎间盘突出症</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'spondylosis' }]" @click.prevent="selectDisease('spondylosis')">颈椎病</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'spinal-fracture' }]" @click.prevent="selectDisease('spinal-fracture')">脊柱骨折</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'spinal-deformity' }]" @click.prevent="selectDisease('spinal-deformity')">脊柱侧弯</a></li>
              </ul>
            </li>
            <li class="nav-item" :class="{ 'is-expanded': expandedItems.includes('joint') }">
              <div class="nav-item-title" @click="toggleExpanded('joint')">
                <i class="fas fa-chevron-right" :class="{ 'rotated': expandedItems.includes('joint') }"></i>
                关节疾病
              </div>
              <ul class="sub-nav" v-show="expandedItems.includes('joint')">
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'arthritis' }]" @click.prevent="selectDisease('arthritis')">膝关节骨关节炎</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'meniscus-injury' }]" @click.prevent="selectDisease('meniscus-injury')">半月板损伤</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'ligament-injury' }]" @click.prevent="selectDisease('ligament-injury')">韧带损伤</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'anfh' }]" @click.prevent="selectDisease('anfh')">股骨头坏死</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="#" :class="['nav-link', 'nav-parent-link', { 'is-active': activeDisease === 'trauma' }]" @click.prevent="selectDisease('trauma')">
                <i class="fas fa-chevron-right"></i>
                骨折与创伤
              </a>
            </li>
            <li class="nav-item">
              <a href="#" :class="['nav-link', 'nav-parent-link', { 'is-active': activeDisease === 'bone-tumor' }]" @click.prevent="selectDisease('bone-tumor')">
                <i class="fas fa-chevron-right"></i>
                骨肿瘤
              </a>
            </li>
            <li class="nav-item">
              <a href="#" :class="['nav-link', 'nav-parent-link', { 'is-active': activeDisease === 'metabolic' }]" @click.prevent="selectDisease('metabolic')">
                <i class="fas fa-chevron-right"></i>
                代谢性骨病
              </a>
            </li>
          </ul>
          <div class="sidebar-footer">
            <a href="#">查看全部疾病分类</a>
          </div>
      </div>

        <!-- 主内容区域 -->
        <div class="content-area">
          <!-- 腰椎间盘突出症内容（默认选中） -->
          <div v-if="activeDisease === 'herniation'" class="content-page is-active">
            <div class="content-section">
              <div class="section-header">
                <h3>推荐的专业指南 (腰椎)</h3>
                <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="guide-list">
                <div class="guide-item">
                  <i class="fas fa-file-medical guide-icon"></i>
                  <div class="guide-content">
                    <h4 class="guide-title-link" @click="openGuideDetail('herniation-2023')">腰椎间盘突出症诊疗指南 (2023版)</h4>
                    <p>本指南由中华医学会骨科学分会编写。系统阐述了腰椎间盘突出症的流行病学、发病机制、临床表现、影像学诊断...</p>
                    <div class="guide-meta">
                      <span><i class="fas fa-calendar"></i> 2023-01-10</span>
                      <span><i class="fas fa-eye"></i> 1,893 查看</span>
                      <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                    </div>
                    <!-- 原地展开的详情 -->
                    <div v-if="currentGuideId === 'herniation-2023' && showGuideDetail" class="guide-detail-expanded">
                      <div class="guide-detail-content">
                        <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                        <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                          <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                          <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                        </div>
                        <div class="guide-detail-body" v-html="currentGuide.content"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="guide-item">
                  <i class="fas fa-file-medical guide-icon"></i>
                  <div class="guide-content">
                    <h4 class="guide-title-link" @click="openGuideDetail('meniscus-2023')">中国半月板损伤诊疗指南 (2023版)</h4>
                    <p>本指南由中华医学会骨科学分会关节镜学组组织编写。系统阐述了半月板损伤的诊断标准、影像学表现、治疗方案...</p>
                    <div class="guide-meta">
                      <span><i class="fas fa-calendar"></i> 2023-03-15</span>
                      <span><i class="fas fa-eye"></i> 3,452 查看</span>
                      <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                    </div>
                  </div>
                </div>
              </div>
        </div>
        
            <div class="content-section">
              <div class="section-header">
                <h3>骨骼系统影像诊断 (腰椎)</h3>
                <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="article-grid">
                <div class="article-card">
                  <h4>腰椎MRI影像学诊断图谱</h4>
                  <p>包含椎间盘膨出、突出、脱出、游离的典型MRI矢状位和轴位影像，以及椎管狭窄的测量...</p>
                  <div class="tag-list">
                    <span>MRI</span>
                    <span>腰椎</span>
                    <span>椎间盘</span>
                  </div>
                </div>
                <div class="article-card">
                  <h4>脊柱骨折X线诊断图谱</h4>
                  <p>对比稳定性骨折、不稳定性骨折、Chance骨折等常见类型的X线表现...</p>
                  <div class="tag-list">
                    <span>X线</span>
                    <span>脊柱</span>
                    <span>骨折</span>
                  </div>
                </div>
        </div>
      </div>

            <div class="content-section">
              <div class="section-header">
                <h3>经典病例讨论 (腰椎)</h3>
                <div class="actions">
                  <a href="#" class="see-all">查看全部案例</a>
                  <a href="#" class="see-all">更多讨论 <i class="fas fa-arrow-right"></i></a>
      </div>
              </div>
              <div class="case-study-card">
                <div class="case-study-header">
                  <h4>案例：青少年特发性脊柱侧弯的诊断与治疗</h4>
                  <span class="tag-hot">最新热议</span>
                </div>
                <div class="case-study-body">
                  14岁女性患者，因"发现脊柱侧弯2年，加重半年"入院。查体：双肩不等高，胸廓不对称...
                </div>
                <div class="case-study-footer">
                  <span><i class="fas fa-user-md"></i> 主持专家：张教授 (骨科)</span>
                  <span><i class="fas fa-clock"></i> 发表时间: 2023-07-22</span>
                </div>
                <div class="case-study-actions">
                  <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                  <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                  <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                  <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-08-10</span>
                </div>
              </div>
            </div>

            <div class="qa-section">
              <h3>简易疾病QA (腰椎间盘突出症)</h3>
              <div class="qa-item">
                <div class="qa-question">
                  <span class="qa-icon q">Q:</span>
                  <p>腰椎间盘突出一定要手术吗？</p>
          </div>
                <div class="qa-answer">
                  <span class="qa-icon a">A:</span>
                  <p>不一定。绝大多数（约80-90%）的初发患者可通过保守治疗（如休息、药物、理疗）缓解。只有保守治疗无效、症状严重或出现马尾神经综合征时才考虑手术。</p>
          </div>
        </div>
              <div class="qa-item">
                <div class="qa-question">
                  <span class="qa-icon q">Q:</span>
                  <p>腰椎间盘突出和腰肌劳损有什么区别？</p>
        </div>
                <div class="qa-answer">
                  <span class="qa-icon a">A:</span>
                  <p>主要区别是是否有神经压迫。腰肌劳损主要是腰部肌肉酸痛，活动受限，但通常不会有腿部放射性疼痛或麻木。腰突症的典型症状是"坐骨神经痛"，即疼痛会从臀部放射到大腿后侧和小腿。</p>
      </div>
              </div>
            </div>
          </div>

        <!-- 颈椎病内容 -->
        <div v-else-if="activeDisease === 'spondylosis'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (颈椎)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('spondylosis-2022')">颈椎病诊疗指南 (2022版)</h4>
                  <p>本指南由中华医学会骨科学分会发布，涵盖了脊髓型、神经根型颈椎病的诊断标准、阶梯治疗和手术时机...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2022-10-18</span>
                    <span><i class="fas fa-eye"></i> 6,210 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'spondylosis-2022' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('csm-consensus')">脊髓型颈椎病(CSM)诊断与治疗专家共识</h4>
                  <p>针对脊髓型颈椎病的早期识别、影像学评估（T2高信号）、手术入路选择（前路ACDF/ACCF，后路）提供了详细建议...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-02-05</span>
                    <span><i class="fas fa-eye"></i> 4,119 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'csm-consensus' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (颈椎病)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>颈椎病MRI影像学分型与诊断</h4>
                <p>详细解读颈椎病在MRI上的T1、T2信号表现，包括椎间盘突出、黄韧带肥厚、椎管狭窄等...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>颈椎病</span>
                  <span>影像</span>
                </div>
              </div>
              <div class="article-card">
                <h4>颈椎X线动力位片诊断图谱</h4>
                <p>介绍颈椎正位、侧位、过屈过伸动力位片的拍摄规范和诊断要点，如生理曲度变直、椎间隙变窄...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>颈椎</span>
                  <span>动力位</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (颈椎病)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：重度脊髓型颈椎病(CSM)的手术治疗与康复</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                58岁男性，主诉"四肢麻木无力2年，行走不稳1月"。影像学显示C4/5、C5/6节段严重压迫，脊髓T2高信号...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：李教授 (脊柱外科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-06-15</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-08-01</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (颈椎病)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>颈椎病会引起头晕吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>会。特定类型的颈椎病（如椎动脉型）会因为压迫或刺激椎动脉，导致脑供血不足，引起头晕、恶心、甚至视物模糊。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>选什么样的枕头对颈椎好？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>枕头的关键是能"填补"颈部的生理曲度。合适的枕头应能支撑颈部，使颈椎在睡眠时保持中立位，不宜过高或过低。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 脊柱骨折内容 -->
        <div v-else-if="activeDisease === 'spinal-fracture'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (脊柱骨折)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('spinal-fracture-2023')">脊柱骨折诊疗指南 (2023版)</h4>
                  <p>本指南详细介绍了脊柱骨折的分类、诊断标准、保守治疗和手术治疗的适应症，特别强调了稳定性评估的重要性...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-04-20</span>
                    <span><i class="fas fa-eye"></i> 2,856 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'spinal-fracture-2023' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (脊柱骨折)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>脊柱骨折CT三维重建诊断图谱</h4>
                <p>包含压缩性骨折、爆裂性骨折、Chance骨折等常见类型的CT三维重建影像表现...</p>
                <div class="tag-list">
                  <span>CT</span>
                  <span>脊柱</span>
                  <span>骨折</span>
                </div>
              </div>
              <div class="article-card">
                <h4>脊柱骨折MRI信号分析图谱</h4>
                <p>详细介绍脊柱骨折在MRI上的信号变化，包括急性期、亚急性期和慢性期的特征...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>脊柱</span>
                  <span>信号</span>
                </div>
              </div>
            </div>
          </div>

          <div class="qa-section">
            <h3>简易疾病QA (脊柱骨折)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>脊柱骨折后多久可以下床活动？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>这取决于骨折的类型和严重程度。稳定性骨折通常4-6周后可逐渐下床，不稳定性骨折需要更长时间，甚至需要手术治疗。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 脊柱畸形内容 -->
        <div v-else-if="activeDisease === 'spinal-deformity'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (脊柱畸形)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('scoliosis-guide')">青少年特发性脊柱侧弯诊疗指南</h4>
                  <p>本指南针对青少年特发性脊柱侧弯的诊断、Cobb角测量、支具治疗和手术指征提供了详细指导...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-05-15</span>
                    <span><i class="fas fa-eye"></i> 3,124 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'scoliosis-guide' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="qa-section">
            <h3>简易疾病QA (脊柱畸形)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>脊柱侧弯什么情况下需要手术？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>通常Cobb角超过40-45度，或支具治疗无效且侧弯继续进展时考虑手术。具体指征需要结合患者年龄、骨骼成熟度等因素综合判断。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 膝关节骨关节炎内容 -->
        <div v-else-if="activeDisease === 'arthritis'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (膝关节)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('oa-2023')">膝关节骨关节炎诊疗指南 (2023版)</h4>
                  <p>本指南详细介绍了膝关节骨关节炎的病理机制、临床表现、影像学分级和阶梯治疗方案...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-06-10</span>
                    <span><i class="fas fa-eye"></i> 4,567 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'oa-2023' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="qa-section">
            <h3>简易疾病QA (膝关节骨关节炎)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>膝关节骨关节炎如何预防？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>控制体重、避免过度负重、适当运动（如游泳、骑自行车）、避免长时间下蹲或跪姿，以及及时治疗膝关节损伤。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 半月板损伤内容 -->
        <div v-else-if="activeDisease === 'meniscus-injury'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (半月板)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('meniscus-2023-2')">半月板损伤诊疗指南 (2023版)</h4>
                  <p>本指南详细介绍了半月板损伤的解剖、分型、MRI诊断标准和关节镜手术指征...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-03-15</span>
                    <span><i class="fas fa-eye"></i> 3,452 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'meniscus-2023-2' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="qa-section">
            <h3>简易疾病QA (半月板损伤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>半月板损伤一定要手术吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>不一定。小的撕裂可以保守治疗，包括休息、物理治疗和功能锻炼。只有保守治疗无效或撕裂严重时才考虑关节镜手术。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 韧带损伤内容 -->
        <div v-else-if="activeDisease === 'ligament-injury'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (韧带损伤)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('ligament-guide')">膝关节韧带损伤诊疗指南</h4>
                  <p>本指南详细介绍了前交叉韧带、后交叉韧带、内侧副韧带等损伤的诊断和治疗方案...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-07-20</span>
                    <span><i class="fas fa-eye"></i> 2,789 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'ligament-guide' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="qa-section">
            <h3>简易疾病QA (韧带损伤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>韧带损伤后多久可以恢复运动？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>这取决于损伤的严重程度。轻度损伤通常4-6周，中度损伤需要2-3个月，重度损伤或手术后需要6-12个月的专业康复。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 股骨头坏死内容 -->
        <div v-else-if="activeDisease === 'anfh'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (股骨头坏死)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('anfh-2023')">股骨头坏死诊疗指南 (2023版)</h4>
                  <p>本指南详细介绍了股骨头坏死的病因、分期、影像学诊断和保髋手术的适应症...</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-08-15</span>
                    <span><i class="fas fa-eye"></i> 1,956 查看</span>
                    <span><i class="fas fa-file-pdf"></i> PDF 下载</span>
                  </div>
                  <!-- 原地展开的详情 -->
                  <div v-if="currentGuideId === 'anfh-2023' && showGuideDetail" class="guide-detail-expanded">
                    <div class="guide-detail-content">
                      <h2 style="margin-bottom: 20px;">{{ currentGuide.title }}</h2>
                      <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <span><i class="fas fa-calendar"></i> {{ currentGuide.date }}</span>
                        <span><i class="fas fa-eye"></i> {{ currentGuide.views }} 查看</span>
                      </div>
                      <div class="guide-detail-body" v-html="currentGuide.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="qa-section">
            <h3>简易疾病QA (股骨头坏死)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>股骨头坏死早期有什么症状？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>早期症状包括髋关节疼痛，特别是夜间痛和负重时疼痛加重。疼痛可放射到大腿内侧或膝关节，活动受限。</p>
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import PatientSidebar from '@/components/patient/PatientSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()

// 搜索相关
const searchQuery = ref('')

// 侧边栏展开状态
const expandedItems = ref(['spine'])

// 当前选中的疾病
const activeDisease = ref('herniation')

// 指南详情
const showGuideDetail = ref(false)
const currentGuideId = ref('') // 当前展开的指南ID
const currentGuide = ref({
  title: '',
  date: '',
  views: '',
  content: ''
})

// 指南数据
const guideData = {
  'herniation-2023': {
    title: '腰椎间盘突出症诊疗指南 (2023版)',
    date: '2023-01-10',
    views: '1,893',
    content: `
      <h3>1. 概述</h3>
      <p>本指南由中华医学会骨科学分会编写。系统阐述了腰椎间盘突出症的流行病学、发病机制、临床表现、影像学诊断、分型、以及保守治疗和手术治疗的最新进展。</p>
      <h3>2. 影像学诊断</h3>
      <p>MRI是诊断腰椎间盘突出症的金标准。推荐进行腰椎矢状位T1、T2和轴位T2加权成像。根据影像学表现，突出可分为膨出(Bulging)、突出(Protrusion)、脱出(Extrusion)和游离(Sequestration)。</p>
      <p>CT扫描对于显示椎间盘钙化、骨赘形成、椎管狭窄具有优势，尤其在评估骨性结构时。X线动力位片可用于评估腰椎的稳定性。</p>
      <h3>3. 治疗原则</h3>
      <p>治疗应遵循阶梯化原则。绝大多数（约80-90%）的初发患者可通过保守治疗获得缓解。保守治疗包括卧床休息、药物治疗（NSAIDs、肌松剂）、物理治疗和康复锻炼。</p>
      <p>手术治疗指征包括：(1) 保守治疗无效；(2) 出现马尾神经综合征；(3) 出现进行性肌力下降。手术方式包括经典的椎板开窗髓核摘除术(Fenestration)、椎间孔镜(TESSYS)和UBE等微创手术。</p>
    `
  },
  'meniscus-2023': {
    title: '中国半月板损伤诊疗指南 (2023版)',
    date: '2023-03-15',
    views: '3,452',
    content: `
      <h3>1. 诊断</h3>
      <p>诊断主要依据病史（明确的膝关节扭伤史）、临床体征（关节间隙压痛、McMurray试验阳性）和影像学检查。</p>
      <p>MRI是诊断半月板损伤最准确的无创检查方法。Stoller分级是目前最常用的MRI分级标准：I级和II级为半月板内部退变信号，未达关节面；III级信号（线状或不规则高信号）达到半月板的关节面，诊断为半月板撕裂。</p>
      <h3>2. 治疗</h3>
      <p>治疗原则是尽可能保留半月板组织，恢复其生物力学功能。治疗方式包括保守治疗、半月板部分切除术、半月板缝合术和半月板移植术。</p>
      <p>半月板缝合术是目前的主流趋势，尤其适用于位于红区（外1/3血供区）的纵行撕裂。桶柄状撕裂一经诊断，应尽早行关节镜下复位缝合。</p>
    `
  }
}

const handleTabChange = (tab: string) => {
  switch (tab) {
    case 'dashboard':
      router.push('/dashboard/patient');
      break;
    case 'reports':
      router.push('/dashboard/patient/reports');
      break;
    case 'appointment':
      router.push('/dashboard/patient/appointment');
      break;
    case 'knowledge':
      router.push('/dashboard/patient/knowledge');
      break;
    case 'settings':
      router.push('/dashboard/patient/settings');
      break;
    case 'help':
      router.push('/dashboard/patient/help');
      break;
  }
}

const backToDashboard = () => {
  router.push('/dashboard/patient')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    ElMessage.info(`搜索: ${searchQuery.value}`)
  }
}

const searchByKeyword = (keyword: string) => {
  searchQuery.value = keyword
  handleSearch()
}

const toggleExpanded = (item: string) => {
  const index = expandedItems.value.indexOf(item)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(item)
  }
}

const selectDisease = (disease: string) => {
  activeDisease.value = disease
  // 切换疾病时，自动关闭已展开的详情
  showGuideDetail.value = false
}

const showPage = (page: string) => {
  ElMessage.info(`显示页面: ${page}`)
}

const openGuideDetail = (guideId: string) => {
  const guide = guideData[guideId as keyof typeof guideData]
  if (guide) {
    currentGuide.value = guide
    // 如果点击的是当前已展开的，则收起；否则展开新的
    if (currentGuideId.value === guideId) {
      currentGuideId.value = ''
      showGuideDetail.value = false
    } else {
      currentGuideId.value = guideId
      showGuideDetail.value = true
    }
  }
}
</script>

<style scoped>
.knowledge-page {
  min-height: 100vh;
  background: #f9fafb;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.patient-knowledge {
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-layout {
  display: flex;
  gap: 24px;
  margin-top: 24px;
}

/* 搜索模块 */
.search-module {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.search-module h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.search-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #606266;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-box input {
  flex-grow: 1;
  height: 44px;
  padding: 0 16px;
  font-size: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 6px 0 0 6px;
  outline: none;
}

.search-box input:focus {
  border-color: #409EFF;
}

.search-box button {
  height: 46px;
  border: none;
  background-color: #409EFF;
  color: #fff;
  padding: 0 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 0 6px 6px 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.search-links {
  margin-top: 12px;
  font-size: 13px;
  color: #909399;
}

.search-links a {
  color: #606266;
  text-decoration: none;
  margin-left: 16px;
}

.search-links a:hover, .search-links a.active {
  color: #409EFF;
}

/* 快速入口网格 */
.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  text-decoration: none;
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}

.quick-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.quick-card .iconify-c1 { 
  background-color: #409EFF; 
  color: #ffffff; 
}
.quick-card .iconify-c2 { 
  background-color: #67C23A; 
  color: #ffffff; 
}
.quick-card .iconify-c3 { 
  background-color: #E6A23C; 
  color: #ffffff; 
}
.quick-card .iconify-c4 { 
  background-color: #F56C6C; 
  color: #ffffff; 
}

.card-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #303133;
}

.card-content p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.card-content .count {
  color: #606266;
  font-weight: 500;
}

.card-arrow {
  margin-left: auto;
  font-size: 16px;
  color: #909399;
}

/* 知识库侧边栏 */
.knowledge-sidebar {
  width: 240px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-right: 1px solid #e4e7ed;
  padding: 20px 0;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.sidebar-header {
  padding: 0 20px 10px 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 10px;
}

.sidebar-header h2 {
  font-size: 18px;
  margin: 0 0 4px 0;
  color: #303133;
}

.sidebar-header p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item-title {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;
  color: #303133;
}

.nav-item-title:hover {
  background-color: #f9fafb;
}

.nav-item-title i {
  font-size: 12px;
  margin-right: 8px;
  color: #606266;
  transition: transform 0.2s ease;
}

.nav-item-title i.rotated {
  transform: rotate(90deg);
}

.sub-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fafafa;
}

.nav-link {
  display: block;
  padding: 10px 20px 10px 44px;
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  position: relative;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.nav-link:hover {
  color: #409EFF;
}

.nav-link.nav-parent-link {
  padding: 12px 20px;
  font-weight: 500;
  color: #303133;
  display: flex;
  align-items: center;
}

.nav-link.nav-parent-link:hover {
  background-color: #f9fafb;
}

.nav-link.nav-parent-link i {
  font-size: 12px;
  margin-right: 8px;
  color: #606266;
}

.nav-link.is-active {
  background-color: #ecf5ff;
  color: #409EFF;
  font-weight: 500;
  border-left-color: #409EFF;
}

.sidebar-footer {
  padding: 15px 20px;
  margin-top: 10px;
  border-top: 1px solid #e4e7ed;
}

.sidebar-footer a {
  text-decoration: none;
  font-size: 13px;
  color: #409EFF;
}

/* 主内容区域 */
.content-area {
  flex-grow: 1;
  overflow-y: auto;
}

.content-page {
  display: none;
}

.content-page.is-active {
  display: block;
}

.content-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.section-description {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #606266;
}

.section-header .see-all {
  text-decoration: none;
  font-size: 13px;
  color: #409EFF;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.section-header .actions {
  display: flex;
  gap: 16px;
  order: 1;
}

.section-header .actions .see-all {
  order: 0;
}

/* 指南列表 */
.guide-list .guide-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px dashed #e4e7ed;
}

.guide-list .guide-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.guide-icon {
  font-size: 36px;
  color: #409EFF;
}

.guide-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  cursor: pointer;
  transition: color 0.2s ease;
}

.guide-title-link:hover {
  color: #409EFF;
}

.guide-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.guide-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 16px;
}

.guide-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 文章网格 */
.article-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.article-card {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 20px;
}

.article-image {
  margin-bottom: 16px;
}

.image-placeholder {
  width: 100%;
  height: 120px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 24px;
}

.article-card h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.article-card p {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
  margin: 0 0 16px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tag-list {
  display: flex;
  gap: 8px;
}

.tag-list span {
  font-size: 12px;
  background-color: #f5f7fa;
  color: #606266;
  padding: 4px 10px;
  border-radius: 4px;
}

/* 案例讨论 */
.case-study-card {
  border: 1px solid #fceecf;
  background-color: #fefcf5;
  border-radius: 6px;
  padding: 20px;
}

.case-study-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.case-study-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.case-study-header .tag-hot {
  font-size: 12px;
  color: #E6A23C;
  background-color: #fdf6ec;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.case-study-body {
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
  margin-bottom: 16px;
}

.case-study-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.case-study-footer span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.case-study-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #e4e7ed;
  font-size: 13px;
  display: flex;
  gap: 20px;
}

.case-study-actions a {
  text-decoration: none;
  color: #606266;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.case-study-actions a:hover {
  color: #409EFF;
}

/* Q&A 模块 */
.qa-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.qa-section h3 {
  font-size: 18px;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
}

.qa-item {
  margin-bottom: 24px;
  border-bottom: 1px dashed #e4e7ed;
  padding-bottom: 24px;
}

.qa-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.qa-question, .qa-answer {
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  line-height: 1.7;
  color: #606266;
}

.qa-question {
  margin-bottom: 16px;
  color: #303133;
  font-weight: 500;
}

.qa-question p, .qa-answer p {
  margin: 0;
  padding: 0;
}

.qa-icon {
  flex-shrink: 0;
  font-weight: 700;
  margin-right: 10px;
  font-size: 16px;
  width: 20px;
}

.qa-icon.q {
  color: #409EFF;
}

.qa-icon.a {
  color: #67C23A;
}

/* 页面头部样式 */
.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.back-to-dashboard-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-to-dashboard-btn:hover {
  background-color: #337ecc;
  transform: translateY(-1px);
}

.back-to-dashboard-btn i {
  font-size: 12px;
}

/* 确保知识库标题为黑色 */
.page-header h1 {
  color: #000000 !important;
}

/* 指南详情页 */

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e4e7ed;
  background-color: #ffffff;
  color: #606266;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  color: #409EFF;
  border-color: #ecf5ff;
  background-color: #ecf5ff;
}

.guide-content-full {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.guide-content-full h1 {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #303133;
}

.guide-content-full h3 {
  font-size: 18px;
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
}

.guide-content-full p {
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 16px;
}

/* 就地展开的详情样式 */
.guide-detail-expanded {
  margin-top: 20px;
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.guide-detail-content {
  background-color: #fafbfc;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 24px;
}

.guide-detail-content h2 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #303133;
}

.guide-detail-body {
  margin-top: 20px;
}

.guide-detail-body h3 {
  font-size: 16px;
  margin: 16px 0 8px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
}

.guide-detail-body p {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 12px;
}

@media (max-width: 1024px) {
  .patient-knowledge {
    margin-left: 0;
    padding: 16px;
    flex-direction: column;
  }
  
  .knowledge-sidebar {
    width: 100%;
    order: 2;
  }
  
  .content-area {
    order: 1;
  }
  
  .quick-links-grid {
    grid-template-columns: 1fr;
  }
  
  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>