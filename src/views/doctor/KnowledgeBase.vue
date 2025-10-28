<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-left">
        <span class="iconify" data-icon="healthicons:medical-records-outline"></span>
        医学影像诊断系统
      </div>
      <div class="header-right">
        <a href="#"><span class="iconify" data-icon="solar:upload-outline"></span> 上传知识</a>
        <a href="#" class="btn btn-primary"><span class="iconify" data-icon="solar:book-bold-duotone"></span> 我的学习</a>
        <a href="#" class="avatar"><span class="iconify" data-icon="ph:user-bold"></span></a>
        <a href="#">管理员</a>
    </div>
    </header>

    <div class="main-container">
      <!-- 侧边栏 -->
      <aside class="sidebar" id="sidebar-nav">
        <div class="sidebar-header">
          <h2>骨骼疾病分类</h2>
          <p>根据解剖部位和类型浏览</p>
        </div>
        <ul class="sidebar-nav">
          <li class="nav-item" :class="{ 'is-expanded': expandedItems.includes('spine') }">
            <div class="nav-item-title" @click="toggleExpand('spine')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span>
              脊柱疾病
            </div>
            <ul class="sub-nav">
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'herniation' }" @click="setActivePage('herniation')">腰椎间盘突出症</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'spondylosis' }" @click="setActivePage('spondylosis')">颈椎病</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'spinal-fracture' }" @click="setActivePage('spinal-fracture')">脊柱骨折</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'spinal-deformity' }" @click="setActivePage('spinal-deformity')">脊柱畸形</a></li>
            </ul>
          </li>
          <li class="nav-item" :class="{ 'is-expanded': expandedItems.includes('joint') }">
            <div class="nav-item-title" @click="toggleExpand('joint')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span>
              关节疾病
            </div>
            <ul class="sub-nav">
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'arthritis' }" @click="setActivePage('arthritis')">关节炎</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'meniscus-injury' }" @click="setActivePage('meniscus-injury')">半月板损伤</a></li>
              <li><a href="#" class="nav-link" :class="{ 'is-active': activePage === 'anfh' }" @click="setActivePage('anfh')">股骨头坏死</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'bone-soft-tumor' }" @click="setActivePage('bone-soft-tumor')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span>
              骨与软组织肿瘤
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'trauma' }" @click="setActivePage('trauma')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span>
              骨折与创伤
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'bone-tumor' }" @click="setActivePage('bone-tumor')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span>
              骨肿瘤
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link nav-parent-link" :class="{ 'is-active': activePage === 'metabolic' }" @click="setActivePage('metabolic')">
              <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span>
              代谢性骨病
            </a>
          </li>
        </ul>
        <div class="sidebar-footer">
          <a href="#">查看全部分类</a>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content-area" id="content-area">
        <!-- 智能检索模块 -->
        <div class="search-module">
          <h3>智能医学知识检索</h3>
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="搜索疾病名称、症状、征象、解剖部位、影像表现或关键词..." @input="handleSearch">
            <button @click="handleSearch"><span class="iconify" data-icon="solar:magnifer-bold"></span> 检索</button>
          </div>
          <div class="search-links">
            热门搜索:
            <a href="#" class="active">半月板损伤</a>
            <a href="#">骨折分型</a>
            <a href="#">MRI征象</a>
            <a href="#">... 更多</a>
        </div>
      </div>

        <!-- 快速入口网格 -->
        <div class="quick-links-grid">
          <a class="quick-card" @click="setActivePage('all-guides')">
            <span class="iconify card-icon iconify-c1" data-icon="solar:document-text-bold-duotone"></span>
            <div class="card-content">
              <h4>诊断指南</h4>
              <p>临床实践标准，治疗规范</p>
              <span class="count">128 篇指南</span>
          </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear"></span>
          </a>
          <a class="quick-card" @click="setActivePage('all-atlases')">
            <span class="iconify card-icon iconify-c2" data-icon="solar:gallery-wide-bold-duotone"></span>
            <div class="card-content">
              <h4>影像图谱</h4>
              <p>多种征象对比，智能标注</p>
              <span class="count">356 组图谱</span>
            </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear"></span>
          </a>
          <a class="quick-card" @click="setActivePage('all-cases')">
            <span class="iconify card-icon iconify-c3" data-icon="solar:case-bold-duotone"></span>
            <div class="card-content">
              <h4>临床案例</h4>
              <p>详细诊疗过程，多学科讨论</p>
              <span class="count">245 个案例</span>
            </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear"></span>
          </a>
          <a class="quick-card" @click="setActivePage('all-literature')">
            <span class="iconify card-icon iconify-c4" data-icon="solar:notebook-bold-duotone"></span>
            <div class="card-content">
              <h4>医学文献</h4>
              <p>前沿研究进展，指南解读</p>
              <span class="count">512 篇文献</span>
            </div>
            <span class="iconify card-arrow" data-icon="solar:alt-arrow-right-linear"></span>
          </a>
        </div>

        <!-- 内容页面 -->
        <div class="content-page" :class="{ 'is-active': activePage === 'herniation' }" id="page-herniation">
          <!-- 腰椎间盘突出症内容 -->
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (腰椎)</h3>
              <a href="#" class="see-all">查看全部 <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="setActivePage('guide-herniation-2023')">腰椎间盘突出症诊疗指南 (2023版)</h4>
                  <p>本指南由中华医学会骨科学分会编写。系统阐述了腰椎间盘突出症的流行病学、发病机制、临床表现、影像学诊断...</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold"></span> 2023-01-10</span>
                    <span><span class="iconify" data-icon="solar:eye-bold"></span> 1,893 查看</span>
                    <span><span class="iconify" data-icon="bxs:file-pdf"></span> PDF 下载</span>
                  </div>
                </div>
              </div>
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="setActivePage('guide-meniscus-2023')">中国半月板损伤诊疗指南 (2023版)</h4>
                  <p>本指南由中华医学会骨科学分会关节镜学组组织编写。系统阐述了半月板损伤的诊断标准、影像学表现、治疗方案...</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold"></span> 2023-03-15</span>
                    <span><span class="iconify" data-icon="solar:eye-bold"></span> 3,452 查看</span>
                    <span><span class="iconify" data-icon="bxs:file-pdf"></span> PDF 下载</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

          <div class="content-section">
            <div class="section-header">
              <h3>骨骼系统影像诊断 (腰椎)</h3>
              <a href="#" class="see-all">查看全部指南 <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span></a>
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
                <a href="#" class="see-all">更多讨论 <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span></a>
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
                <span><span class="iconify" data-icon="solar:user-speak-bold"></span> 主持专家：张教授 (骨科)</span>
                <span><span class="iconify" data-icon="solar:clock-circle-bold"></span> 发表时间: 2023-07-22</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><span class="iconify" data-icon="solar:chat-line-bold"></span> 交流详情</a>
                <a href="#"><span class="iconify" data-icon="solar:star-bold"></span> 参与讨论</a>
                <a href="#"><span class="iconify" data-icon="solar:bookmark-bold"></span> 收藏案例</a>
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

        <!-- 其他疾病页面内容 -->
        <div class="content-page" :class="{ 'is-active': activePage === 'spondylosis' }" id="page-spondylosis">
          <div class="content-section">
            <div class="section-header">
              <h3>推荐的专业指南 (颈椎病)</h3>
              <a href="#" class="see-all">查看全部 <span class="iconify" data-icon="solar:alt-arrow-right-linear"></span></a>
            </div>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="setActivePage('guide-spondylosis-2022')">颈椎病诊疗指南 (2022版)</h4>
                  <p>本指南由中华医学会骨科学分会发布，涵盖了脊髓型、神经根型颈椎病的诊断标准、阶梯治疗和手术时机...</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold"></span> 2022-10-18</span>
                    <span><span class="iconify" data-icon="solar:eye-bold"></span> 6,210 查看</span>
                    <span><span class="iconify" data-icon="bxs:file-pdf"></span> PDF 下载</span>
                  </div>
                </div>
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

        <!-- 指南详情页面 -->
        <div class="content-page guide-detail-page" :class="{ 'is-active': activePage === 'guide-herniation-2023' }" id="page-guide-herniation-2023">
          <div class="page-header">
            <a href="#" class="btn-back" @click="goBack">
              <span class="iconify" data-icon="solar:arrow-left-linear"></span> 返回上一级
            </a>
          </div>
          <div class="guide-content-full">
            <h1>腰椎间盘突出症诊疗指南 (2023版)</h1>
            <div class="guide-meta" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
              <span><span class="iconify" data-icon="solar:calendar-date-bold"></span> 2023-01-10</span>
              <span><span class="iconify" data-icon="solar:eye-bold"></span> 1,893 查看</span>
              <span><span class="iconify" data-icon="bxs:file-pdf"></span> PDF 下载</span>
            </div>

            <h3>1. 概述</h3>
            <p>本指南由中华医学会骨科学分会编写。系统阐述了腰椎间盘突出症的流行病学、发病机制、临床表现、影像学诊断、分型、以及保守治疗和手术治疗的最新进展。</p>
            <h3>2. 影像学诊断</h3>
            <p>MRI是诊断腰椎间盘突出症的金标准。推荐进行腰椎矢状位T1、T2和轴位T2加权成像。根据影像学表现，突出可分为膨出(Bulging)、突出(Protrusion)、脱出(Extrusion)和游离(Sequestration)。</p>
            <p>CT扫描对于显示椎间盘钙化、骨赘形成、椎管狭窄具有优势，尤其在评估骨性结构时。X线动力位片可用于评估腰椎的稳定性。</p>
            <h3>3. 治疗原则</h3>
            <p>治疗应遵循阶梯化原则。绝大多数（约80-90%）的初发患者可通过保守治疗获得缓解。保守治疗包括卧床休息、药物治疗（NSAIDs、肌松剂）、物理治疗和康复锻炼。</p>
            <p>手术治疗指征包括：(1) 保守治疗无效；(2) 出现马尾神经综合征；(3) 出现进行性肌力下降。手术方式包括经典的椎板开窗髓核摘除术(Fenestration)、椎间孔镜(TESSYS)和UBE等微创手术。</p>
          </div>
            </div>

        <!-- 聚合页面 -->
        <div class="content-page" :class="{ 'is-active': activePage === 'all-guides' }" id="page-all-guides">
          <div class="page-header">
            <a href="#" class="btn-back" @click="goBack">
              <span class="iconify" data-icon="solar:arrow-left-linear"></span> 返回上一级
            </a>
          </div>
          <h2 class="aggregate-page-title">所有诊断指南</h2>

          <div class="content-section">
            <h3 class="disease-group-title">脊柱疾病</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="setActivePage('guide-herniation-2023')">腰椎间盘突出症诊疗指南 (2023版)</h4>
                  <p>本指南由中华医学会骨科学分会编写。系统阐述了腰椎间盘突出症的流行病学、发病机制、临床表现、影像学诊断...</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold"></span> 2023-01-10</span>
                    <span><span class="iconify" data-icon="solar:eye-bold"></span> 1,893 查看</span>
                    <span><span class="iconify" data-icon="bxs:file-pdf"></span> PDF 下载</span>
                  </div>
                </div>
                </div>
              </div>
            </div>

          <div class="content-section">
            <h3 class="disease-group-title">关节疾病</h3>
            <div class="guide-list">
              <div class="guide-item">
                <span class="iconify guide-icon" data-icon="solar:document-add-bold-duotone" style="color: #67C23A;"></span>
                <div class="guide-content">
                  <h4 class="guide-title-link" @click="setActivePage('guide-meniscus-2023')">中国半月板损伤诊疗指南 (2023版)</h4>
                  <p>本指南由中华医学会骨科学分会关节镜学组组织编写。系统阐述了半月板损伤的诊断标准、影像学表现、治疗方案...</p>
                  <div class="guide-meta">
                    <span><span class="iconify" data-icon="solar:calendar-date-bold"></span> 2023-03-15</span>
                    <span><span class="iconify" data-icon="solar:eye-bold"></span> 3,452 查看</span>
                    <span><span class="iconify" data-icon="bxs:file-pdf"></span> PDF 下载</span>
                  </div>
                  </div>
                  </div>
            </div>
          </div>
            </div>

        <!-- 其他聚合页面 -->
        <div class="content-page" :class="{ 'is-active': activePage === 'all-atlases' }" id="page-all-atlases">
          <div class="page-header">
            <a href="#" class="btn-back" @click="goBack">
              <span class="iconify" data-icon="solar:arrow-left-linear"></span> 返回上一级
            </a>
          </div>
          <h2 class="aggregate-page-title">所有影像图谱</h2>
          <div class="content-section">
            <h3 class="disease-group-title">腰椎</h3>
            <div class="article-grid">
              <div class="article-card">
                <h4>腰椎MRI影像学诊断图谱</h4>
                <p>包含椎间盘膨出、突出、脱出、游离的典型MRI矢状位和轴位影像...</p>
                <div class="tag-list">
                  <span>MRI</span>
                  <span>腰椎</span>
                  <span>椎间盘</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-page" :class="{ 'is-active': activePage === 'all-cases' }" id="page-all-cases">
          <div class="page-header">
            <a href="#" class="btn-back" @click="goBack">
              <span class="iconify" data-icon="solar:arrow-left-linear"></span> 返回上一级
            </a>
      </div>
          <h2 class="aggregate-page-title">所有临床案例</h2>
          <div class="content-section">
            <h3 class="disease-group-title">脊柱外科</h3>
            <div class="case-study-card" style="margin-bottom: 20px;">
              <div class="case-study-header">
                <h4>案例：青少年特发性脊柱侧弯的诊断与治疗</h4>
                <span class="tag-hot">最新热议</span>
              </div>
              <div class="case-study-body">
                14岁女性患者，因"发现脊柱侧弯2年，加重半年"入院。查体：双肩不等高，胸廓不对称...
              </div>
              <div class="case-study-footer">
                <span><span class="iconify" data-icon="solar:user-speak-bold"></span> 主持专家：张教授 (骨科)</span>
                <span><span class="iconify" data-icon="solar:clock-circle-bold"></span> 发表时间: 2023-07-22</span>
              </div>
              <div class="case-study-actions">
                <a href="#"><span class="iconify" data-icon="solar:chat-line-bold"></span> 交流详情</a>
                <a href="#"><span class="iconify" data-icon="solar:star-bold"></span> 参与讨论</a>
                <a href="#"><span class="iconify" data-icon="solar:bookmark-bold"></span> 收藏案例</a>
                <span style="margin-left: auto; color: #aaa; font-size: 12px;">最后更新: 2023-08-10</span>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'all-literature' }" id="page-all-literature">
          <div class="page-header">
            <a href="#" class="btn-back" @click="goBack">
              <span class="iconify" data-icon="solar:arrow-left-linear"></span> 返回上一级
            </a>
          </div>
          <h2 class="aggregate-page-title">所有医学文献</h2>
          <div class="content-section">
            <p>此处模拟展示所有医学文献列表...</p>
            <p>（实际应用中，这里会加载文献数据库的内容，可能包含标题、作者、摘要、期刊、年份等信息，并支持搜索和筛选）</p>
          </div>
        </div>

        <!-- 其他疾病页面 -->
        <div class="content-page" :class="{ 'is-active': activePage === 'arthritis' }" id="page-arthritis">
          <div class="qa-section">
            <h3>简易疾病QA (关节炎)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>膝关节炎日常需避免什么运动？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>应避免对膝关节冲击力大的运动，如爬山、爬楼梯、下蹲、深蹲和长跑。推荐进行游泳、骑自行车（平路）、散步等低冲击运动。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'meniscus-injury' }" id="page-meniscus-injury">
          <div class="qa-section">
            <h3>简易疾病QA (半月板损伤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>半月板损伤后能自己长好吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>很难。半月板大部分区域（白区）没有血液供应，一旦撕裂无法自行愈合。只有靠近关节囊的边缘部分（红区）撕裂，才有愈合的可能。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'anfh' }" id="page-anfh">
          <div class="qa-section">
            <h3>简易疾病QA (股骨头坏死)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>股骨头坏死的主要病因是什么？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>最常见的两大病因是"激素"和"酒精"。长期大量使用糖皮质激素，以及长期大量饮酒，都可破坏股骨头的血液供应，导致其缺血坏死。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'bone-soft-tumor' }" id="page-bone-soft-tumor">
          <div class="qa-section">
            <h3>简易疾病QA (骨与软组织肿瘤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨肿瘤和软组织肿瘤是一回事吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>不是。骨肿瘤起源于骨骼系统（骨、软骨等），软组织肿瘤起源于肌肉、脂肪、神经、血管等软组织。它们的诊断和治疗方案不尽相同。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'trauma' }" id="page-trauma">
          <div class="qa-section">
            <h3>简易疾病QA (骨折与创伤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>骨折后一定要"伤筋动骨一百天"吗？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>不一定。这是传统观念。现代骨科强调在"稳定固定"的前提下，尽早进行科学的功能锻炼。例如，稳定的手腕骨折固定后，手指就应该早期活动，以防止关节僵硬和肌肉萎缩。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'bone-tumor' }" id="page-bone-tumor">
          <div class="qa-section">
            <h3>简易疾病QA (骨肿瘤)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>什么是原发性骨肿瘤和继发性骨肿瘤？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>原发性骨肿瘤指肿瘤最早起源于骨组织。继发性骨肿瘤（或称"骨转移瘤"）指身体其他部位的癌症（如肺癌、乳腺癌）通过血液转移到了骨骼上。在成年人中，继发性骨肿瘤比原发性恶性骨肿瘤更常见。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'metabolic' }" id="page-metabolic">
          <div class="qa-section">
            <h3>简易疾病QA (代谢性骨病)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>最常见的代谢性骨病是什么？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>骨质疏松症 (Osteoporosis)。这是一种以骨量减少、骨微结构破坏，导致骨骼脆性增加、易发生骨折为特征的全身性骨病。常见于绝经后女性和老年男性。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'spinal-fracture' }" id="page-spinal-fracture">
          <div class="qa-section">
            <h3>简易疾病QA (脊柱骨折)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>什么是"压缩性骨折"？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>通常指"椎体压缩性骨折"。多见于骨质疏松的老年人，椎体因轻微外力（如打喷嚏、弯腰）或无明显外伤而"压扁"（呈楔形）。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page" :class="{ 'is-active': activePage === 'spinal-deformity' }" id="page-spinal-deformity">
          <div class="qa-section">
            <h3>简易疾病QA (脊柱畸形)</h3>
            <div class="qa-item">
              <div class="qa-question">
                <span class="qa-icon q">Q:</span>
                <p>如何早期发现孩子的脊柱侧弯？</p>
              </div>
              <div class="qa-answer">
                <span class="qa-icon a">A:</span>
                <p>让孩子脱去上衣，双脚并拢站立，然后向前弯腰。观察孩子的背部两侧是否等高。如果一侧明显高于另一侧（"剃刀背"畸形），则应高度怀疑脊柱侧弯，需立即就医。</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 响应式数据
