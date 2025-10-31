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
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'spinal-fracture' }]" @click.prevent="selectDisease('spinal-fracture')">脊柱骨狭窄</a></li>
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
            <li class="nav-item" :class="{ 'is-expanded': expandedItems.includes('trauma') }">
              <div class="nav-item-title" @click="toggleExpanded('trauma')">
                <i class="fas fa-chevron-right" :class="{ 'rotated': expandedItems.includes('trauma') }"></i>
                骨折与创伤
              </div>
              <ul class="sub-nav" v-show="expandedItems.includes('trauma')">
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'femoral-neck-fracture' }]" @click.prevent="selectDisease('femoral-neck-fracture')">股骨颈骨折</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'distal-radius-fracture' }]" @click.prevent="selectDisease('distal-radius-fracture')">桡骨远端骨折</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'spinal-compression-fracture' }]" @click.prevent="selectDisease('spinal-compression-fracture')">脊柱压缩性骨折</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'ankle-fracture' }]" @click.prevent="selectDisease('ankle-fracture')">踝关节骨折</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'surgical-neck-fracture' }]" @click.prevent="selectDisease('surgical-neck-fracture')">肱骨外科颈骨折</a></li>
              </ul>
            </li>
            <li class="nav-item" :class="{ 'is-expanded': expandedItems.includes('bone-tumor') }">
              <div class="nav-item-title" @click="toggleExpanded('bone-tumor')">
                <i class="fas fa-chevron-right" :class="{ 'rotated': expandedItems.includes('bone-tumor') }"></i>
                骨肿瘤
              </div>
              <ul class="sub-nav" v-show="expandedItems.includes('bone-tumor')">
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'osteosarcoma' }]" @click.prevent="selectDisease('osteosarcoma')">骨肉瘤</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'osteochondroma' }]" @click.prevent="selectDisease('osteochondroma')">骨软骨瘤</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'giant-cell-tumor' }]" @click.prevent="selectDisease('giant-cell-tumor')">骨巨细胞瘤</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'metastatic-bone-tumor' }]" @click.prevent="selectDisease('metastatic-bone-tumor')">转移性骨肿瘤</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'chondrosarcoma' }]" @click.prevent="selectDisease('chondrosarcoma')">软骨肉瘤</a></li>
              </ul>
            </li>
            <li class="nav-item" :class="{ 'is-expanded': expandedItems.includes('metabolic') }">
              <div class="nav-item-title" @click="toggleExpanded('metabolic')">
                <i class="fas fa-chevron-right" :class="{ 'rotated': expandedItems.includes('metabolic') }"></i>
                代谢性骨病
              </div>
              <ul class="sub-nav" v-show="expandedItems.includes('metabolic')">
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'osteoporosis' }]" @click.prevent="selectDisease('osteoporosis')">骨质疏松症</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'gout' }]" @click.prevent="selectDisease('gout')">痛风</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'osteomalacia' }]" @click.prevent="selectDisease('osteomalacia')">骨软化症</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'rickets' }]" @click.prevent="selectDisease('rickets')">佝偻病</a></li>
                <li><a href="#" :class="['nav-link', { 'is-active': activeDisease === 'paget-disease' }]" @click.prevent="selectDisease('paget-disease')">畸形性骨炎 (Paget病)</a></li>
              </ul>
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
                <h3>科普资料 (腰椎)</h3>
                <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="guide-list">
                <div class="guide-item">
                  <i class="fas fa-file-medical guide-icon"></i>
                  <div class="guide-content">
                    <h4 class="guide-title-link" @click="openPDF3('腰椎间盘突出症中医循证实践指南.pdf')">腰椎间盘突出症中医循证实践指南</h4>
                    <p>基于循证医学证据的中医诊疗指南。</p>
                  
                  </div>
                </div>
                <div class="guide-item">
                  <i class="fas fa-file-medical guide-icon"></i>
                  <div class="guide-content">
                    <h4 class="guide-title-link" @click="openPDF4('腰椎间盘突出症诊疗指南.pdf')">腰椎间盘突出症诊疗指南</h4>
                    <p>指南从腰椎间盘突出症的定义、自然病程、症状和体征、辅助检查、诊断标准、保守治疗、手术治疗、手术疗效评估、手术效果的影响因素等方面阐述了腰椎间盘突出症的诊疗措施，以期为腰椎间盘突出症的诊断和治疗提供可靠的临床理论依据。</p>
                   
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
                  <h4>脊柱骨狭窄X线诊断图谱</h4>
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
              <h3>科普资料 (颈椎)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openPDF2('颈椎病中西医结合诊疗专家共识.pdf')">颈椎病中西医结合诊疗专家共识</h4>
                  <p>本共识综合中西医领域专家观点，就颈椎病的诊断与治疗形成了中西医结合的共识性意见，旨在为临床工作提供参考。</p>
                  
                </div>
              </div>
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openPDF('脊髓型颈椎病中西医结合诊疗指南.pdf')">脊髓型颈椎病中西医结合诊疗指南</h4>
                  <p>由中国中西医结合学会骨伤科专业委员会制定，包含诊断要点、病情评估、中医辨证、手术指征与时机、中西医结合治疗及术后康复等内容。</p>
                  
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

        <!-- 脊柱骨狭窄内容 -->
        <div v-else-if="activeDisease === 'spinal-fracture'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (脊柱骨狭窄)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openPDF5('腰椎管狭窄症中西医结合诊疗指南.pdf')">腰椎管狭窄症中西医结合诊疗指南</h4>
                  <p>本指南详细提供了腰椎管狭窄症的诊断、中医证候、治疗（非手术、手术）等中西医结合的指导意见。</p>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (脊柱骨狭窄)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>脊柱骨狭窄CT三维重建诊断图谱</h4>
                <p>包含先天性狭窄、退变性狭窄、椎间盘突出性狭窄等常见类型的CT三维重建影像表现...</p>
                <div class="tag-list">
                  <span>CT</span>
                  <span>脊柱</span>
                  <span>骨狭窄</span>
                </div>
              </div>
              <div class="article-card">
                <h4>脊柱骨狭窄MRI信号分析图谱</h4>
                <p>详细介绍脊柱骨狭窄在MRI上的信号变化，包括椎管矢状径测量和神经受压情况...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>脊柱</span>
                  <span>骨狭窄</span>
                </div>
              </div>
            </div>
          </div>

          <div class="qa-section">
            <h3>简易疾病QA (脊柱骨狭窄)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>脊柱骨狭窄的手术指征是什么？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>手术指征包括：保守治疗无效、出现进行性神经功能障碍、马尾综合征、椎管严重狭窄（矢状径小于10mm）。手术方式包括椎板减压术、椎体融合术等。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 脊柱畸形内容 -->
        <div v-else-if="activeDisease === 'spinal-deformity'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (脊柱畸形)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openPDF6('青少年特发性脊柱侧凸治未病干预指南.pdf')">青少年特发性脊柱侧凸治未病干预指南</h4>
                  <p>这份指南提供了中医药在脊柱侧凸干预方面的指导意见。它包括了中医的手法治疗、运动功能锻炼以及营养指导等。.</p>
                  <div class="guide-meta">
                    <span><i class="fas fa-calendar"></i> 2023-05-15</span>
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
              <h3>科普资料 (膝关节)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openPDF7('膝骨关节炎中西医结合诊疗指南.pdf')">膝骨关节炎中西医结合诊疗指南</h4>
                  <p>本指南介绍了膝骨关节炎的诊断、分期、评估以及中西医结合治疗（健康教育、手法、针灸、理疗、药物等）。</p>
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
              <h3>科普资料 (半月板)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openWebPage('膝关节半月板损伤科普')">膝关节半月板损伤科普</h4>
                  <p>本科普简要介绍了膝关节半月板的症状、病因、诊断、治疗和预防等方面的知识。...</p>
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
              <h3>科普资料 (韧带损伤)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openPDF8('前交叉韧带损伤临床诊疗循证指南.pdf')">前交叉韧带损伤临床诊疗循证指南</h4>
                  <p>这是目前国内针对ACL损伤最权威的循证指南。它详细涵盖了ACL损伤的诊断、治疗方法选择、手术方案以及术后康复计划。</p>
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
              <h3>科普资料 (股骨头坏死)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openWebPage2('中国成人股骨头坏死临床诊疗指南（2020）')">中国成人股骨头坏死临床诊疗指南（2020）</h4>
                  <p>这是国内针对成人股骨头坏死（ONFH）的权威指南。内容涵盖了诊断、鉴别诊断以及详细的治疗原则。</p>
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


        <!-- 股骨颈骨折内容 -->
        <div v-else-if="activeDisease === 'femoral-neck-fracture'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (股骨颈骨折)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openFemoralNeckFractureGuide()">成人股骨颈骨折诊治指南</h4>
                  <p>权威的骨科专业指南。重点在于治疗方式的选择：根据患者年龄（如以65岁为界）、骨折类型、移位程度来决定采用保守治疗、内固定还是髋关节置换。</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (股骨颈骨折)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>股骨颈骨折X线诊断图谱</h4>
                <p>详细介绍股骨颈骨折在X线上的表现，包括Garden分型、骨折线走向、移位程度等诊断要点...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>股骨颈</span>
                  <span>骨折</span>
                </div>
              </div>
              <div class="article-card">
                <h4>股骨颈骨折CT三维重建诊断</h4>
                <p>通过CT三维重建技术评估股骨颈骨折的立体结构，判断骨折类型和手术入路选择...</p>
                <div class="tag-list">
                  <span>CT</span>
                  <span>三维重建</span>
                  <span>股骨颈</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (股骨颈骨折)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：老年股骨颈骨折的人工髋关节置换术治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                72岁女性，跌倒后右髋部疼痛、活动受限。X线显示右股骨颈基底部骨折，Garden III型。入院后完善检查，排除手术禁忌症，行右侧人工髋关节置换术...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：王教授 (关节外科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-09-10</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-09-25</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (股骨颈骨折)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>股骨颈骨折怎么治疗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>年轻患者多采用手术内固定治疗；老年患者如果身体状况良好，多采用人工髋关节置换术。年龄大、身体状况差的患者可能需要保守治疗。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>股骨颈骨折术后多久能下床？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>人工髋关节置换术后通常1-2天即可下床活动。内固定术后需要根据骨折愈合情况，一般6-12周后可逐渐负重。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 桡骨远端骨折内容 -->
        <div v-else-if="activeDisease === 'distal-radius-fracture'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (桡骨远端骨折)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openDistalRadiusFractureGuide()">桡骨远端骨折中西医结合诊疗指南</h4>
                  <p>本提供了中西医结合的方案。西医治疗包括闭合复位、外固定、手术等；中医治疗根据早、中、后期进行辨证施治（如早期活血化瘀、中期接骨续筋、后期补益肝肾），并包含康复指导。</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (桡骨远端骨折)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>桡骨远端骨折X线诊断图谱</h4>
                <p>详细介绍Colles骨折、Smith骨折、Barton骨折等桡骨远端骨折类型在X线上的特征表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>桡骨远端</span>
                  <span>骨折</span>
                </div>
              </div>
              <div class="article-card">
                <h4>桡骨远端骨折CT三维重建诊断</h4>
                <p>通过CT三维重建评估关节面平整度、骨折块移位情况，指导手术治疗方案...</p>
                <div class="tag-list">
                  <span>CT</span>
                  <span>三维重建</span>
                  <span>关节面</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (桡骨远端骨折)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：老年桡骨远端骨折的手法复位与内固定治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                68岁女性，跌倒后右腕部疼痛、肿胀、畸形。X线显示右桡骨远端骨折，关节面受累。入院后行手法复位，复位后复查X线显示关节面不平整，改为手术治疗...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：张教授 (创伤骨科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-09-15</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-09-28</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (桡骨远端骨折)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>桡骨远端骨折需要手术吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>无移位或轻度移位的骨折可保守治疗（石膏固定6-8周）。明显移位、关节面不平整、多发骨折或保守治疗失败者需要手术治疗。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>桡骨远端骨折多久能愈合？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>一般成人愈合时间为6-8周，儿童更快。需要定期复查X线评估愈合情况。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 脊柱压缩性骨折内容 -->
        <div v-else-if="activeDisease === 'spinal-compression-fracture'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (脊柱压缩性骨折)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openSpinalCompressionFractureGuide()">脊柱压缩性骨折默沙东诊疗指南</h4>
                  <p>提供了清晰的诊疗路径。包括诊断（X线、DXA骨密度测量）、治疗（镇痛、支具、理疗）以及两种微创手术的详细介绍（椎体成形术和椎体后凸成形术，即注入骨水泥）。</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (脊柱压缩性骨折)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>脊柱压缩性骨折X线诊断图谱</h4>
                <p>详细介绍脊柱压缩性骨折在X线上的表现，包括压缩程度、椎体高度变化、骨折线走向等诊断要点...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>脊柱</span>
                  <span>压缩性骨折</span>
                </div>
              </div>
              <div class="article-card">
                <h4>脊柱压缩性骨折MRI诊断图谱</h4>
                <p>通过MRI评估椎体新鲜或陈旧骨折、骨髓水肿程度、神经压迫情况，指导治疗方案选择...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>脊柱</span>
                  <span>骨髓水肿</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (脊柱压缩性骨折)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：老年骨质疏松性脊柱压缩性骨折的椎体成形术治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                75岁女性，轻微外伤后腰背部疼痛，活动受限。X线和MRI显示L2椎体压缩性骨折，压缩高度约30%，骨髓水肿明显。入院后完善检查，行L2椎体成形术治疗...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：刘教授 (脊柱外科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-09-20</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-10-01</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (脊柱压缩性骨折)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>脊柱压缩性骨折如何治疗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>轻度压缩（压缩高度小于1/3）可行保守治疗（卧床休息、支具固定）。严重压缩、神经损害或骨质疏松性骨折可考虑椎体成形术或椎体后凸成形术。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>脊柱压缩性骨折需要卧床多久？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>通常需要卧床休息4-8周，佩戴支具后可逐渐下床活动。期间需要注意预防并发症如压疮、血栓等。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 踝关节骨折内容 -->
        <div v-else-if="activeDisease === 'ankle-fracture'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (踝关节骨折)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openAnkleFractureGuide()">亚洲专科医生患者教育踝关节骨折常见问题</h4>
                  <p>这份资料清晰地区分了治疗方案：无移位骨折（裂缝）采用石膏固定；移位性骨折则必须进行开放式手术（使用螺丝钉和钢板）来复位固定。</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (踝关节骨折)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>踝关节骨折X线诊断图谱</h4>
                <p>详细介绍踝关节骨折在X线上的表现，包括内踝、外踝、后踝骨折的诊断要点，韧带联合分离的评估...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>踝关节</span>
                  <span>骨折</span>
                </div>
              </div>
              <div class="article-card">
                <h4>踝关节骨折CT三维重建诊断</h4>
                <p>通过CT三维重建评估关节面平整度、骨折块大小和移位程度，指导手术治疗方案...</p>
                <div class="tag-list">
                  <span>CT</span>
                  <span>三维重建</span>
                  <span>关节面</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (踝关节骨折)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：踝关节三踝骨折的手术治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                45岁男性，运动时扭伤左踝部，疼痛、肿胀、活动受限。X线显示左踝关节三踝骨折，韧带联合分离。入院后完善检查，行踝关节骨折切开复位内固定术...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：陈教授 (创伤骨科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-09-25</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-10-05</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (踝关节骨折)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>踝关节骨折什么时候需要手术？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>不稳定骨折（韧带联合分离、明显移位、关节面不平整）、保守治疗失败、开放性骨折或伴有脱位者需要手术治疗。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>踝关节骨折术后多久能走路？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>通常术后6-8周可开始部分负重，12周后可完全负重。具体时间需根据骨折类型和愈合情况决定。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 肱骨外科颈骨折内容 -->
        <div v-else-if="activeDisease === 'surgical-neck-fracture'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (肱骨外科颈骨折)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openSurgicalNeckFractureGuide()">肱骨外科颈骨折求医宝典</h4>
                  <p>提供了该骨折的经典治疗方案。根据骨折类型（无移位、外展型、内收型）选择不同的固定方式（三角巾悬吊、贴胸固定、肩人字石膏）或手术治疗（开放复位内固定）。</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (肱骨外科颈骨折)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>肱骨外科颈骨折X线诊断图谱</h4>
                <p>详细介绍肱骨外科颈骨折在X线上的表现，包括Neer分型、骨折块移位情况等诊断要点...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>肱骨</span>
                  <span>骨折</span>
                </div>
              </div>
              <div class="article-card">
                <h4>肱骨外科颈骨折CT三维重建诊断</h4>
                <p>通过CT三维重建评估骨折块数量和移位程度，判断是否需要手术治疗...</p>
                <div class="tag-list">
                  <span>CT</span>
                  <span>三维重建</span>
                  <span>Neer分型</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (肱骨外科颈骨折)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：肱骨外科颈四部分骨折的手术治疗与康复</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                55岁男性，跌倒后右肩部疼痛、活动受限。X线和CT显示右肱骨外科颈四部分骨折，Neer IV型。入院后完善检查，行肱骨外科颈骨折切开复位内固定术...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：赵教授 (创伤骨科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-09-30</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-10-08</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (肱骨外科颈骨折)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>肱骨外科颈骨折如何治疗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>无移位或轻度移位的稳定骨折可保守治疗（三角巾悬吊、夹板固定）。移位明显、不稳定或合并肩关节脱位者需要手术治疗。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>肱骨外科颈骨折后会影响肩关节功能吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>如果治疗不当或过早活动，可能导致肩关节僵硬。需要尽早进行功能锻炼，但需在医生指导下进行。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 骨肉瘤内容 -->
        <div v-else-if="activeDisease === 'osteosarcoma'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (骨肉瘤)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openOsteosarcomaCACAGuide()">中国肿瘤整合诊治指南（CACA） 骨肉瘤</h4>
                  <p>这是由中国抗癌协会发布的整合诊治指南（CACA指南），由骨肿瘤和骨转移瘤专业委员会编写，代表了国内的权威观点。</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (骨肉瘤)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>骨肉瘤X线诊断图谱</h4>
                <p>详细介绍骨肉瘤在X线上的表现，包括骨质破坏、骨膜反应、Codman三角、日光射线征等特征性影像学表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>骨肉瘤</span>
                  <span>恶性骨肿瘤</span>
                </div>
              </div>
              <div class="article-card">
                <h4>骨肉瘤MRI诊断图谱</h4>
                <p>通过MRI评估肿瘤范围、软组织侵犯、骨髓受累情况，指导手术方案设计和预后评估...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>骨肉瘤</span>
                  <span>肿瘤分期</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (骨肉瘤)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：青少年股骨干骨肉瘤的新辅助化疗与保肢手术</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                16岁男性，右大腿疼痛3个月，夜间痛明显。X线和MRI显示右股骨远端骨肉瘤，Enneking IIB期。术前完成3周期新辅助化疗，肿瘤明显缩小，行保肢手术...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：周教授 (骨肿瘤科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-10-05</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-10-15</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (骨肉瘤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨肉瘤早期有什么症状？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>主要表现为局部疼痛，夜间痛明显，可触及肿块，部分患者伴发热。疼痛初期为间歇性，逐渐发展为持续性钝痛。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨肉瘤能治愈吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>早期诊断、规范治疗（化疗+保肢手术）的骨肉瘤5年生存率可达60-70%。治疗效果与肿瘤分期、对化疗的敏感性等因素有关。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 骨软骨瘤内容 -->
        <div v-else-if="activeDisease === 'osteochondroma'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (骨软骨瘤)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openOsteochondromaPMPHGuide()">人卫临床助手 - 疾病知识库</h4>
                  <p>这份资料详细描述了骨软骨瘤的病理特征（如软骨帽）。</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (骨软骨瘤)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>骨软骨瘤X线诊断图谱</h4>
                <p>详细介绍骨软骨瘤在X线上的特征性表现，包括带蒂型、宽基底型，以及与骨表面的连接方式...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>骨软骨瘤</span>
                  <span>良性骨肿瘤</span>
                </div>
              </div>
              <div class="article-card">
                <h4>骨软骨瘤CT三维重建诊断</h4>
                <p>通过CT三维重建评估骨软骨瘤的立体形态、软骨帽厚度，判断是否需要手术切除...</p>
                <div class="tag-list">
                  <span>CT</span>
                  <span>三维重建</span>
                  <span>软骨帽</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (骨软骨瘤)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：股骨远端骨软骨瘤的手术切除治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                25岁男性，右膝外侧触及骨性包块，活动时疼痛。X线和CT显示股骨远端骨软骨瘤，软骨帽增厚。考虑恶变可能，行手术完整切除...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：吴教授 (骨肿瘤科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-10-10</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-10-18</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (骨软骨瘤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨软骨瘤需要手术吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>无症状、不影响功能的小骨软骨瘤可定期观察。出现疼痛、影响关节功能、有恶变可能或外观明显畸形时需要手术切除。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨软骨瘤会恶变吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>单发性骨软骨瘤恶变率低（约1%），多发性骨软骨瘤病恶变率较高（约5-10%）。如生长加速、疼痛加重应及时就医。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 骨巨细胞瘤内容 -->
        <div v-else-if="activeDisease === 'giant-cell-tumor'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (骨巨细胞瘤)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('giant-cell-tumor-guide')">骨巨细胞瘤诊疗指南</h4>
                  <p>本指南详细介绍了骨巨细胞瘤的诊断、Campanacci分级、手术方式选择（刮除vs切除）和术后辅助治疗，特别强调了降低复发率的策略...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (骨巨细胞瘤)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>骨巨细胞瘤X线诊断图谱</h4>
                <p>详细介绍骨巨细胞瘤在X线上的特征性表现，包括偏心性溶骨性破坏、皂泡样改变、皮质变薄等...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>骨巨细胞瘤</span>
                  <span>溶骨性破坏</span>
                </div>
              </div>
              <div class="article-card">
                <h4>骨巨细胞瘤MRI诊断图谱</h4>
                <p>通过MRI评估肿瘤范围、软组织侵犯、关节面受累情况，指导手术方案设计...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>骨巨细胞瘤</span>
                  <span>肿瘤范围</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (骨巨细胞瘤)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：桡骨远端骨巨细胞瘤的刮除植骨术治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                32岁女性，左腕部疼痛、肿胀2个月。X线和MRI显示左桡骨远端骨巨细胞瘤，Campanacci II级。行病灶刮除植骨术，术后配合辅助治疗...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：孙教授 (骨肿瘤科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-10-15</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-10-22</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (骨巨细胞瘤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨巨细胞瘤怎么治疗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>主要治疗方式为手术切除。根据肿瘤范围可选用刮除植骨术、病灶切除术或节段切除术。术后配合化疗可降低复发率。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨巨细胞瘤会复发吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>术后有一定的复发率，单纯刮除术后复发率约10-30%。完整切除配合辅助治疗可显著降低复发率。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 转移性骨肿瘤内容 -->
        <div v-else-if="activeDisease === 'metastatic-bone-tumor'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (转移性骨肿瘤)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('metastatic-bone-tumor-guide')">转移性骨肿瘤诊疗指南</h4>
                  <p>本指南详细介绍了转移性骨肿瘤的诊断、常见原发部位、综合治疗方案，特别强调了病理性骨折的预防和处理...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (转移性骨肿瘤)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>转移性骨肿瘤X线诊断图谱</h4>
                <p>详细介绍转移性骨肿瘤在X线上的表现，包括溶骨性、成骨性和混合性转移的特征性影像学表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>转移性骨肿瘤</span>
                  <span>骨转移</span>
                </div>
              </div>
              <div class="article-card">
                <h4>转移性骨肿瘤PET-CT诊断</h4>
                <p>通过PET-CT全面评估骨转移灶分布、原发肿瘤定位，指导综合治疗方案制定...</p>
                <div class="tag-list">
                  <span>PET-CT</span>
                  <span>骨转移</span>
                  <span>肿瘤分期</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (转移性骨肿瘤)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：乳腺癌骨转移的综合治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                58岁女性，乳腺癌术后3年，腰背部疼痛。PET-CT显示多发骨转移，包括椎体、骨盆。制定综合治疗方案，包括化疗、放疗、双膦酸盐治疗和手术预防病理性骨折...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：郑教授 (骨肿瘤科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-10-20</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-10-28</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (转移性骨肿瘤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>哪些肿瘤容易转移到骨骼？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>乳腺癌、前列腺癌、肺癌、甲状腺癌、肾癌等常见。男性以肺癌、前列腺癌多见，女性以乳腺癌多见。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>转移性骨肿瘤如何治疗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>治疗原则是综合治疗，包括原发肿瘤的化疗、放疗；骨转移的治疗包括手术（预防病理性骨折）、放疗、药物（双膦酸盐）等。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 软骨肉瘤内容 -->
        <div v-else-if="activeDisease === 'chondrosarcoma'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (软骨肉瘤)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('chondrosarcoma-guide')">软骨肉瘤诊疗指南</h4>
                  <p>本指南详细介绍了软骨肉瘤的诊断、分级、手术治疗策略，特别强调了完整切除的重要性和辅助放疗的作用...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (软骨肉瘤)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>软骨肉瘤X线诊断图谱</h4>
                <p>详细介绍软骨肉瘤在X线上的表现，包括溶骨性破坏、软骨钙化、骨膜反应等特征性影像学表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>软骨肉瘤</span>
                  <span>恶性骨肿瘤</span>
                </div>
              </div>
              <div class="article-card">
                <h4>软骨肉瘤MRI诊断图谱</h4>
                <p>通过MRI评估软骨肉瘤的范围、软组织侵犯、肿瘤分级，指导手术方案设计...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>软骨肉瘤</span>
                  <span>肿瘤分级</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (软骨肉瘤)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：骨盆软骨肉瘤的完整切除与重建</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                48岁男性，左髋部疼痛、肿胀半年。X线和MRI显示左髂骨软骨肉瘤，Enneking IB期。行肿瘤完整切除，髋关节重建术，术后辅助放疗...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：钱教授 (骨肿瘤科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-10-25</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-11-02</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (软骨肉瘤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>软骨肉瘤有什么症状？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>主要表现为局部疼痛和肿胀，生长缓慢，病程较长。疼痛多为隐痛或钝痛，夜间可加重。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>软骨肉瘤能治愈吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>早期软骨肉瘤预后较好，5年生存率可达70%以上。治疗以手术切除为主，配合辅助放疗。分化差的软骨肉瘤预后较差。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 骨质疏松症内容 -->
        <div v-else-if="activeDisease === 'osteoporosis'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (骨质疏松症)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('osteoporosis-guide')">骨质疏松症诊疗指南</h4>
                  <p>本指南详细介绍了骨质疏松症的诊断标准、风险评估、药物治疗和非药物治疗方案，特别强调了骨折风险的评估和预防策略...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (骨质疏松症)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>骨密度检测（DXA）诊断标准</h4>
                <p>详细介绍双能X线吸收测定法（DXA）的检测方法、T值和Z值的意义，骨质疏松症的诊断标准和分级...</p>
                <div class="tag-list">
                  <span>DXA</span>
                  <span>骨密度</span>
                  <span>骨质疏松</span>
                </div>
              </div>
              <div class="article-card">
                <h4>骨质疏松症的影像学表现</h4>
                <p>通过X线、CT、MRI评估骨密度降低、骨小梁稀疏、椎体压缩性骨折等影像学表现...</p>
                <div class="tag-list">
                  <span>影像学</span>
                  <span>骨小梁</span>
                  <span>压缩性骨折</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (骨质疏松症)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：绝经后女性骨质疏松症的综合治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                65岁女性，绝经15年，腰背部疼痛2年。DXA显示腰椎T值-2.8，髋部T值-2.5，诊断为骨质疏松症。制定综合治疗方案，包括钙剂、维生素D、双膦酸盐治疗和康复锻炼...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：冯教授 (内分泌科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-10-28</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-11-05</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (骨质疏松症)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>如何诊断骨质疏松？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>主要通过骨密度检测（DXA）诊断。T值≤-2.5诊断为骨质疏松；T值在-1.0到-2.5之间诊断为骨量减少；T值≥-1.0为正常。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨质疏松如何预防？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>适量补充钙剂（每日1000-1200mg）和维生素D、规律运动（负重运动）、戒烟限酒、多晒太阳、预防跌倒。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 痛风内容 -->
        <div v-else-if="activeDisease === 'gout'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (痛风)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('gout-guide')">痛风诊疗指南</h4>
                  <p>本指南详细介绍了痛风的诊断标准、急性期和缓解期的治疗方案，特别强调了降尿酸治疗的目标和注意事项...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (痛风)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>痛风性关节炎X线诊断图谱</h4>
                <p>详细介绍痛风性关节炎在X线上的表现，包括关节周围软组织肿胀、骨质侵蚀、痛风石形成等特征性影像学表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>痛风</span>
                  <span>痛风石</span>
                </div>
              </div>
              <div class="article-card">
                <h4>双能CT诊断痛风石</h4>
                <p>通过双能CT准确检测尿酸盐晶体沉积，评估痛风石的大小和分布，指导治疗方案...</p>
                <div class="tag-list">
                  <span>双能CT</span>
                  <span>尿酸盐</span>
                  <span>痛风石</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (痛风)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：反复发作痛风的规范化降尿酸治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                52岁男性，反复发作第一跖趾关节疼痛5年，血尿酸持续升高。双能CT显示多关节尿酸盐沉积，痛风石形成。制定规范化降尿酸治疗方案，包括饮食控制、药物治疗和定期监测...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：马教授 (风湿免疫科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-11-01</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-11-08</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (痛风)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>痛风急性发作怎么办？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>急性期应卧床休息、抬高患肢、局部冷敷。药物治疗包括非甾体抗炎药（如布洛芬）、秋水仙碱或糖皮质激素，需在医生指导下使用。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>痛风患者不能吃什么？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>避免高嘌呤食物：动物内脏、海鲜（贝类、虾蟹）、浓肉汤、啤酒等。多喝水（每日2000ml以上）、多吃碱性食物有助于排尿酸。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 骨软化症内容 -->
        <div v-else-if="activeDisease === 'osteomalacia'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (骨软化症)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('osteomalacia-guide')">骨软化症诊疗指南</h4>
                  <p>本指南详细介绍了骨软化症的病因、诊断、维生素D和钙剂的补充方案，特别强调了病因诊断的重要性...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (骨软化症)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>骨软化症X线诊断图谱</h4>
                <p>详细介绍骨软化症在X线上的表现，包括骨质密度降低、Looser线（假性骨折）、骨小梁模糊等特征性影像学表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>骨软化症</span>
                  <span>Looser线</span>
                </div>
              </div>
              <div class="article-card">
                <h4>骨软化症实验室检查</h4>
                <p>通过检测血清25(OH)D、1,25(OH)2D、血钙、血磷、碱性磷酸酶等指标，评估维生素D缺乏程度和代谢状态...</p>
                <div class="tag-list">
                  <span>实验室检查</span>
                  <span>维生素D</span>
                  <span>血钙血磷</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (骨软化症)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：成人维生素D缺乏性骨软化症的诊断与治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                45岁女性，长期室内工作，腰背部疼痛、肌无力1年。X线显示Looser线，实验室检查显示严重维生素D缺乏。制定维生素D和钙剂补充方案，配合日晒和康复锻炼...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：秦教授 (内分泌科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-11-05</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-11-12</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (骨软化症)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨软化症怎么治疗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>主要治疗是补充维生素D和钙剂。根据缺乏程度，可口服维生素D 1000-4000 IU/日，钙剂1000-1500mg/日。同时要多晒太阳。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨软化症有什么症状？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>主要表现为骨痛（腰背、髋部、下肢）、肌无力、活动受限，严重时可导致病理性骨折。儿童表现为佝偻病。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 佝偻病内容 -->
        <div v-else-if="activeDisease === 'rickets'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (佝偻病)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('rickets-guide')">佝偻病诊疗指南</h4>
                  <p>本指南详细介绍了佝偻病的病因、诊断、预防和治疗方案，特别强调了早期诊断和预防的重要性...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (佝偻病)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>佝偻病X线诊断图谱</h4>
                <p>详细介绍佝偻病在X线上的表现，包括干骺端增宽、毛刷样改变、杯口状变形、骨骺线增宽等特征性影像学表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>佝偻病</span>
                  <span>干骺端</span>
                </div>
              </div>
              <div class="article-card">
                <h4>佝偻病的临床诊断要点</h4>
                <p>通过临床体征（方颅、鸡胸、O型腿、X型腿）和实验室检查（25(OH)D、血钙、血磷、碱性磷酸酶）综合诊断...</p>
                <div class="tag-list">
                  <span>临床诊断</span>
                  <span>骨骼畸形</span>
                  <span>实验室检查</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (佝偻病)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：婴幼儿维生素D缺乏性佝偻病的早期诊断与治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                1岁男婴，多汗、烦躁不安、夜间哭闹3个月。X线显示桡骨远端干骺端增宽、毛刷样改变，实验室检查显示维生素D缺乏。制定维生素D和钙剂补充方案，指导日晒和喂养...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：何教授 (儿科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-11-08</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-11-15</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (佝偻病)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>佝偻病有什么早期症状？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>早期表现为烦躁不安、夜间哭闹、多汗、枕秃。后期可出现方颅、鸡胸、O型腿或X型腿、脊柱后凸或侧凸等骨骼畸形。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>如何预防佝偻病？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>新生儿生后2周起补充维生素D 400-800 IU/日；母乳喂养或混合喂养；多晒太阳（每日1-2小时）；及时添加含钙辅食。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 畸形性骨炎内容 -->
        <div v-else-if="activeDisease === 'paget-disease'" class="content-page is-active">
          <div class="content-section">
            <div class="section-header">
              <h3>科普资料 (畸形性骨炎)</h3>
              <a href="#" class="see-all">查看全部 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <i class="fas fa-file-medical guide-icon"></i>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="openGuideDetail('paget-disease-guide')">畸形性骨炎（Paget病）诊疗指南</h4>
                  <p>本指南详细介绍了Paget病的病因、诊断、治疗适应症和药物治疗方案，特别强调了双膦酸盐类药物的应用...</p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (畸形性骨炎)</h3>
              <a href="#" class="see-all">查看全部指南 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="article-grid">
              <div class="article-card">
                <h4>Paget病X线诊断图谱</h4>
                <p>详细介绍Paget病在X线上的特征性表现，包括骨质增厚、骨小梁粗大、骨皮质增厚、骨骼畸形等影像学表现...</p>
                <div class="tag-list">
                  <span>X线</span>
                  <span>Paget病</span>
                  <span>骨重建异常</span>
                </div>
              </div>
              <div class="article-card">
                <h4>Paget病骨扫描诊断</h4>
                <p>通过骨扫描评估Paget病的活动程度、多骨受累情况，指导治疗方案制定和疗效评估...</p>
                <div class="tag-list">
                  <span>骨扫描</span>
                  <span>Paget病</span>
                  <span>骨代谢</span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-header">
              <h3>经典病例讨论 (畸形性骨炎)</h3>
              <a href="#" class="see-all">查看全部案例 <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="case-study-card">
              <div class="case-study-header">
                <h4>案例：多骨受累Paget病的双膦酸盐治疗</h4>
                <span class="tag-hot">热议</span>
              </div>
              <div class="case-study-body">
                68岁男性，骨痛、下肢弯曲2年。X线和骨扫描显示骨盆、股骨、胫骨多处Paget病，碱性磷酸酶显著升高。制定双膦酸盐治疗方案，定期监测疗效...
              </div>
              <div class="case-study-footer">
                <span><i class="fas fa-user-md"></i> 主持专家：宋教授 (内分泌科)</span>
                <span><i class="fas fa-clock"></i> 发表时间: 2023-11-12</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><i class="fas fa-eye"></i> 交流详情</a>
                <a href="#"><i class="fas fa-comments"></i> 参与讨论</a>
                <a href="#"><i class="fas fa-bookmark"></i> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-11-20</span>
              </div>
            </div>
          </div>
          
          <div class="qa-section">
            <h3>简易疾病QA (畸形性骨炎)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>Paget病有什么症状？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>多数患者无症状。有症状者主要表现为骨痛、骨骼畸形（下肢弯曲、头颅增大）、病理性骨折、听力下降（颞骨受累）等。</p>
              </div>
            </div>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>Paget病需要治疗吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>无症状患者可不治疗，定期随访。有症状者可用双膦酸盐类药物（如帕米膦酸、唑来膦酸）或降钙素，可缓解骨痛、减慢病情进展。</p>
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
  },
  'spondylosis-2022': {
    title: '颈椎病诊疗指南 (2022版)',
    date: '2022-10-18',
    views: '6,210',
    content: `
      <h3>1. 分型</h3>
      <p>颈椎病分为四型：神经根型、脊髓型、椎动脉型和交感神经型。其中脊髓型颈椎病(CSM)最严重，可引起四肢麻木、无力、行走不稳等症状。</p>
      <h3>2. 诊断要点</h3>
      <p>结合症状、体征和影像学检查综合诊断。MRI显示椎间盘突出、韧带肥厚、椎管狭窄等压迫脊髓和神经根的表现。T2加权像上的脊髓高信号提示脊髓水肿或软化。</p>
      <h3>3. 治疗</h3>
      <p>保守治疗适用于轻度症状，包括药物、理疗和颈部制动。手术治疗适用于脊髓型颈椎病或保守治疗无效的患者。手术入路包括前路（ACDF、ACCF）和后路（椎板成型术、椎板切除术）。</p>
    `
  },
  'csm-consensus': {
    title: '脊髓型颈椎病(CSM)诊断与治疗专家共识',
    date: '2023-02-05',
    views: '4,119',
    content: `
      <h3>1. 早期识别</h3>
      <p>早期症状包括手指精细动作笨拙、写字变小、走路踩棉感等。体征包括Hoffmann征阳性、膝踝腱反射亢进等锥体束征。</p>
      <h3>2. 影像学评估</h3>
      <p>MRI是评估CSM的主要方法，重点关注脊髓压迫程度和T2高信号。颈椎CT可评估骨性狭窄。</p>
      <h3>3. 手术指征</h3>
      <p>确诊CSM后，早期手术治疗可获得更好的神经功能恢复。手术指征包括：轻度CSM有明显症状、中度以上CSM、MRI显示脊髓T2高信号。</p>
    `
  },
  'spinal-fracture-2023': {
    title: '脊柱骨狭窄诊疗指南 (2023版)',
    date: '2023-04-20',
    views: '2,856',
    content: `
      <h3>1. 分类</h3>
      <p>根据病因和部位将脊柱骨狭窄分为先天性狭窄、退变性狭窄、椎间盘突出性狭窄、韧带肥厚性狭窄等类型。</p>
      <h3>2. 临床评估</h3>
      <p>评估因素包括：临床症状严重程度、影像学椎管矢状径测量、神经功能损害、保守治疗效果等。椎管矢状径小于10mm属于重度狭窄。</p>
      <h3>3. 治疗</h3>
      <p>轻度狭窄可行保守治疗（药物治疗、物理治疗、康复锻炼）。中重度狭窄、保守治疗无效或出现神经功能障碍的患者需要手术治疗，包括椎板减压术、椎体融合术等。</p>
    `
  },
  'scoliosis-guide': {
    title: '青少年特发性脊柱侧弯诊疗指南',
    date: '2023-05-15',
    views: '3,124',
    content: `
      <h3>1. 诊断</h3>
      <p>通过体格检查发现脊柱侧弯、双肩不等高、腰线不对称等体征。X线测量Cobb角确诊。</p>
      <h3>2. Cobb角测量</h3>
      <p>在X线片上选择侧弯弧的最高椎体和最低椎体，测量其上下终板延长线的夹角。</p>
      <h3>3. 治疗</h3>
      <p>Cobb角小于25度：定期随访观察；25-40度：支具治疗；超过40-45度或支具无效：手术治疗，通常采用椎弓根钉内固定矫形。</p>
    `
  },
  'oa-2023': {
    title: '膝关节骨关节炎诊疗指南 (2023版)',
    date: '2023-06-10',
    views: '4,567',
    content: `
      <h3>1. 定义与分期</h3>
      <p>膝关节骨关节炎是关节软骨退变、软骨下骨硬化的退行性疾病。根据Kellgren-Lawrence分级分为0-IV级。</p>
      <h3>2. 临床表现</h3>
      <p>主要症状包括关节疼痛、晨僵、活动受限。疼痛通常与活动有关，休息后缓解。X线显示关节间隙变窄、骨赘形成、软骨下骨硬化。</p>
      <h3>3. 阶梯治疗</h3>
      <p>基础治疗：宣教、减肥、运动疗法；药物治疗：NSAIDs、软骨保护剂；关节镜手术；膝关节置换术(TKA)。</p>
    `
  },
  'meniscus-2023-2': {
    title: '半月板损伤诊疗指南 (2023版)',
    date: '2023-03-15',
    views: '3,452',
    content: `
      <h3>1. 解剖与分型</h3>
      <p>半月板分为内侧和外侧半月板，具有分散压力、稳定关节、润滑关节的作用。撕裂类型包括纵行撕裂、横行撕裂、瓣状撕裂、桶柄状撕裂和退化性撕裂。</p>
      <h3>2. MRI诊断</h3>
      <p>Stoller分级：I级点状高信号、II级线性高信号未达关节面、III级高信号达关节面诊断为撕裂。还需评估撕裂位置、长度和稳定性。</p>
      <h3>3. 治疗选择</h3>
      <p>血供区（红区）撕裂：优先缝合；无血供区（白区）撕裂：部分切除术；桶柄状撕裂：紧急手术缝合；桶柄状撕裂（超过1cm）禁做部分切除。</p>
    `
  },
  'ligament-guide': {
    title: '膝关节韧带损伤诊疗指南',
    date: '2023-07-20',
    views: '2,789',
    content: `
      <h3>1. 常见韧带损伤</h3>
      <p>前交叉韧带(ACL)、后交叉韧带(PCL)、内侧副韧带(MCL)、外侧副韧带(LCL)是膝关节的主要稳定结构。</p>
      <h3>2. 临床检查</h3>
      <p>Lachman试验、前抽屉试验用于评估ACL；后抽屉试验评估PCL；侧方应力试验评估副韧带。</p>
      <h3>3. 治疗</h3>
      <p>不完全撕裂可保守治疗（支具固定、康复锻炼）。完全撕裂、运动员或年轻患者建议重建手术。ACL重建常用自体腘绳肌腱或髌腱。</p>
    `
  },
  'anfh-2023': {
    title: '股骨头坏死诊疗指南 (2023版)',
    date: '2023-08-15',
    views: '1,956',
    content: `
      <h3>1. 病因</h3>
      <p>股骨头坏死常见原因包括创伤、激素使用、酗酒、高脂血症等。股骨颈骨折、髋关节脱位等外伤是创伤性坏死的主要原因。</p>
      <h3>2. 分期</h3>
      <p>根据Ficat分期：I期X线正常、II期骨质硬化、III期软骨下塌陷、IV期关节间隙变窄骨关节炎改变。</p>
      <h3>3. 治疗</h3>
      <p>早期（I-II期）：保髋手术（髓芯减压、植骨、带血管蒂骨瓣移植）。晚期（III-IV期）：人工髋关节置换术(THA)。</p>
    `
  },
  'trauma-guide': {
    title: '骨折与创伤诊疗指南',
    date: '2023-09-10',
    views: '2,345',
    content: `
      <h3>1. 骨折分类</h3>
      <p>根据骨折线走向分为横行、斜行、螺旋、粉碎性骨折。根据骨折稳定性分为稳定性骨折和不稳定性骨折。</p>
      <h3>2. 诊断</h3>
      <p>主要依据病史（外伤史）、症状（局部疼痛、肿胀、功能障碍）和影像学检查（X线、CT）确诊。</p>
      <h3>3. 治疗原则</h3>
      <p>复位（解剖复位或功能复位）、固定（保守固定或手术内固定）、功能锻炼。开放性骨折需紧急清创，防治感染。</p>
    `
  },
  'bone-tumor-guide': {
    title: '骨肿瘤诊疗指南',
    date: '2023-10-05',
    views: '1,567',
    content: `
      <h3>1. 分类</h3>
      <p>骨肿瘤分为良性（骨软骨瘤、骨囊肿、骨纤维结构不良等）和恶性（骨肉瘤、软骨肉瘤、Ewing肉瘤等）。</p>
      <h3>2. 临床表现</h3>
      <p>局部疼痛、肿块、病理性骨折。恶性骨肿瘤进展快，可伴发热、体重下降。血清碱性磷酸酶(ALP)升高提示恶性可能。</p>
      <h3>3. 诊断与治疗</h3>
      <p>影像学检查（X线、CT、MRI、PET-CT）和活检确诊。良性肿瘤可行病灶刮除+植骨。恶性肿瘤需手术切除（保肢或截肢）联合化疗。</p>
    `
  },
  'metabolic-guide': {
    title: '代谢性骨病诊疗指南',
    date: '2023-11-15',
    views: '1,234',
    content: `
      <h3>1. 常见类型</h3>
      <p>骨质疏松症、佝偻病/骨软化症、甲状旁腺功能亢进症、Paget骨病等。</p>
      <h3>2. 骨质疏松症</h3>
      <p>最常见，以骨密度降低为特征。诊断标准：T值≤-2.5。治疗包括钙剂、维生素D、双膦酸盐、特立帕肽等。</p>
      <h3>3. 预防</h3>
      <p>高钙饮食、适量运动、戒烟限酒、预防跌倒。绝经后女性及老年男性需定期骨密度筛查。</p>
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

const openPDF = (pdfName: string) => {
  // 脊髓型颈椎病中西医结合诊疗指南的PDF链接
  const pdfUrl = 'https://www.cacm.org.cn/wp-content/uploads/2023/06/%E8%84%8A%E9%AB%93%E5%9E%8B%E9%A2%88%E6%A4%8E%E7%97%85%E4%B8%AD%E8%A5%BF%E5%8C%BB%E7%BB%93%E5%90%88%E8%AF%8A%E7%96%97%E6%8C%87%E5%8D%97.pdf'
  window.open(pdfUrl, '_blank')
}

const openPDF2 = (pdfName: string) => {
  // 颈椎病中西医结合诊疗专家共识的PDF链接
  const pdfUrl = 'https://www.hnysfww.com/data/article/1684369255497909979.pdf'
  window.open(pdfUrl, '_blank')
}

const openPDF3 = (pdfName: string) => {
  try {
    // 腰椎间盘突出症中医循证实践指南的PDF链接
    // 备用链接（如果主链接失效，可以尝试这个）
    const pdfUrl = 'https://www.cacm.org.cn/wp-content/uploads/2023/01/%E8%85%B0%E6%A4%8E%E9%97%B4%E7%9B%98%E7%AA%81%E5%87%BA%E7%97%87%E4%B8%AD%E5%8C%BB%E5%BE%AA%E8%AF%81%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E8%8D%89%E6%A1%88.pdf'
    
    // 尝试在新窗口打开PDF
    const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    
    // 检查新窗口是否被阻止（浏览器弹窗阻止器）
    if (!newWindow || newWindow.closed) {
      ElMessageBox.confirm(
        '浏览器阻止了弹窗打开。您可以：\n1. 允许浏览器弹窗\n2. 复制链接手动打开\n\n链接：' + pdfUrl,
        'PDF打开失败',
        {
          confirmButtonText: '复制链接',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: false
        }
      ).then(() => {
        // 尝试复制链接到剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(pdfUrl).then(() => {
            ElMessage.success('链接已复制到剪贴板，您可以粘贴到浏览器地址栏打开')
          }).catch(() => {
            ElMessage.warning('无法复制链接，请手动复制：' + pdfUrl)
          })
        } else {
          // 备用方案：使用旧的复制方法
          const textArea = document.createElement('textarea')
          textArea.value = pdfUrl
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          document.body.appendChild(textArea)
          textArea.select()
          try {
            document.execCommand('copy')
            ElMessage.success('链接已复制到剪贴板')
          } catch (err) {
            ElMessage.warning('无法复制链接，请手动复制：' + pdfUrl)
          }
          document.body.removeChild(textArea)
        }
      }).catch(() => {
        // 用户取消
      })
    }
  } catch (error) {
    console.error('打开PDF失败:', error)
    ElMessage.error('打开PDF文件时发生错误：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

const openPDF4 = (pdfName: string) => {
  // 腰椎间盘突出症诊疗指南的PDF链接
  const pdfUrl = 'https://www.gszyy.com/upload/history/main/lzzgxslp/2022/7/202207131740133334.pdf'
  window.open(pdfUrl, '_blank')
}

const openPDF5 = (pdfName: string) => {
  // 腰椎管狭窄症中西医结合诊疗指南的PDF链接
  const pdfUrl = 'https://www.cacm.org.cn/wp-content/uploads/2023/06/%E8%85%B0%E6%A4%8E%E7%AE%A1%E7%8B%AD%E7%AA%84%E7%97%87%E4%B8%AD%E8%A5%BF%E5%8C%BB%E7%BB%93%E5%90%88%E8%AF%8A%E7%96%97%E6%8C%87%E5%8D%97.pdf'
  window.open(pdfUrl, '_blank')
}

const openPDF6 = (pdfName: string) => {
  // 青少年特发性脊柱侧凸治未病干预指南的PDF链接
  const pdfUrl = 'https://www.cacm.org.cn/wp-content/uploads/2023/11/%E3%80%8A%E9%9D%92%E5%B0%91%E5%B9%B4%E7%89%B9%E5%8F%91%E6%80%A7%E8%84%8A%E6%9F%B1%E4%BE%A7%E5%87%B8%E6%B2%BB%E6%9C%AA%E7%97%85%E5%B9%B2%E9%A2%84%E6%8C%87%E5%8D%97%E3%80%8B-%E5%85%AC%E7%A4%BA%E7%A8%BF.pdf'
  window.open(pdfUrl, '_blank')
}

const openPDF7 = (pdfName: string) => {
  // 膝骨关节炎中西医结合诊疗指南的PDF链接
  const pdfUrl = 'https://www.cacm.org.cn/wp-content/uploads/2023/01/%E8%86%9D%E9%AA%A8%E5%85%B3%E8%8A%82%E7%82%8E%E4%B8%AD%E8%A5%BF%E5%8C%BB%E7%BB%93%E5%90%88%E8%AF%8A%E7%96%97%E6%8C%87%E5%8D%97.pdf'
  window.open(pdfUrl, '_blank')
}

const openWebPage = (pageName: string) => {
  // 膝关节半月板损伤科普网页链接
  const webUrl = 'https://dxy.com/disease/5470/detail/0'
  window.open(webUrl, '_blank')
}

const openPDF8 = (pdfName: string) => {
  // 前交叉韧带损伤临床诊疗循证指南的PDF链接
  const pdfUrl = 'http://www.szsdsrmyy.com/attachment/0/52/52241/828719.pdf'
  window.open(pdfUrl, '_blank')
}

const openWebPage2 = (pageName: string) => {
  // 中国成人股骨头坏死临床诊疗指南（2020）的网页链接
  const webUrl = 'https://cmab.yiigle.com/uploads/guide_html/%E4%B8%AD%E5%9B%BD%E6%88%90%E4%BA%BA%E8%82%A1%E9%AA%A8%E5%A4%B4%E5%9D%8F%E6%AD%BB%E4%B8%B4%E5%BA%8A%E8%AF%8A%E7%96%97%E6%8C%87%E5%8D%97%EF%BC%882020%EF%BC%89.html'
  window.open(webUrl, '_blank')
}

const openFemoralNeckFractureGuide = () => {
  // 成人股骨颈骨折诊治指南的网页链接
  const webUrl = 'https://seleguide.yiigle.com/uploads/guide_html/%E6%88%90%E4%BA%BA%E8%82%A1%E9%AA%A8%E9%A2%88%E9%AA%A8%E6%8A%98%E8%AF%8A%E6%B2%BB%E6%8C%87%E5%8D%97.html'
  window.open(webUrl, '_blank')
}

const openDistalRadiusFractureGuide = () => {
  // 桡骨远端骨折中西医结合诊疗指南的PDF链接
  const pdfUrl = 'https://www.cacm.org.cn/wp-content/uploads/2024/08/%E6%A1%A1%E9%AA%A8%E8%BF%9C%E7%AB%AF%E9%AA%A8%E6%8A%98%E4%B8%AD%E8%A5%BF%E5%8C%BB%E7%BB%93%E5%90%88%E8%AF%8A%E7%96%97%E6%8C%87%E5%8D%97-%E5%85%AC%E7%A4%BA%E7%A8%BF.pdf'
  window.open(pdfUrl, '_blank')
}

const openSpinalCompressionFractureGuide = () => {
  // 脊柱压缩性骨折默沙东诊疗指南的网页链接
  const webUrl = 'https://www.msdmanuals.cn/home/injuries-and-poisoning/fractures/compression-fractures-of-the-spine'
  window.open(webUrl, '_blank')
}

const openAnkleFractureGuide = () => {
  // 亚洲专科医生患者教育踝关节骨折常见问题的PDF链接
  const pdfUrl = 'https://asiamedicalspecialists.hk/download/article/69/sc/Ankle_fracture_SC_SW_20201204.pdf'
  window.open(pdfUrl, '_blank')
}

const openSurgicalNeckFractureGuide = () => {
  // 肱骨外科颈骨折求医宝典的网页链接
  const webUrl = 'https://www.xqhospital.com.cn/dictionary/dictionary0202.asp?filename=1501004&keyword=%EB%C5%B9%C7%CD%E2%BF%C6%BE%B1%B9%C7%D5%DB%A3%BB%C1%D1%B7%EC%B9%C7%D5%DB'
  window.open(webUrl, '_blank')
}

const openOsteosarcomaCACAGuide = () => {
  // 中国肿瘤整合诊治指南（CACA）骨肉瘤的网页链接
  const webUrl = 'https://cacaguidelines.cacakp.com/pdflist/detail?id=48'
  window.open(webUrl, '_blank')
}

const openOsteochondromaPMPHGuide = () => {
  // 人卫临床助手 - 疾病知识库的网页链接
  const webUrl = 'https://ccdas.pmphai.com/appdisease/toPcDetail?sessionId=&knowledgeLibPrefix=disease&id=24697'
  window.open(webUrl, '_blank')
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