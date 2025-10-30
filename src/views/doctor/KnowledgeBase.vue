<template>
  <div class="knowledge-base-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <span class="iconify" data-icon="healthicons:medical-records-outline" data-inline="false" style="font-size: 28px; color: #409EFF; margin-right: 10px;"></span>
        医学影像诊断系统
      </div>
      <div class="header-right">
        <a href="#" @click.prevent="handleUpload">
          <span class="iconify" data-icon="solar:upload-outline" style="font-size: 16px;"></span> 上传知识
        </a>
        <a href="#" class="btn btn-primary" @click.prevent="handleMyLearning">
          <span class="iconify" data-icon="solar:book-bold-duotone" style="font-size: 16px;"></span> 我的学习
        </a>
        <a href="#" class="avatar">
          <span class="iconify" data-icon="ph:user-bold" style="font-size: 20px;"></span>
        </a>
        <a href="#">管理员</a>
    </div>
    </header>

    <div class="main-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>骨骼疾病分类</h2>
          <p>根据解剖部位和类型浏览</p>
        </div>
        <ul class="sidebar-nav">
          <li class="nav-item" :class="{ 'is-expanded': expandedCategories.includes('spine') }">
            <div class="nav-item-title" @click="toggleCategory('spine')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
              脊柱疾病
            </div>
            <ul class="sub-nav">
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'herniation' }" @click.prevent="showPage('herniation')">腰椎间盘突出症</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'spondylosis' }" @click.prevent="showPage('spondylosis')">颈椎病</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'spinal-fracture' }" @click.prevent="showPage('spinal-fracture')">脊柱骨折</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'spinal-deformity' }" @click.prevent="showPage('spinal-deformity')">脊柱畸形</a></li>
            </ul>
          </li>
          <li class="nav-item" :class="{ 'is-expanded': expandedCategories.includes('joint') }">
            <div class="nav-item-title" @click="toggleCategory('joint')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
              关节疾病
            </div>
            <ul class="sub-nav">
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'arthritis' }" @click.prevent="showPage('arthritis')">关节炎</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'meniscus-injury' }" @click.prevent="showPage('meniscus-injury')">半月板损伤</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'anfh' }" @click.prevent="showPage('anfh')">股骨头坏死</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'bone-soft-tumor' }" @click.prevent="showPage('bone-soft-tumor')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
              骨与软组织肿瘤
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'trauma' }" @click.prevent="showPage('trauma')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
              骨折与创伤
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'bone-tumor' }" @click.prevent="showPage('bone-tumor')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
              骨肿瘤
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'metabolic' }" @click.prevent="showPage('metabolic')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
              代谢性骨病
            </a>
          </li>
        </ul>
        <div class="sidebar-footer">
          <a href="#">查看全部分类</a>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
        <!-- Search Module -->
        <div class="search-module">
          <h3>智能医学知识检索</h3>
          <div class="search-box">
            <input 
              type="text" 
              placeholder="搜索疾病名称、症状、征象、解剖部位、影像表现或关键词..."
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            >
            <button @click="handleSearch">
              <span class="iconify" data-icon="solar:magnifer-bold" style="font-size: 18px;"></span> 检索
            </button>
          </div>
          <div class="search-links">
            热门搜索:
            <a href="#" @click.prevent="searchByKeyword('半月板损伤')">半月板损伤</a>
            <a href="#" @click.prevent="searchByKeyword('骨折分型')">骨折分型</a>
            <a href="#" @click.prevent="searchByKeyword('MRI征象')">MRI征象</a>
            <a href="#">... 更多</a>
        </div>
      </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="search-results-page">
          <div class="content-section">
            <div class="section-header">
              <h3>搜索结果</h3>
              <p class="search-result-count">找到 {{ searchResults.length }} 条结果</p>
            </div>
            <div class="guide-list">
              <div class="guide-item" v-for="(result, index) in searchResults" :key="index">
                <span class="iconify guide-icon" :data-icon="result.icon" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a v-if="result.url" :href="result.url" target="_blank">{{ result.title }}</a>
                    <span v-else>{{ result.title }}</span>
                  </h4>
                  <p>{{ result.description }}</p>
                  <div class="guide-meta">
                    <span v-if="result.date"><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> {{ result.date }}</span>
                    <span v-if="result.doctor"><span class="iconify" data-icon="solar:user-id-bold" style="font-size: 14px;"></span> {{ result.doctor }}</span>
                    <span v-if="result.journal"><span class="iconify" data-icon="solar:journal-bold" style="font-size: 14px;"></span> {{ result.journal }}</span>
                    <span v-if="result.category"><span class="iconify" data-icon="solar:tag-bold" style="font-size: 14px;"></span> {{ result.category }}</span>
                    <span v-if="result.imageCount"><span class="iconify" data-icon="solar:image-bold" style="font-size: 14px;"></span> {{ result.imageCount }} 张影像</span>
                    <span v-if="result.views"><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> {{ result.views }} 查看</span>
                    <a v-if="result.url" :href="result.url" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> 查看详情</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links Grid -->
        <div v-if="!searchQuery" class="quick-links-grid">
          <a class="quick-card" @click.prevent="showAllGuides">
            <span class="iconify card-icon iconify-c1" data-icon="solar:document-text-bold-duotone" style="font-size: 40px;"></span>
            <div class="card-content">
              <h4>诊断指南</h4>
              <p>临床实践标准，治疗规范</p>
              <span class="count">128 篇指南</span>
            </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
          </a>
          <a class="quick-card" @click.prevent="showAllAtlases">
            <span class="iconify card-icon iconify-c2" data-icon="solar:gallery-wide-bold-duotone" style="font-size: 40px;"></span>
            <div class="card-content">
              <h4>影像图谱</h4>
              <p>多种征象对比，智能标注</p>
              <span class="count">356 组图谱</span>
            </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
          </a>
          <a class="quick-card" @click.prevent="showAllCases">
            <span class="iconify card-icon iconify-c3" data-icon="solar:case-bold-duotone" style="font-size: 40px;"></span>
            <div class="card-content">
              <h4>临床案例</h4>
              <p>详细诊疗过程，多学科讨论</p>
              <span class="count">245 个案例</span>
            </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
          </a>
          <a class="quick-card" @click.prevent="showAllLiterature">
            <span class="iconify card-icon iconify-c4" data-icon="solar:notebook-bold-duotone" style="font-size: 40px;"></span>
            <div class="card-content">
              <h4>医学文献</h4>
              <p>前沿研究进展，指南解读</p>
              <span class="count">512 篇文献</span>
            </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear" style="font-size: 16px;"></span>
          </a>
        </div>

        <!-- Content Pages -->
        <!-- Herniation Page -->
        <div v-if="activePage === 'herniation'" class="content-page">
          <div class="content-section">
            <h3>腰椎间盘突出症</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>腰椎间盘突出症（LDH）是指腰椎间盘退变、纤维环破裂、髓核突出，压迫神经根或马尾神经而引起的一系列临床症状。是最常见的脊柱疾病之一。</p>
              
              <h4>病因和病理机制</h4>
              <ul>
                <li>退行性病变：椎间盘随年龄增长而退变，含水量减少</li>
                <li>外伤因素：急性外伤或慢性劳损</li>
                <li>遗传因素：有家族聚集性</li>
                <li>职业因素：长期坐姿、重体力劳动、振动</li>
              </ul>

              <h4>临床表现</h4>
              <ul>
                <li>腰痛：最常见首发症状</li>
                <li>下肢放射痛：沿神经分布区域放射</li>
                <li>感觉异常：麻木、感觉减退或过敏</li>
                <li>运动障碍：肌力下降、肌肉萎缩</li>
                <li>马尾综合征：大小便功能障碍、鞍区麻木（急诊）</li>
              </ul>

              <h4>影像学表现</h4>
              <ul>
                <li><strong>X线：</strong>椎间隙变窄、骨质增生、生理曲度改变</li>
                <li><strong>MRI：</strong>诊断金标准，可显示椎间盘突出的部位、程度、类型</li>
                <ul>
                  <li>突出类型：膨出、突出、脱出、游离</li>
                  <li>突出方向：中央型、旁中央型、外侧型、极外侧型</li>
                  <li>神经受压程度：轻度、中度、重度</li>
                </ul>
                <li><strong>CT：</strong>清晰显示骨性结构和钙化</li>
              </ul>

              <h4>临床分型</h4>
              <ul>
                <li>Ⅰ型：仅腰痛，无下肢症状</li>
                <li>Ⅱ型：腰痛伴下肢放射痛</li>
                <li>Ⅲ型：下肢症状为主，腰痛轻微</li>
                <li>Ⅳ型：马尾综合征或严重神经功能障碍</li>
              </ul>

              <h4>治疗原则</h4>
              <ul>
                <li>保守治疗：卧床休息、物理治疗、药物治疗、硬膜外注射</li>
                <li>手术指征：</li>
                <ul>
                  <li>保守治疗3-6个月无效</li>
                  <li>马尾综合征（急诊手术）</li>
                  <li>进行性运动功能障碍</li>
                  <li>严重疼痛影响生活</li>
                </ul>
                <li>手术方式：椎间盘摘除术、椎间融合术、人工椎间盘置换</li>
              </ul>
              </div>
            </div>
            </div>

        <!-- Other Disease Pages -->
        <div v-if="activePage === 'spondylosis'" class="content-page">
          <div class="content-section">
            <h3>颈椎病</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>颈椎病是由于颈椎间盘退行性病变、颈椎骨质增生、韧带肥厚或钙化等原因引起的一系列临床症状综合征。主要表现为颈肩痛、上肢麻木、头晕、头痛等症状。</p>
              
              <h4>临床表现</h4>
              <ul>
                <li>颈部疼痛和僵硬，活动受限</li>
                <li>上肢放射性疼痛、麻木、无力</li>
                <li>头晕、头痛、眩晕</li>
                <li>行走不稳、下肢无力</li>
                <li>吞咽困难、视力模糊等少见症状</li>
              </ul>

              <h4>影像学表现</h4>
              <ul>
                <li><strong>X线：</strong>颈椎曲度改变、椎间隙变窄、骨质增生、椎体不稳</li>
                <li><strong>MRI：</strong>椎间盘突出、脊髓受压、神经根受压、椎管狭窄</li>
                <li><strong>CT：</strong>骨赘形成、椎管狭窄程度、后纵韧带骨化</li>
              </ul>

              <h4>分型</h4>
              <ul>
                <li>神经根型：最常见的类型，表现为神经根受压症状</li>
                <li>脊髓型：症状最严重，脊髓受压导致功能障碍</li>
                <li>椎动脉型：椎动脉受压导致脑供血不足</li>
                <li>交感神经型：交感神经受刺激引起症状</li>
              </ul>

              <h4>治疗原则</h4>
              <ul>
                <li>保守治疗：物理治疗、药物治疗、颈部固定</li>
                <li>手术治疗：保守治疗无效或症状严重时考虑手术</li>
                <li>预防措施：改善生活习惯、适当锻炼、避免长时间低头</li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="activePage === 'spinal-fracture'" class="content-page">
          <div class="content-section">
            <h3>脊柱骨折</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>脊柱骨折是脊柱骨性结构的完整性遭到破坏，常见于外伤、骨质疏松、肿瘤等。根据骨折部位和稳定性可分为多种类型。</p>
              
              <h4>病因</h4>
              <ul>
                <li>外伤：车祸、高处坠落、暴力撞击</li>
                <li>骨质疏松：多见于老年人，轻微外伤即可发生</li>
                <li>肿瘤性骨折：原发或转移性骨肿瘤</li>
                <li>病理性骨折：感染、代谢性疾病等</li>
              </ul>

              <h4>影像学表现</h4>
              <ul>
                <li><strong>X线：</strong>椎体变形、高度丢失、骨折线、后凸畸形</li>
                <li><strong>CT：</strong>清晰显示骨折线、碎片移位、椎管占位</li>
                <li><strong>MRI：</strong>评估脊髓损伤、软组织血肿、骨髓水肿</li>
              </ul>

              <h4>Denis三柱分类</h4>
              <ul>
                <li>前柱：前纵韧带、椎体前2/3、纤维环前部</li>
                <li>中柱：椎体后1/3、纤维环后部、后纵韧带</li>
                <li>后柱：椎弓、棘突、关节突、黄韧带、棘间韧带</li>
              </ul>

              <h4>治疗原则</h4>
              <ul>
                <li>稳定型骨折：保守治疗，支具固定</li>
                <li>不稳定型骨折：手术治疗，内固定或融合</li>
                <li>伴有神经损伤：紧急手术减压</li>
                <li>老年骨质疏松骨折：椎体成形术或后凸成形术</li>
              </ul>
          </div>
        </div>
      </div>

        <div v-if="activePage === 'spinal-deformity'" class="content-page">
          <div class="content-section">
            <h3>脊柱畸形</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>脊柱畸形是指脊柱在矢状面或冠状面上的异常弯曲，包括脊柱侧凸、脊柱后凸、脊柱前凸等。可导致外观畸形和功能障碍。</p>
              
              <h4>类型</h4>
              <ul>
                <li>特发性脊柱侧凸：最常见，病因不明，多见于青少年</li>
                <li>先天性脊柱侧凸：椎体发育异常</li>
                <li>退行性脊柱侧凸：椎间盘退变导致</li>
                <li>脊柱后凸：驼背畸形</li>
              </ul>

              <h4>临床表现</h4>
              <ul>
                <li>外观畸形：肩膀不等高、腰部不对称</li>
                <li>疼痛：背部、腰部疼痛</li>
                <li>功能障碍：活动受限、心肺功能受损</li>
                <li>心理影响：影响生活质量</li>
              </ul>

              <h4>影像学评估</h4>
              <ul>
                <li>Cobb角：测量侧凸程度的标准方法</li>
                <li>旋转度数：评估椎体旋转程度</li>
                <li>生长发育评估：Risser征、骨龄评估</li>
              </ul>

              <h4>治疗指征</h4>
              <ul>
                <li>轻度（&lt;25°）：观察、物理治疗</li>
                <li>中度（25-45°）：支具治疗</li>
                <li>重度（&gt;45°）：手术治疗</li>
                <li>进展迅速：早期手术治疗</li>
              </ul>
                </div>
          </div>
        </div>
        
        <div v-if="activePage === 'arthritis'" class="content-page">
          <div class="content-section">
            <h3>骨关节炎</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>骨关节炎（OA）是最常见的关节疾病，是一种以关节软骨退行性病变为核心特征的慢性关节病。多见于中老年人，膝关节和髋关节最常受累。</p>
              
              <h4>病因和危险因素</h4>
              <ul>
                <li>年龄：患病率随年龄增长而增加</li>
                <li>性别：女性患病率高于男性</li>
                <li>肥胖：增加关节负重</li>
                <li>外伤：关节损伤导致继发性OA</li>
                <li>遗传因素：有家族聚集性</li>
                  </ul>

              <h4>临床表现</h4>
              <ul>
                <li>关节疼痛：活动后加重，休息缓解</li>
                <li>关节僵硬：晨僵时间短于30分钟</li>
                <li>关节肿胀：软组织肿胀</li>
                <li>活动受限：关节活动度减少</li>
                <li>关节畸形：晚期出现关节畸形</li>
              </ul>

              <h4>影像学表现</h4>
              <ul>
                <li><strong>X线：</strong>关节间隙变窄、骨赘形成、软骨下骨硬化、骨囊肿</li>
                <li><strong>MRI：</strong>软骨损伤、骨髓水肿、滑膜炎、韧带损伤</li>
                <li>Kellgren-Lawrence分级：0-4级严重程度分级</li>
              </ul>

              <h4>治疗原则</h4>
              <ul>
                <li>非药物治疗：运动疗法、体重管理、物理治疗、辅助器具</li>
                <li>药物治疗：NSAIDs、止痛药、关节腔注射</li>
                <li>手术治疗：关节镜清理、截骨术、关节置换术</li>
              </ul>
                  </div>
          </div>
          </div>

        <div v-if="activePage === 'meniscus-injury'" class="content-page">
          <div class="content-section">
            <h3>半月板损伤</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>半月板是膝关节内C形的纤维软骨结构，位于股骨和胫骨之间，具有缓冲、稳定、润滑关节的作用。半月板损伤是膝关节最常见的损伤之一。</p>
              
              <h4>病因</h4>
              <ul>
                <li>外伤性损伤：旋转暴力、急停急转运动</li>
                <li>退行性损伤：随年龄增长，半月板退变</li>
                <li>解剖因素：盘状半月板、先天性发育异常</li>
                  </ul>

              <h4>临床表现</h4>
              <ul>
                <li>膝关节疼痛：内侧或外侧关节间隙疼痛</li>
                <li>关节交锁：关节卡住不能伸直或屈曲</li>
                <li>弹响：活动时关节弹响</li>
                <li>肿胀：急性期关节肿胀</li>
                <li>活动受限：下蹲困难、上下楼疼痛</li>
              </ul>

              <h4>影像学表现</h4>
              <ul>
                <li><strong>MRI：</strong>最佳检查方法</li>
                <ul>
                  <li>高信号延伸到关节面：Ⅱ度损伤</li>
                  <li>高信号完全穿透关节面：Ⅲ度损伤</li>
                  <li>半月板撕裂：水平、垂直、放射状、桶柄样撕裂</li>
                </ul>
                <li>关节镜：诊断金标准，可同时治疗</li>
              </ul>

              <h4>治疗</h4>
              <ul>
                <li>保守治疗：急性期休息、冰敷、制动、抗炎治疗</li>
                <li>手术治疗：关节镜下半月板修复或部分切除</li>
                <li>康复训练：术后康复训练恢复关节功能</li>
              </ul>
                  </div>
          </div>
            </div>

        <div v-if="activePage === 'anfh'" class="content-page">
          <div class="content-section">
            <h3>股骨头坏死</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>股骨头坏死（ANFH）是由于股骨头血供中断或受损，导致骨细胞死亡和骨小梁塌陷的疾病。多见于中青年，严重影响髋关节功能。</p>
              
              <h4>病因</h4>
              <ul>
                <li>创伤性：股骨颈骨折、髋关节脱位</li>
                <li>非创伤性：糖皮质激素使用、酒精滥用、血液病</li>
                <li>特发性：无明显诱因</li>
                  </ul>

              <h4>临床表现</h4>
              <ul>
                <li>髋部疼痛：早期轻度疼痛，晚期剧痛</li>
                <li>活动受限：髋关节活动度减少</li>
                <li>跛行：行走时跛行</li>
                <li>肌肉萎缩：臀肌、大腿肌肉萎缩</li>
              </ul>

              <h4>影像学分期（Ficat分期）</h4>
              <ul>
                <li>0期：无临床症状，MRI异常</li>
                <li>Ⅰ期：X线正常，MRI或骨扫描异常</li>
                <li>Ⅱ期：X线示硬化、囊性变，无塌陷</li>
                <li>Ⅲ期：软骨下塌陷（新月征），股骨头变形</li>
                <li>Ⅳ期：骨关节炎改变，关节间隙变窄</li>
              </ul>

              <h4>治疗</h4>
              <ul>
                <li>保守治疗：限制负重、药物治疗、物理治疗</li>
                <li>保髋手术：髓芯减压、植骨术、截骨术、带血管骨移植</li>
                <li>关节置换：严重塌陷、保守治疗无效</li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="activePage === 'trauma'" class="content-page">
          <div class="content-section">
            <h3>骨折与创伤</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>骨折是指骨的完整性或连续性中断，是骨科最常见的疾病。根据病因可分为创伤性骨折、病理性骨折和应力性骨折。</p>
              
              <h4>骨折分类</h4>
              <ul>
                <li>按骨折线形态：横形、斜形、螺旋形、粉碎性、嵌插性、压缩性</li>
                <li>按骨折程度：完全性骨折、不完全性骨折（裂隙骨折、青枝骨折）</li>
                <li>按骨折端稳定程度：稳定性骨折、不稳定性骨折</li>
                <li>按皮肤完整性：闭合性骨折、开放性骨折</li>
              </ul>

              <h4>临床表现</h4>
              <ul>
                <li>局部症状：疼痛、肿胀、瘀斑、功能障碍</li>
                <li>特有体征：畸形、异常活动、骨擦音或骨擦感</li>
                <li>全身症状：休克、发热（开放性骨折感染）</li>
              </ul>

              <h4>影像学检查</h4>
              <ul>
                <li><strong>X线：</strong>正侧位片，必要时加斜位或切线位</li>
                <li><strong>CT：</strong>复杂性骨折，三维重建</li>
                <li><strong>MRI：</strong>评估软组织损伤、骨髓水肿、隐匿性骨折</li>
              </ul>

              <h4>治疗原则</h4>
              <ul>
                <li>急救处理：止血、包扎、固定、转运</li>
                <li>复位：手法复位或手术复位</li>
                <li>固定：外固定（石膏、支具）或内固定（钢板、髓内钉）</li>
                <li>康复：早期功能锻炼、物理治疗</li>
              </ul>

              <h4>常见骨折</h4>
              <ul>
                <li>桡骨远端骨折（Colles骨折）：最常见腕部骨折</li>
                <li>股骨颈骨折：老年人常见，并发症多</li>
                <li>胫骨平台骨折：高能量损伤，关节内骨折</li>
                <li>踝关节骨折：三踝骨折、分度复杂</li>
                <li>椎体压缩性骨折：骨质疏松性骨折</li>
              </ul>
                </div>
              </div>
            </div>

        <div v-if="activePage === 'bone-tumor'" class="content-page">
          <div class="content-section">
            <h3>骨肿瘤</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>骨肿瘤分为原发性骨肿瘤和转移性骨肿瘤。原发性骨肿瘤包括良性和恶性，转移性骨肿瘤多为恶性。</p>
              
              <h4>良性骨肿瘤</h4>
              <ul>
                <li>骨软骨瘤：最常见的良性骨肿瘤</li>
                <li>内生软骨瘤：好发于手足短骨</li>
                <li>骨样骨瘤：夜间疼痛明显</li>
                <li>骨巨细胞瘤：潜在恶性，好发于长骨骨端</li>
                  </ul>

              <h4>恶性骨肿瘤</h4>
              <ul>
                <li>骨肉瘤：最常见的原发恶性骨肿瘤，好发于青少年</li>
                <li>软骨肉瘤：原发恶性软骨肿瘤</li>
                <li>尤文肉瘤：儿童恶性小圆细胞肿瘤</li>
                <li>转移性骨肿瘤：成人最常见恶性肿瘤，原发灶多来自肺、乳腺、前列腺</li>
              </ul>

              <h4>临床表现</h4>
              <ul>
                <li>疼痛：持续性疼痛，夜间加重</li>
                <li>肿胀：局部肿胀、肿块</li>
                <li>功能障碍：关节活动受限</li>
                <li>病理性骨折</li>
                <li>全身症状：恶性骨肿瘤可有发热、消瘦、贫血</li>
              </ul>

              <h4>影像学表现</h4>
              <ul>
                <li><strong>X线：</strong>骨质破坏、骨膜反应、软组织肿块</li>
                <li><strong>CT：</strong>清晰显示骨质破坏和软组织侵犯</li>
                <li><strong>MRI：</strong>评估髓内侵犯范围、软组织肿块</li>
                <li><strong>PET-CT：</strong>评估转移、分期</li>
              </ul>

              <h4>治疗原则</h4>
              <ul>
                <li>良性肿瘤：观察、刮除、完整切除</li>
                <li>恶性肿瘤：术前化疗、手术切除、术后化疗、放疗</li>
                <li>保肢手术：假体置换、异体骨移植、瘤段切除</li>
                <li>截肢：无法保肢或复发病例</li>
              </ul>
                  </div>
          </div>
        </div>

        <div v-if="activePage === 'metabolic'" class="content-page">
          <div class="content-section">
            <h3>代谢性骨病</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>代谢性骨病是由于骨代谢异常导致的一系列疾病，主要包括骨质疏松症、佝偻病/骨软化症、原发性甲状旁腺功能亢进等。</p>
              
              <h4>骨质疏松症</h4>
              <ul>
                <li>定义：骨密度降低、骨质量下降的全身性疾病</li>
                <li>病因：年龄增长、绝经、营养缺乏、药物因素</li>
                <li>临床表现：骨痛、身高缩短、驼背、脆性骨折</li>
                <li>诊断：骨密度检测T值≤-2.5</li>
                <li>治疗：钙剂、维生素D、双膦酸盐、降钙素等</li>
                  </ul>

              <h4>佝偻病和骨软化症</h4>
              <ul>
                <li>定义：维生素D缺乏导致的骨矿化障碍</li>
                <li>儿童：佝偻病，成人：骨软化症</li>
                <li>临床表现：骨痛、肌无力、骨骼畸形</li>
                <li>影像学：骨质密度减低、骨小梁模糊</li>
                <li>治疗：补充维生素D和钙剂</li>
              </ul>

              <h4>原发性甲状旁腺功能亢进</h4>
              <ul>
                <li>定义：甲状旁腺激素分泌过多</li>
                <li>临床表现：骨痛、骨折、肾结石、消化系统症状</li>
                <li>影像学：骨质吸收、纤维囊性骨炎</li>
                <li>治疗：手术切除甲状旁腺腺瘤</li>
              </ul>

              <h4>影像学表现</h4>
              <ul>
                <li><strong>X线：</strong>骨质密度减低、骨小梁稀少、皮质变薄</li>
                <li><strong>骨扫描：</strong>评估骨代谢活性</li>
                <li><strong>骨密度检测：</strong>诊断金标准</li>
              </ul>
                  </div>
          </div>
        </div>

        <div v-if="activePage === 'bone-soft-tumor'" class="content-page">
          <div class="content-section">
            <h3>骨与软组织肿瘤</h3>
            <div class="knowledge-content">
              <h4>定义</h4>
              <p>骨与软组织肿瘤涵盖骨、肌肉、神经、血管、脂肪等组织的肿瘤性疾病。诊断需要结合临床表现、影像学和病理学。</p>
              
              <h4>软组织肿瘤</h4>
              <ul>
                <li>良性：脂肪瘤、血管瘤、神经纤维瘤、腱鞘巨细胞瘤</li>
                <li>恶性：脂肪肉瘤、横纹肌肉瘤、滑膜肉瘤、恶性纤维组织细胞瘤</li>
                  </ul>

              <h4>影像学检查</h4>
              <ul>
                <li><strong>超声：</strong>初步评估软组织肿块</li>
                <li><strong>MRI：</strong>最佳检查方法，显示肿瘤范围、与周围关系</li>
                <li><strong>CT：</strong>评估骨破坏、钙化</li>
                <li><strong>活检：</strong>诊断金标准</li>
              </ul>

              <h4>分期系统</h4>
              <ul>
                <li>TNM分期：T（肿瘤大小）、N（淋巴结）、M（转移）</li>
                <li>Enneking分期：用于骨与软组织肉瘤</li>
              </ul>

              <h4>治疗原则</h4>
              <ul>
                <li>良性肿瘤：观察或完整切除</li>
                <li>恶性肿瘤：综合治疗（化疗+手术+放疗）</li>
                <li>边缘切除：保证阴性切缘</li>
                <li>保肢优先：保留肢体功能</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- All Guides Page -->
        <div v-if="activePage === 'all-guides'" class="content-page">
          <h2 class="aggregate-page-title">所有诊断指南</h2>
          
          <div class="content-section">
            <h3 class="disease-group-title">脊柱疾病</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.orthopchina.org.cn/" target="_blank">腰椎间盘突出症诊疗指南 (2023版)</a>
                  </h4>
                  <p>本指南由中华医学会骨科学分会编写。系统阐述了腰椎间盘突出症的流行病学、发病机制、临床表现、影像学诊断、分型、治疗原则和手术指征等。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-01-10</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 1,893 查看</span>
                    <a href="https://www.orthopchina.org.cn/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> PDF 下载</a>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.nature.com/articles/s41572-020-00277-0" target="_blank">颈椎病诊断与治疗指南</a>
                  </h4>
                  <p>国际权威期刊发布的颈椎病诊疗指南，涵盖神经根型、脊髓型、椎动脉型等多种颈椎病的诊断标准和治疗方案。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2022-08-15</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 2,456 查看</span>
                    <a href="https://www.nature.com/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> PDF 下载</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">关节疾病</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.oarsi.org/" target="_blank">骨关节炎诊疗指南 (OARSI)</a>
                  </h4>
                  <p>国际骨关节炎研究学会(OARSI)最新指南，提供基于循证的骨关节炎诊断和治疗建议，涵盖膝关节、髋关节等多部位。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-05-20</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 3,789 查看</span>
                    <a href="https://www.oarsi.org/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> PDF 下载</a>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.esska.org/" target="_blank">半月板损伤诊疗共识</a>
                  </h4>
                  <p>欧洲运动医学与膝关节镜学会的半月板损伤诊疗共识，详细阐述MRI分型、保守治疗指征和手术技术选择。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-03-18</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 1,234 查看</span>
                    <a href="https://www.esska.org/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> PDF 下载</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">骨折与创伤</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.ao-foundation.org/" target="_blank">骨折分型指南 (AO/OTA)</a>
                  </h4>
                  <p>国际内固定研究协会(AO)骨折分型系统，为骨折分类、治疗方案选择和预后评估提供标准化依据。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2022-12-01</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 5,678 查看</span>
                    <a href="https://www.ao-foundation.org/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> PDF 下载</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Atlases Page -->
        <div v-if="activePage === 'all-atlases'" class="content-page">
          <h2 class="aggregate-page-title">所有影像图谱</h2>
          
          <div class="content-section">
            <h3 class="disease-group-title">脊柱影像</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:gallery-wide-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://radiopaedia.org/" target="_blank">腰椎间盘突出MRI影像图谱</a>
                  </h4>
                  <p>包含腰椎间盘突出症的MRI典型征象、分型示意图、与正常椎间盘的对比，以及各型突出的影像特征详解。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:image-bold" style="font-size: 14px;"></span> 256 张影像</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 8,923 查看</span>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:gallery-wide-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://radiopaedia.org/" target="_blank">脊柱骨折X光与CT对比图</a>
                  </h4>
                  <p>详细展示各类脊柱骨折的X线、CT和MRI表现，包含Denis三柱分类示意图和骨折稳定性评估标准。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:image-bold" style="font-size: 14px;"></span> 312 张影像</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 6,445 查看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">关节影像</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:gallery-wide-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://radiopaedia.org/" target="_blank">膝关节半月板损伤MRI征象</a>
                  </h4>
                  <p>半月板正常MRI表现、Ⅰ-Ⅲ度损伤分级标准、各类撕裂形态（水平、垂直、放射状、桶柄样）的影像特征。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:image-bold" style="font-size: 14px;"></span> 189 张影像</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 12,567 查看</span>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:gallery-wide-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://radiopaedia.org/" target="_blank">骨关节炎影像学分级图谱</a>
                  </h4>
                  <p>Kellgren-Lawrence分级的X线标准影像，关节间隙狭窄、骨赘形成、软骨下骨硬化等征象的量化评估。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:image-bold" style="font-size: 14px;"></span> 145 张影像</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 9,234 查看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">肿瘤影像</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:gallery-wide-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://radiopaedia.org/" target="_blank">骨肿瘤影像诊断图谱</a>
                  </h4>
                  <p>良恶性骨肿瘤的X线、CT、MRI鉴别要点，骨膜反应、骨质破坏模式、软组织肿块等典型征象。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:image-bold" style="font-size: 14px;"></span> 423 张影像</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 7,123 查看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Cases Page -->
        <div v-if="activePage === 'all-cases'" class="content-page">
          <h2 class="aggregate-page-title">所有临床案例</h2>
          
          <div class="content-section">
            <h3 class="disease-group-title">脊柱外科案例</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:case-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://casereports.bmj.com/" target="_blank">青年男性腰椎间盘突出症手术治疗案例</a>
                  </h4>
                  <p>患者男性，28岁，急性起病，左侧下肢放射性疼痛，影像学显示L4-L5椎间盘突出。行椎间盘摘除术后症状完全缓解，术后康复过程及随访结果。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:user-id-bold" style="font-size: 14px;"></span> 张医生</span>
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-08-15</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 3,456 查看</span>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:case-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://casereports.bmj.com/" target="_blank">颈椎病多节段病变手术案例</a>
                  </h4>
                  <p>患者女性，62岁，渐进性双手麻木、行走不稳，MRI显示多节段颈椎间盘突出伴椎管狭窄。行前路颈椎间盘摘除植骨融合内固定术。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:user-id-bold" style="font-size: 14px;"></span> 李医生</span>
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-07-20</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 4,567 查看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">关节外科案例</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:case-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://casereports.bmj.com/" target="_blank">半月板桶柄样撕裂关节镜修复案例</a>
                  </h4>
                  <p>患者男性，25岁，运动损伤导致膝关节交锁。MRI确诊内侧半月板桶柄样撕裂，行关节镜下半月板缝合修复术，术后早期康复训练方案。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:user-id-bold" style="font-size: 14px;"></span> 王医生</span>
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-09-05</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 5,123 查看</span>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:case-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://casereports.bmj.com/" target="_blank">股骨头坏死保髋手术案例</a>
                  </h4>
                  <p>患者男性，35岁，长期服用激素导致双侧股骨头坏死Ficat III期。采用带血管游离腓骨移植术保髋治疗，术后随访3年效果良好。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:user-id-bold" style="font-size: 14px;"></span> 刘医生</span>
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-06-10</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 3,890 查看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">创伤骨科案例</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:case-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://casereports.bmj.com/" target="_blank">胫骨平台骨折内固定术案例</a>
                  </h4>
                  <p>患者女性，48岁，车祸导致左侧胫骨平台骨折（Schatzker V型）。行切开复位钢板内固定术，术后早期负重训练时机与康复计划。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:user-id-bold" style="font-size: 14px;"></span> 陈医生</span>
                    <span><span class="iconify" data-icon="solar:calendar-date-bold" style="font-size: 14px;"></span> 2023-08-28</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 2,345 查看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- All Literature Page -->
        <div v-if="activePage === 'all-literature'" class="content-page">
          <h2 class="aggregate-page-title">所有医学文献</h2>
          
          <div class="content-section">
            <h3 class="disease-group-title">脊柱疾病研究</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:notebook-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.sciencedirect.com/" target="_blank">腰椎间盘退变的分子机制研究进展</a>
                  </h4>
                  <p>综述腰椎间盘退变的病理生理机制、细胞外基质降解、炎症反应和神经长入的分子生物学研究现状。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:journal-bold" style="font-size: 14px;"></span> Spine Journal 2023</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 6,789 查看</span>
                    <a href="https://www.sciencedirect.com/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> 全文阅读</a>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:notebook-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.nature.com/" target="_blank">AI辅助脊柱影像诊断的准确性评估</a>
                  </h4>
                  <p>深度学习算法在脊柱MRI自动诊断中的应用，对比AI诊断与放射科医师诊断的准确性和一致性。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:journal-bold" style="font-size: 14px;"></span> Nature Medicine 2023</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 8,456 查看</span>
                    <a href="https://www.nature.com/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> 全文阅读</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">关节疾病研究</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:notebook-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.thelancet.com/" target="_blank">骨关节炎的药物治疗新进展</a>
                  </h4>
                  <p>探讨非甾体抗炎药、关节腔注射剂、生物制剂等骨关节炎治疗方案的有效性和安全性循证医学证据。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:journal-bold" style="font-size: 14px;"></span> The Lancet 2023</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 10,234 查看</span>
                    <a href="https://www.thelancet.com/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> 全文阅读</a>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:notebook-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.nejm.org/" target="_blank">半月板修复vs切除术的长期随访研究</a>
                  </h4>
                  <p>10年随访研究比较半月板缝合修复与部分切除术的患者满意度、功能恢复和继发性骨关节炎发生率。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:journal-bold" style="font-size: 14px;"></span> NEJM 2023</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 7,890 查看</span>
                    <a href="https://www.nejm.org/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> 全文阅读</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">骨肿瘤研究</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:notebook-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.cell.com/" target="_blank">骨肉瘤的免疫治疗新策略</a>
                  </h4>
                  <p>探讨PD-1抑制剂、CAR-T细胞疗法等在骨肉瘤治疗中的应用前景，结合传统化疗的协同效应。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:journal-bold" style="font-size: 14px;"></span> Cell 2023</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 5,678 查看</span>
                    <a href="https://www.cell.com/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> 全文阅读</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h3 class="disease-group-title">骨科技术革新</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:notebook-bold-duotone" style="font-size: 36px;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link">
                    <a href="https://www.science.org/" target="_blank">3D打印在骨科精准治疗中的应用</a>
                  </h4>
                  <p>3D打印技术在定制化植入物、手术导板、个性化假体设计和骨折复位中的应用现状与发展趋势。</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:journal-bold" style="font-size: 14px;"></span> Science 2023</span>
                    <span><span class="iconify" data-icon="solar:eye-bold" style="font-size: 14px;"></span> 9,123 查看</span>
                    <a href="https://www.science.org/" target="_blank"><span class="iconify" data-icon="bxs:file-pdf" style="font-size: 14px;"></span> 全文阅读</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')