const activePage = ref('herniation')
const expandedItems = ref(['spine'])
const searchQuery = ref('')
const lastActivePageId = ref('herniation')

// 方法
const setActivePage = (pageId: string) => {
  // 保存当前页面ID（如果不是详情页或聚合页）
  const isDetailPage = pageId.includes('guide-')
  const isAggregatePage = ['all-guides', 'all-atlases', 'all-cases', 'all-literature'].includes(pageId)
  
  if (!isDetailPage && !isAggregatePage) {
    lastActivePageId.value = activePage.value
  }
  
  activePage.value = pageId
}

const toggleExpand = (itemId: string) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemId)
  }
}

const goBack = () => {
  setActivePage(lastActivePageId.value)
}

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
  // 这里可以实现搜索逻辑
}

// 生命周期
onMounted(() => {
  // 初始化Iconify图标
  if (typeof window !== 'undefined' && (window as any).Iconify) {
    (window as any).Iconify.scan()
  }
})
</script>

<style scoped>
:root {
  --primary-color: #409EFF; /* Element UI Blue */
  --primary-color-light: #ecf5ff;
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --border-color: #e4e7ed;
  --bg-page: #f5f7fa;
  --bg-card: #ffffff;
  --shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

/* 1. Global Reset & Layout */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 14px;
  background-color: var(--bg-page);
  color: var(--text-primary);
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 2. Header */
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
.header-left .iconify {
  font-size: 28px;
  color: var(--primary-color);
  margin-right: 10px;
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
.header-right .btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}
.header-right .btn-primary {
  background-color: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}
.header-right .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}
.header-right .avatar .iconify {
  font-size: 20px;
}