const activePage = ref('herniation')
const expandedCategories = ref(['spine'])
const searchResults = ref<any[]>([])

// 完整知识库数据
const knowledgeDatabase = ref([
  // 诊断指南
  {
    title: '腰椎间盘突出症诊疗指南 (2023版)',
    description: '本指南由中华医学会骨科学分会编写。系统阐述了腰椎间盘突出症的流行病学、发病机制、临床表现、影像学诊断、分型、治疗原则和手术指征等。',
    url: 'https://www.orthopchina.org.cn/',
    date: '2023-01-10',
    views: '1,893',
    category: '脊柱疾病',
    icon: 'solar:document-add-bold-duotone',
    keywords: '腰椎间盘突出症,腰椎,椎间盘,突出症,髓核,纤维环,神经根,马尾综合征,L4-L5,保守治疗,手术治疗,椎间盘摘除术,硬膜外注射,影像学诊断,MRI,X线,CT',
    type: 'guide'
  },
  {
    title: '颈椎病诊断与治疗指南',
    description: '国际权威期刊发布的颈椎病诊疗指南，涵盖神经根型、脊髓型、椎动脉型等多种颈椎病的诊断标准和治疗方案。',
    url: 'https://www.nature.com/articles/s41572-020-00277-0',
    date: '2022-08-15',
    views: '2,456',
    category: '脊柱疾病',
    icon: 'solar:document-add-bold-duotone',
    keywords: '颈椎病,颈椎,椎间盘退变,神经根型,脊髓型,椎动脉型,交感神经型,颈肩痛,上肢麻木,头晕,头痛,行走不稳,手术治疗,保守治疗',
    type: 'guide'
  },
  {
    title: '骨关节炎诊疗指南 (OARSI)',
    description: '国际骨关节炎研究学会(OARSI)最新指南，提供基于循证的骨关节炎诊断和治疗建议，涵盖膝关节、髋关节等多部位。',
    url: 'https://www.oarsi.org/',
    date: '2023-05-20',
    views: '3,789',
    category: '关节疾病',
    icon: 'solar:document-add-bold-duotone',
    keywords: '骨关节炎,关节软骨,退化,膝关节,髋关节,关节疼痛,关节僵硬,关节肿胀,Kellgren-Lawrence分级,NSAIDs,关节腔注射,关节置换术,运动疗法',
    type: 'guide'
  },
  {
    title: '半月板损伤诊疗共识',
    description: '欧洲运动医学与膝关节镜学会的半月板损伤诊疗共识，详细阐述MRI分型、保守治疗指征和手术技术选择。',
    url: 'https://www.esska.org/',
    date: '2023-03-18',
    views: '1,234',
    category: '关节疾病',
    icon: 'solar:document-add-bold-duotone',
    keywords: '半月板损伤,半月板,膝关节,关节交锁,弹响,肿胀,关节镜,缝合修复,部分切除,MRI分型,水平撕裂,垂直撕裂,放射状撕裂,桶柄样撕裂',
    type: 'guide'
  },
  {
    title: '骨折分型指南 (AO/OTA)',
    description: '国际内固定研究协会(AO)骨折分型系统，为骨折分类、治疗方案选择和预后评估提供标准化依据。',
    url: 'https://www.ao-foundation.org/',
    date: '2022-12-01',
    views: '5,678',
    category: '骨折与创伤',
    icon: 'solar:document-add-bold-duotone',
    keywords: '骨折,骨折分型,AO分型,OTA,骨折分类,骨折线,横形骨折,斜形骨折,螺旋形骨折,粉碎性骨折,稳定性骨折,不稳定性骨折,骨折复位,内固定',
    type: 'guide'
  },
  // 影像图谱
  {
    title: '腰椎间盘突出MRI影像图谱',
    description: '包含腰椎间盘突出症的MRI典型征象、分型示意图、与正常椎间盘的对比，以及各型突出的影像特征详解。',
    url: 'https://radiopaedia.org/',
    date: '',
    views: '8,923',
    category: '脊柱影像',
    icon: 'solar:gallery-wide-bold-duotone',
    keywords: '腰椎间盘突出,MRI,影像,椎间盘膨出,椎间盘突出,椎间盘脱出,游离型,中央型,旁中央型,外侧型,极外侧型,神经受压',
    type: 'atlas',
    imageCount: '256'
  },
  {
    title: '脊柱骨折X光与CT对比图',
    description: '详细展示各类脊柱骨折的X线、CT和MRI表现，包含Denis三柱分类示意图和骨折稳定性评估标准。',
    url: 'https://radiopaedia.org/',
    date: '',
    views: '6,445',
    category: '脊柱影像',
    icon: 'solar:gallery-wide-bold-duotone',
    keywords: '脊柱骨折,X线,CT,MRI,Denis三柱分类,前柱,中柱,后柱,椎体压缩,骨折线,椎管占位,骨折稳定性',
    type: 'atlas',
    imageCount: '312'
  },
  {
    title: '膝关节半月板损伤MRI征象',
    description: '半月板正常MRI表现、Ⅰ-Ⅲ度损伤分级标准、各类撕裂形态（水平、垂直、放射状、桶柄样）的影像特征。',
    url: 'https://radiopaedia.org/',
    date: '',
    views: '12,567',
    category: '关节影像',
    icon: 'solar:gallery-wide-bold-duotone',
    keywords: '半月板,MRI,半月板撕裂,损伤分级,水平撕裂,垂直撕裂,放射状撕裂,桶柄样撕裂,关节镜,关节间隙',
    type: 'atlas',
    imageCount: '189'
  },
  {
    title: '骨关节炎影像学分级图谱',
    description: 'Kellgren-Lawrence分级的X线标准影像，关节间隙狭窄、骨赘形成、软骨下骨硬化等征象的量化评估。',
    url: 'https://radiopaedia.org/',
    date: '',
    views: '9,234',
    category: '关节影像',
    icon: 'solar:gallery-wide-bold-duotone',
    keywords: '骨关节炎,X线,Kellgren-Lawrence分级,关节间隙狭窄,骨赘,骨赘形成,软骨下骨硬化,骨囊肿,关节畸形',
    type: 'atlas',
    imageCount: '145'
  },
  {
    title: '骨肿瘤影像诊断图谱',
    description: '良恶性骨肿瘤的X线、CT、MRI鉴别要点，骨膜反应、骨质破坏模式、软组织肿块等典型征象。',
    url: 'https://radiopaedia.org/',
    date: '',
    views: '7,123',
    category: '肿瘤影像',
    icon: 'solar:gallery-wide-bold-duotone',
    keywords: '骨肿瘤,恶性骨肿瘤,良性骨肿瘤,骨肉瘤,软骨肉瘤,尤文肉瘤,骨膜反应,骨质破坏,软组织肿块,转移性肿瘤',
    type: 'atlas',
    imageCount: '423'
  },
  // 临床案例
  {
    title: '青年男性腰椎间盘突出症手术治疗案例',
    description: '患者男性，28岁，急性起病，左侧下肢放射性疼痛，影像学显示L4-L5椎间盘突出。行椎间盘摘除术后症状完全缓解，术后康复过程及随访结果。',
    url: 'https://casereports.bmj.com/',
    date: '2023-08-15',
    views: '3,456',
    category: '脊柱外科',
    icon: 'solar:case-bold-duotone',
    keywords: '腰椎间盘突出症,手术治疗,椎间盘摘除术,L4-L5,下肢放射痛,案例,术后康复,随访',
    type: 'case',
    doctor: '张医生'
  },
  {
    title: '颈椎病多节段病变手术案例',
    description: '患者女性，62岁，渐进性双手麻木、行走不稳，MRI显示多节段颈椎间盘突出伴椎管狭窄。行前路颈椎间盘摘除植骨融合内固定术。',
    url: 'https://casereports.bmj.com/',
    date: '2023-07-20',
    views: '4,567',
    category: '脊柱外科',
    icon: 'solar:case-bold-duotone',
    keywords: '颈椎病,多节段病变,椎管狭窄,植骨融合,前路手术,案例,手术治疗',
    type: 'case',
    doctor: '李医生'
  },
  {
    title: '半月板桶柄样撕裂关节镜修复案例',
    description: '患者男性，25岁，运动损伤导致膝关节交锁。MRI确诊内侧半月板桶柄样撕裂，行关节镜下半月板缝合修复术，术后早期康复训练方案。',
    url: 'https://casereports.bmj.com/',
    date: '2023-09-05',
    views: '5,123',
    category: '关节外科',
    icon: 'solar:case-bold-duotone',
    keywords: '半月板损伤,桶柄样撕裂,关节镜,缝合修复,运动损伤,关节交锁,案例,康复训练',
    type: 'case',
    doctor: '王医生'
  },
  {
    title: '股骨头坏死保髋手术案例',
    description: '患者男性，35岁，长期服用激素导致双侧股骨头坏死Ficat III期。采用带血管游离腓骨移植术保髋治疗，术后随访3年效果良好。',
    url: 'https://casereports.bmj.com/',
    date: '2023-06-10',
    views: '3,890',
    category: '关节外科',
    icon: 'solar:case-bold-duotone',
    keywords: '股骨头坏死,Ficat分期,保髋手术,腓骨移植,激素,案例,手术效果',
    type: 'case',
    doctor: '刘医生'
  },
  {
    title: '胫骨平台骨折内固定术案例',
    description: '患者女性，48岁，车祸导致左侧胫骨平台骨折（Schatzker V型）。行切开复位钢板内固定术，术后早期负重训练时机与康复计划。',
    url: 'https://casereports.bmj.com/',
    date: '2023-08-28',
    views: '2,345',
    category: '创伤骨科',
    icon: 'solar:case-bold-duotone',
    keywords: '胫骨平台骨折,Schatzker分型,内固定术,钢板,康复,案例,车祸',
    type: 'case',
    doctor: '陈医生'
  },
  // 医学文献
  {
    title: '腰椎间盘退变的分子机制研究进展',
    description: '综述腰椎间盘退变的病理生理机制、细胞外基质降解、炎症反应和神经长入的分子生物学研究现状。',
    url: 'https://www.sciencedirect.com/',
    date: '2023',
    views: '6,789',
    category: '脊柱疾病研究',
    icon: 'solar:notebook-bold-duotone',
    keywords: '腰椎间盘退变,分子机制,细胞外基质,炎症反应,神经长入,分子生物学,Spine Journal,研究进展',
    type: 'literature',
    journal: 'Spine Journal 2023'
  },
  {
    title: 'AI辅助脊柱影像诊断的准确性评估',
    description: '深度学习算法在脊柱MRI自动诊断中的应用，对比AI诊断与放射科医师诊断的准确性和一致性。',
    url: 'https://www.nature.com/',
    date: '2023',
    views: '8,456',
    category: '脊柱疾病研究',
    icon: 'solar:notebook-bold-duotone',
    keywords: 'AI,人工智能,深度学习,脊柱影像,诊断准确性,神经网络,MRI,Nature Medicine',
    type: 'literature',
    journal: 'Nature Medicine 2023'
  },
  {
    title: '骨关节炎的药物治疗新进展',
    description: '探讨非甾体抗炎药、关节腔注射剂、生物制剂等骨关节炎治疗方案的有效性和安全性循证医学证据。',
    url: 'https://www.thelancet.com/',
    date: '2023',
    views: '10,234',
    category: '关节疾病研究',
    icon: 'solar:notebook-bold-duotone',
    keywords: '骨关节炎,药物治疗,NSAIDs,关节腔注射,生物制剂,循证医学,The Lancet,治疗效果',
    type: 'literature',
    journal: 'The Lancet 2023'
  },
  {
    title: '半月板修复vs切除术的长期随访研究',
    description: '10年随访研究比较半月板缝合修复与部分切除术的患者满意度、功能恢复和继发性骨关节炎发生率。',
    url: 'https://www.nejm.org/',
    date: '2023',
    views: '7,890',
    category: '关节疾病研究',
    icon: 'solar:notebook-bold-duotone',
    keywords: '半月板修复,半月板切除,随访研究,患者满意度,功能恢复,继发性骨关节炎,NEJM,长期疗效',
    type: 'literature',
    journal: 'NEJM 2023'
  },
  {
    title: '骨肉瘤的免疫治疗新策略',
    description: '探讨PD-1抑制剂、CAR-T细胞疗法等在骨肉瘤治疗中的应用前景，结合传统化疗的协同效应。',
    url: 'https://www.cell.com/',
    date: '2023',
    views: '5,678',
    category: '骨肿瘤研究',
    icon: 'solar:notebook-bold-duotone',
    keywords: '骨肉瘤,免疫治疗,PD-1抑制剂,CAR-T细胞疗法,化疗,协同效应,Cell,肿瘤治疗',
    type: 'literature',
    journal: 'Cell 2023'
  },
  {
    title: '3D打印在骨科精准治疗中的应用',
    description: '3D打印技术在定制化植入物、手术导板、个性化假体设计和骨折复位中的应用现状与发展趋势。',
    url: 'https://www.science.org/',
    date: '2023',
    views: '9,123',
    category: '骨科技术革新',
    icon: 'solar:notebook-bold-duotone',
    keywords: '3D打印,定制化,植入物,手术导板,假体设计,骨折复位,精准治疗,Science,技术创新',
    type: 'literature',
    journal: 'Science 2023'
  }
])

const toggleCategory = (category: string) => {
  const index = expandedCategories.value.indexOf(category)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(category)
  }
}

const showPage = (page: string) => {
  activePage.value = page
}

const showAllGuides = () => {
  activePage.value = 'all-guides'
}

const showAllAtlases = () => {
  activePage.value = 'all-atlases'
}

const showAllCases = () => {
  activePage.value = 'all-cases'
}

const showAllLiterature = () => {
  activePage.value = 'all-literature'
}

const showGuideDetail = (guideId: string) => {
  ElMessage.info(`查看指南详情: ${guideId}`)
}

const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()
  
  if (!query) {
    searchResults.value = []
    activePage.value = 'herniation'
    return
  }

  // 搜索知识库
  const results = knowledgeDatabase.value.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(query)
    const descMatch = item.description.toLowerCase().includes(query)
    const keywordsMatch = item.keywords.toLowerCase().includes(query)
    const categoryMatch = item.category && item.category.toLowerCase().includes(query)
    
    return titleMatch || descMatch || keywordsMatch || categoryMatch
  })
  
  searchResults.value = results
  
  if (results.length > 0) {
    activePage.value = 'search'
    ElMessage.success(`找到 ${results.length} 条结果`)
  } else {
    ElMessage.warning('未找到相关结果')
  }
}