/* 3. Main Content Area */
.main-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden; 
}

/* 4. Sidebar */
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
.nav-item-title .iconify {
  font-size: 16px;
  margin-right: 8px;
  color: var(--text-regular);
  transition: transform 0.2s ease;
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

/* 统一子菜单和父菜单链接样式 */
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

/* 用于那些没有子菜单的父级链接 */
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
.nav-link.nav-parent-link .iconify {
  font-size: 16px;
  margin-right: 8px;
  color: var(--text-regular);
}

/* 统一的激活状态 */
.nav-link.is-active {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  font-weight: 500;
  border-left-color: var(--primary-color);
}
/* 确保父链接激活时缩进正确 */
.nav-link.nav-parent-link.is-active {
  padding-left: 16px;
}
/* 确保子链接激活时缩进正确 */
.sub-nav li a.is-active {
  padding-left: 44px;
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

/* 5. Content Area */
.content-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px 30px;
  scroll-behavior: smooth;
}

.content-page {
  display: none;
}
.content-page.is-active {
  display: block;
}

/* 智能检索 */
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
  font-size: 40px;
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
  font-size: 16px;
  color: var(--text-secondary);
}

/* 内容分区 */
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
.section-header .see-all {
  text-decoration: none;
  font-size: 13px;
  color: var(--primary-color);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 指南列表 */
.guide-list .guide-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px dashed var(--border-color);
}
.guide-list .guide-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.guide-icon {
  font-size: 36px;
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

/* 文章网格 */
.article-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.article-card {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 20px;
}
.article-card h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
}
.article-card p {
  font-size: 13px;
  color: var(--text-regular);
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
  background-color: var(--bg-page);
  color: var(--text-regular);
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
  color: var(--text-regular);
  line-height: 1.7;
  margin-bottom: 16px;
}
.case-study-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}
.case-study-footer span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.case-study-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed var(--border-color);
  font-size: 13px;
  display: flex;
  gap: 20px;
}
.case-study-actions a {
  text-decoration: none;
  color: var(--text-regular);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.case-study-actions a:hover {
  color: var(--primary-color);
}
.section-header .actions a {
  margin-left: 16px;
}

/* 指南详情页 */
.page-header {
  margin-bottom: 20px;
}
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-regular);
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-back:hover {
  color: var(--primary-color);
  border-color: var(--primary-color-light);
  background-color: var(--primary-color-light);
}
.guide-content-full {
  background-color: var(--bg-card);
  border-radius: 8px;
  padding: 32px 40px;
  box-shadow: var(--shadow-light);
  margin-bottom: 24px;
}
.guide-content-full h1 {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 16px;
}
.guide-content-full h3 {
  font-size: 18px;
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}
.guide-content-full p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-regular);
  margin-bottom: 16px;
}

/* Q&A 模块 */
.qa-section {
  background-color: var(--bg-card);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  margin-top: 24px; 
}
.qa-section h3 {
  font-size: 18px;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.qa-item {
  margin-bottom: 24px;
  border-bottom: 1px dashed var(--border-color);
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
  color: var(--text-regular);
}
.qa-question {
  margin-bottom: 16px;
  color: var(--text-primary);
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
  color: var(--primary-color);
}
.qa-icon.a {
  color: #67C23A;
}

/* 聚合页面样式 */
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

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .quick-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>