const searchByKeyword = (keyword: string) => {
  searchQuery.value = keyword
  handleSearch()
}

const handleUpload = () => {
  ElMessage.info('上传知识功能')
}

const handleMyLearning = () => {
  ElMessage.info('我的学习功能')
}

onMounted(() => {
  // 初始化页面
})
</script>

<style scoped>
:root {
  --primary-color: #409EFF;
  --primary-color-light: #ecf5ff;
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --border-color: #e4e7ed;
  --bg-page: #f5f7fa;
  --bg-card: #ffffff;
  --shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.knowledge-base-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  background-color: var(--bg-page);
  color: var(--text-primary);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-right a, .header-right .btn {
  text-decoration: none;
  color: var(--text-regular);
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.main-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-color);
  padding: 20px 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: 0 20px 10px 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 10px;
}

.sidebar-header h2 {
  font-size: 18px;
  margin: 0 0 4px 0;
}

.sidebar-header p {
  font-size: 12px;
  color: var(--text-secondary);
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
  color: var(--text-primary);
}

.nav-item-title:hover {
  background-color: #f9fafb;
}

.nav-item.is-expanded > .nav-item-title .iconify {
  transform: rotate(90deg);
}

.sub-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: none;
  background-color: #fafafa;
}

.nav-item.is-expanded > .sub-nav {
  display: block;
}

.nav-link {
  display: block;
  padding: 10px 20px 10px 44px;
  text-decoration: none;
  color: var(--text-regular);
  font-size: 14px;
  position: relative;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.nav-parent-link {
  padding: 12px 20px;
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.nav-link.nav-parent-link:hover {
  background-color: #f9fafb;
}

.nav-link.is-active {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  font-weight: 500;
  border-left-color: var(--primary-color);
}

.nav-link.nav-parent-link.is-active {
  padding-left: 16px;
}

.sidebar-footer {
  padding: 15px 20px;
  margin-top: 10px;
  border-top: 1px solid var(--border-color);
}

.sidebar-footer a {
  text-decoration: none;
  font-size: 13px;
  color: var(--primary-color);
}

.content-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px 30px;
  scroll-behavior: smooth;
}

.content-page {
  display: block;
}

.search-module {
  background-color: var(--bg-card);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.search-module h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
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
  border: 1px solid var(--border-color);
  border-radius: 6px 0 0 6px;
  outline: none;
}

.search-box input:focus {
  border-color: var(--primary-color);
}

.search-box button {
  height: 46px;
  border: none;
  background-color: var(--primary-color);
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
  color: var(--text-secondary);
}

.search-links a {
  color: var(--text-regular);
  text-decoration: none;
  margin-left: 16px;
}

.search-links a:hover, .search-links a.active {
  color: var(--primary-color);
}

.search-results-page {
  margin-bottom: 24px;
}

.search-result-count {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

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
  background-color: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-light);
  text-decoration: none;
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}

.quick-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.card-icon {
  flex-shrink: 0;
}

.quick-card .iconify-c1 { color: #409EFF; }
.quick-card .iconify-c2 { color: #67C23A; }
.quick-card .iconify-c3 { color: #E6A23C; }
.quick-card .iconify-c4 { color: #F56C6C; }

.card-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.card-content p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.card-content .count {
  color: var(--text-regular);
  font-weight: 500;
}

.card-arrow {
  margin-left: auto;
  color: var(--text-secondary);
}

.content-section {
  background-color: var(--bg-card);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
}

.see-all {
  text-decoration: none;
  font-size: 13px;
  color: var(--primary-color);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px dashed var(--border-color);
}

.guide-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.guide-icon {
  color: var(--primary-color);
}

.guide-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.guide-title-link {
  cursor: pointer;
  transition: color 0.2s ease;
}

.guide-title-link:hover {
  color: var(--primary-color);
}

.guide-title-link a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.guide-title-link a:hover {
  color: var(--primary-color);
}

.guide-meta a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.guide-meta a:hover {
  color: var(--primary-color);
}

.guide-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.6;
}

.guide-meta {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 16px;
}

.guide-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.aggregate-page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
}

.disease-group-title {
  font-size: 18px;
  font-weight: 500;
  margin: 30px 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.knowledge-content {
  line-height: 1.8;
}

.knowledge-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color);
}

.knowledge-content h4:first-child {
  margin-top: 0;
}

.knowledge-content p {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.8;
  margin-bottom: 16px;
}

.knowledge-content ul {
  margin: 12px 0;
  padding-left: 24px;
}

.knowledge-content li {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.8;
  margin-bottom: 8px;
}

.knowledge-content ul ul {
  margin-top: 6px;
  margin-bottom: 6px;
  padding-left: 20px;
}

.knowledge-content strong {
  color: var(--text-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .quick-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .sidebar {
    width: 180px;
  }
}
</style>
