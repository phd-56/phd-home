<template>
  <div class="help-doc-page">
    <div class="help-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="搜索帮助文档..."
            v-model="searchTerm"
            @input="handleSearch"
            @keyup.enter="handleSearch"
          >
        </div>
        <div class="nav-title">目录</div>
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'system-overview' }"
          @click="showSection('system-overview')"
        >
          1. 系统概述
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'system-intro' }"
          @click="showSection('system-intro')"
        >
          1.1 系统简介
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'function-modules' }"
          @click="showSection('function-modules')"
        >
          1.2 功能模块
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'system-requirements' }"
          @click="showSection('system-requirements')"
        >
          1.3 系统要求
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'quick-start' }"
          @click="showSection('quick-start')"
        >
          2. 快速入门
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'account-login' }"
          @click="showSection('account-login')"
        >
          2.1 账号登录
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'interface-navigation' }"
          @click="showSection('interface-navigation')"
        >
          2.2 界面导航
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'basic-operations' }"
          @click="showSection('basic-operations')"
        >
          2.3 基本操作步骤
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'diagnosis-module' }"
          @click="showSection('diagnosis-module')"
        >
          3. 影像诊断模块
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'image-upload' }"
          @click="showSection('image-upload')"
        >
          3.1 影像导入
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'image-annotation' }"
          @click="showSection('image-annotation')"
        >
          3.2 影像标注与标记
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'image-tools' }"
          @click="showSection('image-tools')"
        >
          3.3 影像测量工具
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'ai-diagnosis' }"
          @click="showSection('ai-diagnosis')"
        >
          3.4 AI辅助诊断
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'case-management' }"
          @click="showSection('case-management')"
        >
          4. 病例管理
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'case-create' }"
          @click="showSection('case-create')"
        >
          4.1 创建病例
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'case-search' }"
          @click="showSection('case-search')"
        >
          4.2 病例检索
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'case-report' }"
          @click="showSection('case-report')"
        >
          4.3 诊断报告生成
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'data-statistics' }"
          @click="showSection('data-statistics')"
        >
          5. 数据统计分析
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'statistics-overview' }"
          @click="showSection('statistics-overview')"
        >
          5.1 统计概览
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'custom-reports' }"
          @click="showSection('custom-reports')"
        >
          5.2 自定义报表
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'knowledge-base' }"
          @click="showSection('knowledge-base')"
        >
          6. 医生知识库
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'disease-database' }"
          @click="showSection('disease-database')"
        >
          6.1 疾病数据库
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'case-library' }"
          @click="showSection('case-library')"
        >
          6.2 典型病例库
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'system-settings' }"
          @click="showSection('system-settings')"
        >
          7. 系统设置
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'personal-settings' }"
          @click="showSection('personal-settings')"
        >
          7.1 个人设置
        </div>
        <div 
          class="nav-item sub-item" 
          :class="{ active: activeSection === 'permission-management' }"
          @click="showSection('permission-management')"
        >
          7.2 权限管理
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'faq' }"
          @click="showSection('faq')"
        >
          8. 常见问题
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeSection === 'troubleshooting' }"
          @click="showSection('troubleshooting')"
        >
          9. 故障排除
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area" ref="contentArea">
        <div class="doc-header">
          <h1 class="doc-title">医学影像诊断系统 帮助文档</h1>
          <div class="doc-meta">版本: 2.3.0 | 最后更新: 2024年03月20日</div>
        </div>

        <!-- System Overview Section -->
        <div class="content-section" v-show="activeSection === 'system-overview'">
          <h2 class="section-title">1. 系统概述</h2>
          
          <div class="info-box">
            <div class="info-box-icon">ℹ️</div>
            <div class="info-box-content">
              <strong>欢迎使用医学影像诊断系统</strong><br>
              本系统是为医疗机构专业设计的影像诊断平台，集成了先进的AI辅助诊断功能，帮助医生更高效、准确地进行影像分析和诊断工作。
            </div>
          </div>

          <h3 class="subsection-title">1.1 系统简介</h3>
          <p>医学影像诊断系统是一款集成了多种医学影像处理、分析和诊断功能的专业软件平台。系统支持DICOM、JPG、PNG等多种影像格式，能够处理CT、MRI、X光、超声等各类医学影像数据。</p>
          <p>系统采用先进的深度学习算法，提供智能化的影像分析和辅助诊断功能。通过整合病例管理、诊断报告生成、数据统计分析等模块，为医疗机构提供一站式的影像诊断解决方案。同时，系统内置丰富的医学知识库，可以实时查询疾病信息和典型病例，辅助医生做出更准确的诊断决策。</p>

          <h3 class="subsection-title">1.2 功能模块</h3>
          <p>医学影像诊断系统主要包含以下四大功能模块：</p>
          
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">🔬</span>
                影像诊断模块
              </div>
              <div class="feature-card-desc">
                提供专业的影像浏览、测量、标注功能，支持多种影像格式的导入和处理。集成AI辅助诊断算法，自动识别病灶区域并提供诊断建议。
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">📋</span>
                病例管理模块
              </div>
              <div class="feature-card-desc">
                实现病例的创建、查询、修改和归档管理。支持按患者信息、检查类型、诊断结果等多维度检索，支持病例的批量导入导出。
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">📊</span>
                数据统计模块
              </div>
              <div class="feature-card-desc">
                提供丰富的数据统计和可视化功能，支持按时间、科室、疾病类型等维度进行统计分析。可生成多种格式的统计报表，支持数据导出。
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">📚</span>
                医生知识库
              </div>
              <div class="feature-card-desc">
                整合权威的医学知识资源，包括疾病诊断标准、典型影像特征、鉴别诊断要点等。为医生提供便捷的知识查询和学习平台。
              </div>
            </div>
          </div>

          <h3 class="subsection-title">1.3 系统要求</h3>
          
          <h4 class="sub-subsection-title">1.3.1 硬件要求</h4>
          <ul class="requirements-list">
            <li><strong>处理器：</strong>Intel Core i5或AMD同等级处理器以上</li>
            <li><strong>内存：</strong>至少8GB RAM，推荐16GB RAM</li>
            <li><strong>硬盘：</strong>至少20GB可用空间，SSD硬盘优先</li>
            <li><strong>显卡：</strong>支持DirectX 11或更高版本的独立显卡，至少2GB显存</li>
            <li><strong>显示器：</strong>分辨率1920×1080或更高，支持彩色显示</li>
            <li><strong>网络：</strong>稳定的网络连接，推荐100Mbps以上</li>
          </ul>

          <h4 class="sub-subsection-title">1.3.2 软件要求</h4>
          <ul class="requirements-list">
            <li><strong>操作系统：</strong>Windows 10/11 64位专业版或企业版</li>
            <li><strong>浏览器：</strong>Google Chrome 90.0及以上，Microsoft Edge 90.0及以上</li>
            <li><strong>开发环境：</strong>.NET Framework 4.8或更高版本，Visual C++ 2019可再发行组件</li>
            <li><strong>数据库系统：</strong>管理员权限（仅安装时需要）</li>
          </ul>

          <div class="warning-box">
            <div class="warning-box-icon">⚠️</div>
            <div>
              <div class="warning-title">注意事项</div>
              <div>为确保系统稳定运行和数据安全，请仅在符合上述要求的环境中使用本系统。特别提醒：本系统需要管理员权限进行安装，安装后日常使用可使用普通用户权限。建议定期备份重要数据，确保数据安全。</div>
            </div>
          </div>
        </div>

        <!-- System Intro -->
        <div class="content-section" v-show="activeSection === 'system-intro'">
          <h2 class="section-title">1.1 系统简介</h2>
          <p>医学影像诊断系统是一款集成了多种医学影像处理、分析和诊断功能的专业软件平台。系统支持DICOM、JPG、PNG等多种影像格式，能够处理CT、MRI、X光、超声等各类医学影像数据。</p>
          <p>系统采用先进的深度学习算法，提供智能化的影像分析和辅助诊断功能。通过整合病例管理、诊断报告生成、数据统计分析等模块，为医疗机构提供一站式的影像诊断解决方案。同时，系统内置丰富的医学知识库，可以实时查询疾病信息和典型病例，辅助医生做出更准确的诊断决策。</p>
        </div>

        <!-- Function Modules -->
        <div class="content-section" v-show="activeSection === 'function-modules'">
          <h2 class="section-title">1.2 功能模块</h2>
          <p>医学影像诊断系统主要包含以下四大功能模块：</p>
          
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">🔬</span>
                影像诊断模块
              </div>
              <div class="feature-card-desc">
                提供专业的影像浏览、测量、标注功能，支持多种影像格式的导入和处理。集成AI辅助诊断算法，自动识别病灶区域并提供诊断建议。
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">📋</span>
                病例管理模块
              </div>
              <div class="feature-card-desc">
                实现病例的创建、查询、修改和归档管理。支持按患者信息、检查类型、诊断结果等多维度检索，支持病例的批量导入导出。
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">📊</span>
                数据统计模块
              </div>
              <div class="feature-card-desc">
                提供丰富的数据统计和可视化功能，支持按时间、科室、疾病类型等维度进行统计分析。可生成多种格式的统计报表，支持数据导出。
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-card-title">
                <span class="feature-card-icon">📚</span>
                医生知识库
              </div>
              <div class="feature-card-desc">
                整合权威的医学知识资源，包括疾病诊断标准、典型影像特征、鉴别诊断要点等。为医生提供便捷的知识查询和学习平台。
              </div>
            </div>
          </div>
        </div>

        <!-- System Requirements -->
        <div class="content-section" v-show="activeSection === 'system-requirements'">
          <h2 class="section-title">1.3 系统要求</h2>
          
          <h4 class="sub-subsection-title">1.3.1 硬件要求</h4>
          <ul class="requirements-list">
            <li><strong>处理器：</strong>Intel Core i5或AMD同等级处理器以上</li>
            <li><strong>内存：</strong>至少8GB RAM，推荐16GB RAM</li>
            <li><strong>硬盘：</strong>至少20GB可用空间，SSD硬盘优先</li>
            <li><strong>显卡：</strong>支持DirectX 11或更高版本的独立显卡，至少2GB显存</li>
            <li><strong>显示器：</strong>分辨率1920×1080或更高，支持彩色显示</li>
            <li><strong>网络：</strong>稳定的网络连接，推荐100Mbps以上</li>
          </ul>

          <h4 class="sub-subsection-title">1.3.2 软件要求</h4>
          <ul class="requirements-list">
            <li><strong>操作系统：</strong>Windows 10/11 64位专业版或企业版</li>
            <li><strong>浏览器：</strong>Google Chrome 90.0及以上，Microsoft Edge 90.0及以上</li>
            <li><strong>开发环境：</strong>.NET Framework 4.8或更高版本，Visual C++ 2019可再发行组件</li>
            <li><strong>数据库系统：</strong>管理员权限（仅安装时需要）</li>
          </ul>

          <div class="warning-box">
            <div class="warning-box-icon">⚠️</div>
            <div>
              <div class="warning-title">注意事项</div>
              <div>为确保系统稳定运行和数据安全，请仅在符合上述要求的环境中使用本系统。特别提醒：本系统需要管理员权限进行安装，安装后日常使用可使用普通用户权限。建议定期备份重要数据，确保数据安全。</div>
            </div>
          </div>
        </div>

        <!-- Quick Start Section -->
        <div class="content-section" v-show="activeSection === 'quick-start'">
          <h2 class="section-title">2. 快速入门</h2>
          <p>本章节将帮助您快速了解系统的基本操作流程，从账号登录到完成第一次影像诊断。</p>

          <h3 class="subsection-title">2.1 账号登录</h3>
          <p>在开始使用本系统前，请先获得管理员分配的账号。管理员会为您创建账号并设置初始权限。</p>
          
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-title">访问系统登录页面</div>
                <div class="step-desc">在浏览器地址栏中输入系统URL，例如：http://medimaging.yourhospital.com，按回车键访问登录页面。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-title">输入账号密码</div>
                <div class="step-desc">在登录界面输入用户名和密码。用户名通常为您的工号或医生编号。首次登录建议修改初始密码。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-title">选择科室（如需要）</div>
                <div class="step-desc">如果您属于多个科室，登录时需要选择当前工作的科室。系统会根据科室权限显示相应的功能模块。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <div class="step-title">点击"登录"按钮</div>
                <div class="step-desc">确认信息无误后，点击登录按钮进入系统主界面。系统会自动记录您的登录信息。</div>
              </div>
            </div>
          </div>

          <div class="tip-box">
            <div class="tip-title">💡 密码安全提示</div>
            <div class="tip-content">
              首次登录系统后，请立即修改初始密码。密码应包含大小写字母、数字和特殊字符，长度至少8位。为保障账号安全，建议定期更换密码，不要与他人共享账号信息。如忘记密码，请联系系统管理员重置。
            </div>
          </div>

          <h3 class="subsection-title">2.2 界面导航</h3>
          <p>登录成功后，您将看到系统主界面。主界面采用经典的上下左右布局结构：</p>
          
          <ul class="requirements-list">
            <li><strong>顶部导航栏：</strong>显示系统Logo、当前用户信息、消息通知、快捷操作按钮等。点击用户头像可以访问个人设置、修改密码、退出登录等功能。</li>
            <li><strong>左侧菜单栏：</strong>包含系统的主要功能模块入口，如影像诊断、病例管理、数据统计、知识库等。点击菜单项可展开子菜单，再次点击可收起。</li>
            <li><strong>中央工作区：</strong>显示当前选中功能模块的详细内容和操作界面。这是您主要的工作区域，所有的影像查看、病例编辑等操作都在这里完成。</li>
            <li><strong>右侧信息面板：</strong>根据当前操作显示相关的辅助信息，如患者详情、诊断建议、操作历史等。可以通过按钮隐藏或显示此面板。</li>
            <li><strong>底部状态栏：</strong>显示系统运行状态、网络连接状态、当前操作提示等信息。</li>
          </ul>

          <h3 class="subsection-title">2.3 基本操作步骤</h3>
          <p>完成一次完整的影像诊断通常包括以下步骤：</p>
          
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-title">创建或选择病例</div>
                <div class="step-desc">在病例管理模块中创建新病例，或从待诊列表中选择需要诊断的病例。填写患者基本信息和检查信息。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-title">导入影像数据</div>
                <div class="step-desc">通过PACS系统自动获取影像，或手动上传影像文件。系统支持DICOM、JPG、PNG等多种格式。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-title">影像分析与标注</div>
                <div class="step-desc">使用影像查看工具浏览影像，调整窗宽窗位。使用测量工具进行距离、面积、角度等测量。对可疑区域进行标注和备注。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <div class="step-title">AI辅助诊断</div>
                <div class="step-desc">启动AI辅助诊断功能，系统会自动分析影像并标识可疑病灶。查看AI给出的诊断建议和置信度评分。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">5</div>
              <div class="step-content">
                <div class="step-title">编写诊断报告</div>
                <div class="step-desc">根据影像分析结果和AI建议，编写诊断报告。可以使用模板快速生成报告，也可以自定义编写。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">6</div>
              <div class="step-content">
                <div class="step-title">审核与提交</div>
                <div class="step-desc">检查报告内容，确认无误后提交。如需上级医生审核，可以发送审核请求。审核通过后，报告将自动归档。</div>
              </div>
            </div>
          </div>

          <div class="tip-box">
            <div class="tip-title">💡 操作技巧</div>
            <div class="tip-content">
              系统支持多种快捷键操作，可以大大提高工作效率。例如：Ctrl+N 创建新病例，Ctrl+O 打开影像，Ctrl+S 保存当前工作，Ctrl+P 打印报告等。完整的快捷键列表可以在系统设置中查看。
            </div>
          </div>
        </div>

        <!-- Account Login -->
        <div class="content-section" v-show="activeSection === 'account-login'">
          <h2 class="section-title">2.1 账号登录</h2>
          <p>在开始使用本系统前，请先获得管理员分配的账号。管理员会为您创建账号并设置初始权限。</p>
          
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-title">访问系统登录页面</div>
                <div class="step-desc">在浏览器地址栏中输入系统URL，例如：http://medimaging.yourhospital.com，按回车键访问登录页面。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-title">输入账号密码</div>
                <div class="step-desc">在登录界面输入用户名和密码。用户名通常为您的工号或医生编号。首次登录建议修改初始密码。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-title">选择科室（如需要）</div>
                <div class="step-desc">如果您属于多个科室，登录时需要选择当前工作的科室。系统会根据科室权限显示相应的功能模块。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <div class="step-title">点击"登录"按钮</div>
                <div class="step-desc">确认信息无误后，点击登录按钮进入系统主界面。系统会自动记录您的登录信息。</div>
              </div>
            </div>
          </div>

          <div class="tip-box">
            <div class="tip-title">💡 密码安全提示</div>
            <div class="tip-content">
              首次登录系统后，请立即修改初始密码。密码应包含大小写字母、数字和特殊字符，长度至少8位。为保障账号安全，建议定期更换密码，不要与他人共享账号信息。如忘记密码，请联系系统管理员重置。
            </div>
          </div>
        </div>

        <!-- Interface Navigation -->
        <div class="content-section" v-show="activeSection === 'interface-navigation'">
          <h2 class="section-title">2.2 界面导航</h2>
          <p>登录成功后，您将看到系统主界面。主界面采用经典的上下左右布局结构：</p>
          
          <ul class="requirements-list">
            <li><strong>顶部导航栏：</strong>显示系统Logo、当前用户信息、消息通知、快捷操作按钮等。点击用户头像可以访问个人设置、修改密码、退出登录等功能。</li>
            <li><strong>左侧菜单栏：</strong>包含系统的主要功能模块入口，如影像诊断、病例管理、数据统计、知识库等。点击菜单项可展开子菜单，再次点击可收起。</li>
            <li><strong>中央工作区：</strong>显示当前选中功能模块的详细内容和操作界面。这是您主要的工作区域，所有的影像查看、病例编辑等操作都在这里完成。</li>
            <li><strong>右侧信息面板：</strong>根据当前操作显示相关的辅助信息，如患者详情、诊断建议、操作历史等。可以通过按钮隐藏或显示此面板。</li>
            <li><strong>底部状态栏：</strong>显示系统运行状态、网络连接状态、当前操作提示等信息。</li>
          </ul>
        </div>

        <!-- Basic Operations -->
        <div class="content-section" v-show="activeSection === 'basic-operations'">
          <h2 class="section-title">2.3 基本操作步骤</h2>
          <p>完成一次完整的影像诊断通常包括以下步骤：</p>
          
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-title">创建或选择病例</div>
                <div class="step-desc">在病例管理模块中创建新病例，或从待诊列表中选择需要诊断的病例。填写患者基本信息和检查信息。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-title">导入影像数据</div>
                <div class="step-desc">通过PACS系统自动获取影像，或手动上传影像文件。系统支持DICOM、JPG、PNG等多种格式。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-title">影像分析与标注</div>
                <div class="step-desc">使用影像查看工具浏览影像，调整窗宽窗位。使用测量工具进行距离、面积、角度等测量。对可疑区域进行标注和备注。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <div class="step-title">AI辅助诊断</div>
                <div class="step-desc">启动AI辅助诊断功能，系统会自动分析影像并标识可疑病灶。查看AI给出的诊断建议和置信度评分。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">5</div>
              <div class="step-content">
                <div class="step-title">编写诊断报告</div>
                <div class="step-desc">根据影像分析结果和AI建议，编写诊断报告。可以使用模板快速生成报告，也可以自定义编写。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">6</div>
              <div class="step-content">
                <div class="step-title">审核与提交</div>
                <div class="step-desc">检查报告内容，确认无误后提交。如需上级医生审核，可以发送审核请求。审核通过后，报告将自动归档。</div>
              </div>
            </div>
          </div>

          <div class="tip-box">
            <div class="tip-title">💡 操作技巧</div>
            <div class="tip-content">
              系统支持多种快捷键操作，可以大大提高工作效率。例如：Ctrl+N 创建新病例，Ctrl+O 打开影像，Ctrl+S 保存当前工作，Ctrl+P 打印报告等。完整的快捷键列表可以在系统设置中查看。
            </div>
          </div>
        </div>

        <!-- Diagnosis Module Section -->
        <div class="content-section" v-show="activeSection === 'diagnosis-module'">
          <h2 class="section-title">3. 影像诊断模块</h2>
          <p>影像诊断模块是系统的核心功能，提供专业的医学影像查看、分析和诊断工具。</p>

          <h3 class="subsection-title">3.1 影像导入</h3>
          <p>系统支持多种方式导入医学影像数据：</p>
          
          <ul class="requirements-list">
            <li><strong>PACS系统集成：</strong>如果您的医院已部署PACS系统，本系统可以直接从PACS获取影像数据。在病例界面点击"从PACS获取"按钮，输入检查号或患者ID即可自动导入。</li>
            <li><strong>本地文件上传：</strong>支持从本地计算机上传影像文件。点击"上传影像"按钮，选择文件后上传。支持单个文件或整个文件夹的批量上传。</li>
            <li><strong>网络路径导入：</strong>如果影像存储在网络共享文件夹中，可以通过网络路径直接导入。需要先在系统设置中配置网络路径和访问权限。</li>
            <li><strong>CD/DVD光盘导入：</strong>支持从医学影像光盘导入DICOM文件。插入光盘后，系统会自动识别并提示导入。</li>
          </ul>

          <div class="info-box">
            <div class="info-box-icon">ℹ️</div>
            <div class="info-box-content">
              <strong>支持的影像格式</strong><br>
              系统支持DICOM (.dcm)、JPEG (.jpg, .jpeg)、PNG (.png)、TIFF (.tif, .tiff)、BMP (.bmp)等常见医学影像格式。推荐使用DICOM格式，因为它包含完整的患者信息和影像参数。
            </div>
          </div>

          <h3 class="subsection-title">3.2 影像标注与标记</h3>
          <p>系统提供丰富的标注工具，帮助医生在影像上标记重要区域和添加注释：</p>
          
          <ul class="requirements-list">
            <li><strong>箭头标注：</strong>使用箭头指向需要关注的区域，可以调整箭头的颜色、粗细和样式。</li>
            <li><strong>圆形/椭圆标注：</strong>用圆形或椭圆圈出病灶区域，适合标记肿块、结节等圆形病变。</li>
            <li><strong>矩形标注：</strong>用矩形框选需要关注的区域，可以精确定位病变位置。</li>
            <li><strong>自由绘制：</strong>使用画笔工具自由绘制任意形状的标注，适合不规则病变的标记。</li>
            <li><strong>文字注释：</strong>在影像上添加文字说明，记录重要的诊断信息和观察结果。</li>
            <li><strong>颜色编码：</strong>可以为不同类型的标注设置不同颜色，便于区分和识别。</li>
          </ul>

          <h3 class="subsection-title">3.3 影像测量工具</h3>
          <p>系统内置多种专业的影像测量工具，支持精确的定量分析：</p>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>测量工具</th>
                  <th>功能说明</th>
                  <th>适用场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>长度测量</td>
                  <td>测量两点之间的直线距离，自动显示测量值</td>
                  <td>测量病灶大小、器官长度等</td>
                </tr>
                <tr>
                  <td>角度测量</td>
                  <td>测量两条线段之间的夹角</td>
                  <td>骨科影像分析、脊柱角度测量</td>
                </tr>
                <tr>
                  <td>面积测量</td>
                  <td>测量不规则区域的面积，支持多边形和自由绘制</td>
                  <td>肿瘤面积计算、器官面积测量</td>
                </tr>
                <tr>
                  <td>密度测量</td>
                  <td>测量选定区域的CT值或信号强度</td>
                  <td>组织密度分析、病变性质判断</td>
                </tr>
                <tr>
                  <td>体积测量</td>
                  <td>基于多层影像计算三维体积</td>
                  <td>肿瘤体积评估、器官容积测量</td>
                </tr>
                <tr>
                  <td>比值计算</td>
                  <td>计算两个测量值的比值</td>
                  <td>心胸比、脑室比等指标计算</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="subsection-title">3.4 AI辅助诊断</h3>
          <p>系统集成了先进的深度学习算法，提供智能化的辅助诊断功能：</p>
          
          <ul class="requirements-list">
            <li><strong>病灶自动检测：</strong>AI算法可以自动识别影像中的可疑病灶，并用不同颜色标记出来。支持肺结节、脑出血、骨折等多种病变的检测。</li>
            <li><strong>病变分类：</strong>对检测到的病灶进行自动分类，判断良恶性、病变类型等。系统会给出分类结果和置信度评分。</li>
            <li><strong>量化分析：</strong>自动测量病灶的大小、形态、密度等参数，生成量化分析报告。</li>
            <li><strong>对比分析：</strong>如果有历史影像，AI可以自动对比前后影像的变化，评估病情进展或治疗效果。</li>
            <li><strong>诊断建议：</strong>基于影像特征和临床知识库，AI会给出初步的诊断建议和鉴别诊断要点，供医生参考。</li>
          </ul>

          <div class="warning-box">
            <div class="warning-box-icon">⚠️</div>
            <div>
              <div class="warning-title">重要提示</div>
              <div>AI辅助诊断功能仅供参考，不能替代医生的专业判断。最终诊断结果应由具有资质的医生根据临床表现、实验室检查和影像学检查综合判断。医生应对AI的诊断建议进行审核和验证，对诊断结果负责。</div>
            </div>
          </div>
        </div>

        <!-- 3.1 Image Upload -->
        <div class="content-section" v-show="activeSection === 'image-upload'">
          <h2 class="section-title">3.1 影像导入</h2>
          <p>系统支持多种方式导入医学影像数据：</p>
          
          <ul class="requirements-list">
            <li><strong>PACS系统集成：</strong>如果您的医院已部署PACS系统，本系统可以直接从PACS获取影像数据。在病例界面点击"从PACS获取"按钮，输入检查号或患者ID即可自动导入。</li>
            <li><strong>本地文件上传：</strong>支持从本地计算机上传影像文件。点击"上传影像"按钮，选择文件后上传。支持单个文件或整个文件夹的批量上传。</li>
            <li><strong>网络路径导入：</strong>如果影像存储在网络共享文件夹中，可以通过网络路径直接导入。需要先在系统设置中配置网络路径和访问权限。</li>
            <li><strong>CD/DVD光盘导入：</strong>支持从医学影像光盘导入DICOM文件。插入光盘后，系统会自动识别并提示导入。</li>
          </ul>

          <div class="info-box">
            <div class="info-box-icon">ℹ️</div>
            <div class="info-box-content">
              <strong>支持的影像格式</strong><br>
              系统支持DICOM (.dcm)、JPEG (.jpg, .jpeg)、PNG (.png)、TIFF (.tif, .tiff)、BMP (.bmp)等常见医学影像格式。推荐使用DICOM格式，因为它包含完整的患者信息和影像参数。
            </div>
          </div>
        </div>

        <!-- 3.2 Image Annotation -->
        <div class="content-section" v-show="activeSection === 'image-annotation'">
          <h2 class="section-title">3.2 影像标注与标记</h2>
          <p>系统提供丰富的标注工具，帮助医生在影像上标记重要区域和添加注释：</p>
          
          <ul class="requirements-list">
            <li><strong>箭头标注：</strong>使用箭头指向需要关注的区域，可以调整箭头的颜色、粗细和样式。</li>
            <li><strong>圆形/椭圆标注：</strong>用圆形或椭圆圈出病灶区域，适合标记肿块、结节等圆形病变。</li>
            <li><strong>矩形标注：</strong>用矩形框选需要关注的区域，可以精确定位病变位置。</li>
            <li><strong>自由绘制：</strong>使用画笔工具自由绘制任意形状的标注，适合不规则病变的标记。</li>
            <li><strong>文字注释：</strong>在影像上添加文字说明，记录重要的诊断信息和观察结果。</li>
            <li><strong>颜色编码：</strong>可以为不同类型的标注设置不同颜色，便于区分和识别。</li>
          </ul>
        </div>

        <!-- 3.3 Image Tools -->
        <div class="content-section" v-show="activeSection === 'image-tools'">
          <h2 class="section-title">3.3 影像测量工具</h2>
          <p>系统内置多种专业的影像测量工具，支持精确的定量分析：</p>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>测量工具</th>
                  <th>功能说明</th>
                  <th>适用场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>长度测量</td>
                  <td>测量两点之间的直线距离，自动显示测量值</td>
                  <td>测量病灶大小、器官长度等</td>
                </tr>
                <tr>
                  <td>角度测量</td>
                  <td>测量两条线段之间的夹角</td>
                  <td>骨科影像分析、脊柱角度测量</td>
                </tr>
                <tr>
                  <td>面积测量</td>
                  <td>测量不规则区域的面积，支持多边形和自由绘制</td>
                  <td>肿瘤面积计算、器官面积测量</td>
                </tr>
                <tr>
                  <td>密度测量</td>
                  <td>测量选定区域的CT值或信号强度</td>
                  <td>组织密度分析、病变性质判断</td>
                </tr>
                <tr>
                  <td>体积测量</td>
                  <td>基于多层影像计算三维体积</td>
                  <td>肿瘤体积评估、器官容积测量</td>
                </tr>
                <tr>
                  <td>比值计算</td>
                  <td>计算两个测量值的比值</td>
                  <td>心胸比、脑室比等指标计算</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.4 AI Diagnosis -->
        <div class="content-section" v-show="activeSection === 'ai-diagnosis'">
          <h2 class="section-title">3.4 AI辅助诊断</h2>
          <p>系统集成了先进的深度学习算法，提供智能化的辅助诊断功能：</p>
          
          <ul class="requirements-list">
            <li><strong>病灶自动检测：</strong>AI算法可以自动识别影像中的可疑病灶，并用不同颜色标记出来。支持肺结节、脑出血、骨折等多种病变的检测。</li>
            <li><strong>病变分类：</strong>对检测到的病灶进行自动分类，判断良恶性、病变类型等。系统会给出分类结果和置信度评分。</li>
            <li><strong>量化分析：</strong>自动测量病灶的大小、形态、密度等参数，生成量化分析报告。</li>
            <li><strong>对比分析：</strong>如果有历史影像，AI可以自动对比前后影像的变化，评估病情进展或治疗效果。</li>
            <li><strong>诊断建议：</strong>基于影像特征和临床知识库，AI会给出初步的诊断建议和鉴别诊断要点，供医生参考。</li>
          </ul>

          <div class="warning-box">
            <div class="warning-box-icon">⚠️</div>
            <div>
              <div class="warning-title">重要提示</div>
              <div>AI辅助诊断功能仅供参考，不能替代医生的专业判断。最终诊断结果应由具有资质的医生根据临床表现、实验室检查和影像学检查综合判断。医生应对AI的诊断建议进行审核和验证，对诊断结果负责。</div>
            </div>
          </div>
        </div>

        <!-- Case Management Section -->
        <div class="content-section" v-show="activeSection === 'case-management'">
          <h2 class="section-title">4. 病例管理</h2>
          <p>病例管理模块提供完整的病例生命周期管理功能，从病例创建到归档查询。</p>

          <h3 class="subsection-title">4.1 创建病例</h3>
          <p>创建新病例是诊断工作的第一步。系统提供便捷的病例创建流程：</p>
          
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-title">点击"新建病例"按钮</div>
                <div class="step-desc">在病例管理界面点击"新建病例"按钮，打开病例创建表单。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-title">填写患者基本信息</div>
                <div class="step-desc">输入患者姓名、性别、年龄、身份证号等基本信息。系统会自动检查是否有重复病例。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-title">填写检查信息</div>
                <div class="step-desc">选择检查类型（CT、MRI、X光等）、检查部位、检查日期、临床症状等信息。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <div class="step-title">保存病例</div>
                <div class="step-desc">确认信息无误后点击"保存"按钮。系统会自动生成病例号，并将病例添加到待诊列表。</div>
              </div>
            </div>
          </div>

          <h3 class="subsection-title">4.2 病例检索</h3>
          <p>系统提供强大的病例检索功能，支持多种检索方式：</p>
          
          <ul class="requirements-list">
            <li><strong>快速检索：</strong>在搜索框中输入患者姓名、病例号、身份证号等关键词，快速定位病例。</li>
            <li><strong>高级检索：</strong>支持按检查日期范围、检查类型、诊断结果、医生姓名等多个条件组合检索。</li>
            <li><strong>状态筛选：</strong>可以按病例状态筛选，如待诊、已诊断、已审核、已归档等。</li>
            <li><strong>收藏夹：</strong>可以将常用的检索条件保存为收藏夹，方便下次快速检索。</li>
          </ul>

          <h3 class="subsection-title">4.3 诊断报告生成</h3>
          <p>系统提供智能化的诊断报告生成功能：</p>
          
          <ul class="requirements-list">
            <li><strong>报告模板：</strong>系统内置多种常用的诊断报告模板，涵盖各种检查类型和疾病。可以选择合适的模板快速生成报告框架。</li>
            <li><strong>智能填充：</strong>系统会根据影像分析结果和AI诊断建议，自动填充报告的部分内容，如病灶描述、测量数据等。</li>
            <li><strong>富文本编辑：</strong>报告编辑器支持富文本格式，可以设置字体、颜色、对齐方式等。支持插入影像截图和标注。</li>
            <li><strong>语音输入：</strong>支持语音输入功能，医生可以通过语音快速录入报告内容，系统会自动转换为文字。</li>
            <li><strong>报告审核：</strong>报告完成后可以提交给上级医生审核。审核医生可以添加审核意见，修改报告内容。</li>
            <li><strong>电子签名：</strong>报告审核通过后，医生可以添加电子签名。签名后的报告不可修改，确保报告的法律效力。</li>
          </ul>

          <div class="tip-box">
            <div class="tip-title">💡 报告编写技巧</div>
            <div class="tip-content">
              编写诊断报告时，建议遵循"描述-分析-结论"的结构。首先客观描述影像所见，包括病变的位置、大小、形态、密度等；然后分析病变的性质和可能的诊断；最后给出明确的诊断结论或鉴别诊断建议。报告应使用规范的医学术语，避免模糊不清的表述。
            </div>
          </div>
        </div>

        <!-- Data Statistics Section -->
        <div class="content-section" v-show="activeSection === 'data-statistics'">
          <h2 class="section-title">5. 数据统计分析</h2>
          <p>数据统计分析模块帮助医疗机构了解诊断工作情况，为管理决策提供数据支持。</p>

          <h3 class="subsection-title">5.1 统计概览</h3>
          <p>统计概览页面展示关键的统计指标和趋势图表：</p>
          
          <ul class="requirements-list">
            <li><strong>工作量统计：</strong>显示指定时间段内的病例总数、完成数、待诊数等。可以按日、周、月、年等不同时间粒度统计。</li>
            <li><strong>检查类型分布：</strong>统计各种检查类型（CT、MRI、X光等）的数量和占比，以饼图或柱状图展示。</li>
            <li><strong>疾病分布：</strong>统计各种疾病的诊断数量，了解常见疾病的分布情况。</li>
            <li><strong>医生工作量：</strong>统计各医生的诊断数量、平均诊断时间等指标，用于绩效评估。</li>
            <li><strong>AI使用情况：</strong>统计AI辅助诊断的使用率、准确率等指标，评估AI的应用效果。</li>
          </ul>

          <h3 class="subsection-title">5.2 自定义报表</h3>
          <p>系统支持创建自定义统计报表，满足不同的统计需求：</p>
          
          <ul class="requirements-list">
            <li><strong>报表设计器：</strong>提供可视化的报表设计工具，可以拖拽添加统计字段、设置筛选条件、选择图表类型等。</li>
            <li><strong>多维度分析：</strong>支持按科室、医生、时间、疾病类型等多个维度进行交叉分析。</li>
            <li><strong>数据导出：</strong>统计结果可以导出为Excel、PDF、CSV等格式，方便进一步分析或汇报。</li>
            <li><strong>定时报表：</strong>可以设置定时生成报表，系统会自动在指定时间生成报表并发送给相关人员。</li>
            <li><strong>报表分享：</strong>可以将报表分享给其他用户，或生成公开链接供外部访问。</li>
          </ul>
        </div>

        <!-- 4.1 Case Create -->
        <div class="content-section" v-show="activeSection === 'case-create'">
          <h2 class="section-title">4.1 创建病例</h2>
          <p>创建新病例是诊断工作的第一步。系统提供便捷的病例创建流程：</p>
          
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-title">点击"新建病例"按钮</div>
                <div class="step-desc">在病例管理界面点击"新建病例"按钮，打开病例创建表单。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-title">填写患者基本信息</div>
                <div class="step-desc">输入患者姓名、性别、年龄、身份证号等基本信息。系统会自动检查是否有重复病例。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-title">填写检查信息</div>
                <div class="step-desc">选择检查类型（CT、MRI、X光等）、检查部位、检查日期、临床症状等信息。</div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <div class="step-title">保存病例</div>
                <div class="step-desc">确认信息无误后点击"保存"按钮。系统会自动生成病例号，并将病例添加到待诊列表。</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4.2 Case Search -->
        <div class="content-section" v-show="activeSection === 'case-search'">
          <h2 class="section-title">4.2 病例检索</h2>
          <p>系统提供强大的病例检索功能，支持多种检索方式：</p>
          
          <ul class="requirements-list">
            <li><strong>快速检索：</strong>在搜索框中输入患者姓名、病例号、身份证号等关键词，快速定位病例。</li>
            <li><strong>高级检索：</strong>支持按检查日期范围、检查类型、诊断结果、医生姓名等多个条件组合检索。</li>
            <li><strong>状态筛选：</strong>可以按病例状态筛选，如待诊、已诊断、已审核、已归档等。</li>
            <li><strong>收藏夹：</strong>可以将常用的检索条件保存为收藏夹，方便下次快速检索。</li>
          </ul>
        </div>

        <!-- 4.3 Case Report -->
        <div class="content-section" v-show="activeSection === 'case-report'">
          <h2 class="section-title">4.3 诊断报告生成</h2>
          <p>系统提供智能化的诊断报告生成功能：</p>
          
          <ul class="requirements-list">
            <li><strong>报告模板：</strong>系统内置多种常用的诊断报告模板，涵盖各种检查类型和疾病。可以选择合适的模板快速生成报告框架。</li>
            <li><strong>智能填充：</strong>系统会根据影像分析结果和AI诊断建议，自动填充报告的部分内容，如病灶描述、测量数据等。</li>
            <li><strong>富文本编辑：</strong>报告编辑器支持富文本格式，可以设置字体、颜色、对齐方式等。支持插入影像截图和标注。</li>
            <li><strong>语音输入：</strong>支持语音输入功能，医生可以通过语音快速录入报告内容，系统会自动转换为文字。</li>
            <li><strong>报告审核：</strong>报告完成后可以提交给上级医生审核。审核医生可以添加审核意见，修改报告内容。</li>
            <li><strong>电子签名：</strong>报告审核通过后，医生可以添加电子签名。签名后的报告不可修改，确保报告的法律效力。</li>
          </ul>

          <div class="tip-box">
            <div class="tip-title">💡 报告编写技巧</div>
            <div class="tip-content">
              编写诊断报告时，建议遵循"描述-分析-结论"的结构。首先客观描述影像所见，包括病变的位置、大小、形态、密度等；然后分析病变的性质和可能的诊断；最后给出明确的诊断结论或鉴别诊断建议。报告应使用规范的医学术语，避免模糊不清的表述。
            </div>
          </div>
        </div>

        <!-- 5.1 Statistics Overview -->
        <div class="content-section" v-show="activeSection === 'statistics-overview'">
          <h2 class="section-title">5.1 统计概览</h2>
          <p>统计概览页面展示关键的统计指标和趋势图表：</p>
          
          <ul class="requirements-list">
            <li><strong>工作量统计：</strong>显示指定时间段内的病例总数、完成数、待诊数等。可以按日、周、月、年等不同时间粒度统计。</li>
            <li><strong>检查类型分布：</strong>统计各种检查类型（CT、MRI、X光等）的数量和占比，以饼图或柱状图展示。</li>
            <li><strong>疾病分布：</strong>统计各种疾病的诊断数量，了解常见疾病的分布情况。</li>
            <li><strong>医生工作量：</strong>统计各医生的诊断数量、平均诊断时间等指标，用于绩效评估。</li>
            <li><strong>AI使用情况：</strong>统计AI辅助诊断的使用率、准确率等指标，评估AI的应用效果。</li>
          </ul>
        </div>

        <!-- 5.2 Custom Reports -->
        <div class="content-section" v-show="activeSection === 'custom-reports'">
          <h2 class="section-title">5.2 自定义报表</h2>
          <p>系统支持创建自定义统计报表，满足不同的统计需求：</p>
          
          <ul class="requirements-list">
            <li><strong>报表设计器：</strong>提供可视化的报表设计工具，可以拖拽添加统计字段、设置筛选条件、选择图表类型等。</li>
            <li><strong>多维度分析：</strong>支持按科室、医生、时间、疾病类型等多个维度进行交叉分析。</li>
            <li><strong>数据导出：</strong>统计结果可以导出为Excel、PDF、CSV等格式，方便进一步分析或汇报。</li>
            <li><strong>定时报表：</strong>可以设置定时生成报表，系统会自动在指定时间生成报表并发送给相关人员。</li>
            <li><strong>报表分享：</strong>可以将报表分享给其他用户，或生成公开链接供外部访问。</li>
          </ul>
        </div>

        <!-- Knowledge Base Section -->
        <div class="content-section" v-show="activeSection === 'knowledge-base'">
          <h2 class="section-title">6. 医生知识库</h2>
          <p>医生知识库整合了丰富的医学知识资源，为医生提供便捷的学习和查询平台。</p>

          <h3 class="subsection-title">6.1 疾病数据库</h3>
          <p>疾病数据库收录了常见疾病的诊断标准、影像特征、鉴别诊断等信息：</p>
          
          <ul class="requirements-list">
            <li><strong>疾病分类：</strong>按照国际疾病分类标准（ICD-10）组织疾病信息，方便查找和浏览。</li>
            <li><strong>影像特征：</strong>详细描述各种疾病在不同影像检查中的典型表现，配有高质量的示例图片。</li>
            <li><strong>诊断标准：</strong>提供权威的诊断标准和诊断流程，帮助医生做出准确诊断。</li>
            <li><strong>鉴别诊断：</strong>列出需要鉴别的疾病和鉴别要点，避免误诊和漏诊。</li>
            <li><strong>治疗建议：</strong>提供疾病的治疗原则和常用治疗方案，供临床参考。</li>
            <li><strong>文献引用：</strong>每条疾病信息都标注了权威文献来源，确保信息的准确性和可靠性。</li>
          </ul>

          <h3 class="subsection-title">6.2 典型病例库</h3>
          <p>典型病例库收集了大量经过验证的典型病例，是宝贵的学习资源：</p>
          
          <ul class="requirements-list">
            <li><strong>病例分类：</strong>按疾病类型、检查方式、难度等级等分类组织病例，方便检索和学习。</li>
            <li><strong>完整病例资料：</strong>每个病例包含完整的患者信息、临床表现、影像资料、诊断过程、最终诊断和随访结果。</li>
            <li><strong>专家点评：</strong>资深专家对病例进行详细点评，分析诊断思路和关键诊断要点。</li>
            <li><strong>相似病例推荐：</strong>系统会根据当前诊断的病例，自动推荐相似的典型病例供参考。</li>
            <li><strong>病例收藏：</strong>可以收藏感兴趣的病例，建立个人的病例学习库。</li>
            <li><strong>病例讨论：</strong>医生可以对病例发表评论，与同行交流讨论，共同提高诊断水平。</li>
          </ul>

          <div class="info-box">
            <div class="info-box-icon">ℹ️</div>
            <div class="info-box-content">
              <strong>知识库更新</strong><br>
              知识库内容会定期更新，增加新的疾病信息和典型病例。系统会自动提示有新内容更新，建议医生定期浏览学习，保持知识的更新。
            </div>
          </div>
        </div>

        <!-- 6.1 Disease Database -->
        <div class="content-section" v-show="activeSection === 'disease-database'">
          <h2 class="section-title">6.1 疾病数据库</h2>
          <p>疾病数据库收录了常见疾病的诊断标准、影像特征、鉴别诊断等信息：</p>
          
          <ul class="requirements-list">
            <li><strong>疾病分类：</strong>按照国际疾病分类标准（ICD-10）组织疾病信息，方便查找和浏览。</li>
            <li><strong>影像特征：</strong>详细描述各种疾病在不同影像检查中的典型表现，配有高质量的示例图片。</li>
            <li><strong>诊断标准：</strong>提供权威的诊断标准和诊断流程，帮助医生做出准确诊断。</li>
            <li><strong>鉴别诊断：</strong>列出需要鉴别的疾病和鉴别要点，避免误诊和漏诊。</li>
            <li><strong>治疗建议：</strong>提供疾病的治疗原则和常用治疗方案，供临床参考。</li>
            <li><strong>文献引用：</strong>每条疾病信息都标注了权威文献来源，确保信息的准确性和可靠性。</li>
          </ul>
        </div>

        <!-- 6.2 Case Library -->
        <div class="content-section" v-show="activeSection === 'case-library'">
          <h2 class="section-title">6.2 典型病例库</h2>
          <p>典型病例库收集了大量经过验证的典型病例，是宝贵的学习资源：</p>
          
          <ul class="requirements-list">
            <li><strong>病例分类：</strong>按疾病类型、检查方式、难度等级等分类组织病例，方便检索和学习。</li>
            <li><strong>完整病例资料：</strong>每个病例包含完整的患者信息、临床表现、影像资料、诊断过程、最终诊断和随访结果。</li>
            <li><strong>专家点评：</strong>资深专家对病例进行详细点评，分析诊断思路和关键诊断要点。</li>
            <li><strong>相似病例推荐：</strong>系统会根据当前诊断的病例，自动推荐相似的典型病例供参考。</li>
            <li><strong>病例收藏：</strong>可以收藏感兴趣的病例，建立个人的病例学习库。</li>
            <li><strong>病例讨论：</strong>医生可以对病例发表评论，与同行交流讨论，共同提高诊断水平。</li>
          </ul>

          <div class="info-box">
            <div class="info-box-icon">ℹ️</div>
            <div class="info-box-content">
              <strong>知识库更新</strong><br>
              知识库内容会定期更新，增加新的疾病信息和典型病例。系统会自动提示有新内容更新，建议医生定期浏览学习，保持知识的更新。
            </div>
          </div>
        </div>

        <!-- System Settings Section -->
        <div class="content-section" v-show="activeSection === 'system-settings'">
          <h2 class="section-title">7. 系统设置</h2>
          <p>系统设置模块允许用户自定义系统参数和管理权限。</p>

          <h3 class="subsection-title">7.1 个人设置</h3>
          <p>在个人设置中，您可以自定义个人的使用偏好：</p>
          
          <ul class="requirements-list">
            <li><strong>基本信息：</strong>修改个人信息，如姓名、联系方式、科室等。上传个人头像。</li>
            <li><strong>密码修改：</strong>定期修改登录密码，确保账号安全。需要输入原密码和两次新密码。</li>
            <li><strong>界面设置：</strong>选择界面主题（浅色/深色）、字体大小、语言等。</li>
            <li><strong>快捷键设置：</strong>自定义常用功能的快捷键，提高操作效率。</li>
            <li><strong>通知设置：</strong>设置接收哪些类型的系统通知，如新病例提醒、审核通知等。</li>
            <li><strong>默认设置：</strong>设置默认的窗宽窗位、测量单位、报告模板等。</li>
          </ul>

          <h3 class="subsection-title">7.2 权限管理</h3>
          <p>权限管理功能仅对管理员开放，用于管理用户和权限：</p>
          
          <ul class="requirements-list">
            <li><strong>用户管理：</strong>创建、编辑、删除用户账号。设置用户的基本信息和所属科室。</li>
            <li><strong>角色管理：</strong>定义不同的用户角色，如医生、技师、管理员等。为每个角色分配相应的功能权限。</li>
            <li><strong>权限分配：</strong>为用户分配角色，或单独设置用户的功能权限。支持细粒度的权限控制。</li>
            <li><strong>科室管理：</strong>创建和管理科室信息，设置科室的可用功能和数据访问范围。</li>
            <li><strong>审计日志：</strong>查看系统操作日志，包括用户登录、病例访问、报告修改等记录。</li>
          </ul>

          <div class="warning-box">
            <div class="warning-box-icon">⚠️</div>
            <div>
              <div class="warning-title">权限管理注意事项</div>
              <div>权限管理涉及系统安全和数据保护，请谨慎操作。建议遵循最小权限原则，只授予用户完成工作所需的最小权限。定期审查用户权限，及时回收离职人员的账号权限。重要操作应启用双重验证，防止误操作。</div>
            </div>
          </div>
        </div>

        <!-- 7.1 Personal Settings -->
        <div class="content-section" v-show="activeSection === 'personal-settings'">
          <h2 class="section-title">7.1 个人设置</h2>
          <p>在个人设置中，您可以自定义个人的使用偏好：</p>
          
          <ul class="requirements-list">
            <li><strong>基本信息：</strong>修改个人信息，如姓名、联系方式、科室等。上传个人头像。</li>
            <li><strong>密码修改：</strong>定期修改登录密码，确保账号安全。需要输入原密码和两次新密码。</li>
            <li><strong>界面设置：</strong>选择界面主题（浅色/深色）、字体大小、语言等。</li>
            <li><strong>快捷键设置：</strong>自定义常用功能的快捷键，提高操作效率。</li>
            <li><strong>通知设置：</strong>设置接收哪些类型的系统通知，如新病例提醒、审核通知等。</li>
            <li><strong>默认设置：</strong>设置默认的窗宽窗位、测量单位、报告模板等。</li>
          </ul>
        </div>

        <!-- 7.2 Permission Management -->
        <div class="content-section" v-show="activeSection === 'permission-management'">
          <h2 class="section-title">7.2 权限管理</h2>
          <p>权限管理功能仅对管理员开放，用于管理用户和权限：</p>
          
          <ul class="requirements-list">
            <li><strong>用户管理：</strong>创建、编辑、删除用户账号。设置用户的基本信息和所属科室。</li>
            <li><strong>角色管理：</strong>定义不同的用户角色，如医生、技师、管理员等。为每个角色分配相应的功能权限。</li>
            <li><strong>权限分配：</strong>为用户分配角色，或单独设置用户的功能权限。支持细粒度的权限控制。</li>
            <li><strong>科室管理：</strong>创建和管理科室信息，设置科室的可用功能和数据访问范围。</li>
            <li><strong>审计日志：</strong>查看系统操作日志，包括用户登录、病例访问、报告修改等记录。</li>
          </ul>

          <div class="warning-box">
            <div class="warning-box-icon">⚠️</div>
            <div>
              <div class="warning-title">权限管理注意事项</div>
              <div>权限管理涉及系统安全和数据保护，请谨慎操作。建议遵循最小权限原则，只授予用户完成工作所需的最小权限。定期审查用户权限，及时回收离职人员的账号权限。重要操作应启用双重验证，防止误操作。</div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="content-section" v-show="activeSection === 'faq'">
          <h2 class="section-title">8. 常见问题</h2>
          <p>本章节汇总了用户经常遇到的问题和解决方案。</p>

          <div class="faq-item" v-for="(faq, index) in faqs" :key="index" :class="{ open: faq.open }">
            <div class="faq-question" @click="toggleFaq(index)">
              {{ faq.question }}
              <span class="faq-icon">▼</span>
            </div>
            <div class="faq-answer">
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <!-- Troubleshooting Section -->
        <div class="content-section" v-show="activeSection === 'troubleshooting'">
          <h2 class="section-title">9. 故障排除</h2>
          <p>本章节提供常见技术问题的排查和解决方法。</p>

          <h3 class="subsection-title">登录问题</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>问题现象</th>
                  <th>可能原因</th>
                  <th>解决方法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>无法打开登录页面</td>
                  <td>网络连接问题或服务器维护</td>
                  <td>检查网络连接，确认服务器地址正确。如果问题持续，联系IT部门确认服务器状态。</td>
                </tr>
                <tr>
                  <td>提示用户名或密码错误</td>
                  <td>输入错误或账号被锁定</td>
                  <td>仔细检查用户名和密码，注意大小写。连续输错5次会锁定账号，需联系管理员解锁。</td>
                </tr>
                <tr>
                  <td>登录后立即退出</td>
                  <td>浏览器Cookie被禁用</td>
                  <td>在浏览器设置中启用Cookie功能，清除浏览器缓存后重新登录。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="subsection-title">影像显示问题</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>问题现象</th>
                  <th>可能原因</th>
                  <th>解决方法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>影像无法加载或显示空白</td>
                  <td>影像文件损坏或格式不支持</td>
                  <td>检查影像文件是否完整，确认文件格式是否为系统支持的格式。尝试重新导入影像。</td>
                </tr>
                <tr>
                  <td>影像显示模糊或失真</td>
                  <td>显示器分辨率设置不当</td>
                  <td>调整显示器分辨率至推荐值（1920×1080或更高）。检查显卡驱动是否为最新版本。</td>
                </tr>
                <tr>
                  <td>影像加载速度很慢</td>
                  <td>网络带宽不足或服务器负载高</td>
                  <td>检查网络连接速度。如果是从PACS获取影像，联系IT部门检查PACS服务器状态。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="subsection-title">操作响应问题</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>问题现象</th>
                  <th>可能原因</th>
                  <th>解决方法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>系统响应缓慢或卡顿</td>
                  <td>计算机性能不足或内存占用过高</td>
                  <td>关闭其他不必要的程序，释放内存。如果问题持续，考虑升级计算机硬件。</td>
                </tr>
                <tr>
                  <td>点击按钮无反应</td>
                  <td>浏览器兼容性问题或JavaScript错误</td>
                  <td>刷新页面重试。使用推荐的浏览器（Chrome或Edge最新版本）。清除浏览器缓存。</td>
                </tr>
                <tr>
                  <td>数据保存失败</td>
                  <td>网络中断或权限不足</td>
                  <td>检查网络连接。确认您有保存数据的权限。如果问题持续，联系管理员检查数据库状态。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="subsection-title">AI功能问题</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>问题现象</th>
                  <th>可能原因</th>
                  <th>解决方法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AI分析一直处于等待状态</td>
                  <td>AI服务器繁忙或网络问题</td>
                  <td>等待几分钟后重试。如果长时间无响应，联系技术支持检查AI服务器状态。</td>
                </tr>
                <tr>
                  <td>AI分析结果明显错误</td>
                  <td>影像质量差或不在AI支持范围内</td>
                  <td>检查影像质量是否符合要求。确认该类型影像是否在AI支持的范围内。AI结果仅供参考，以医生判断为准。</td>
                </tr>
                <tr>
                  <td>无法启动AI分析功能</td>
                  <td>账号权限不足或AI服务未启用</td>
                  <td>确认您的账号有使用AI功能的权限。联系管理员确认AI服务是否已启用。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="warning-box">
            <div class="warning-box-icon">⚠️</div>
            <div>
              <div class="warning-title">技术支持</div>
              <div>如果以上方法无法解决您的问题，请联系技术支持团队。提供详细的问题描述、错误截图、操作步骤等信息，有助于技术人员快速定位和解决问题。技术支持热线：400-XXX-XXXX（工作日 9:00-18:00）。紧急情况请拨打24小时值班电话：138-XXXX-XXXX。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeSection = ref('system-overview')
const searchTerm = ref('')
const contentArea = ref<HTMLElement>()

// 页面加载时检查是否有section参数
onMounted(() => {
  const section = route.query.section as string
  if (section && navSections.find(s => s.key === section)) {
    showSection(section)
  }
})

// 章节索引用于搜索定位
const navSections = [
  { label: '1. 系统概述', key: 'system-overview' },
  { label: '1.1 系统简介', key: 'system-intro' },
  { label: '1.2 功能模块', key: 'function-modules' },
  { label: '1.3 系统要求', key: 'system-requirements' },
  { label: '2. 快速入门', key: 'quick-start' },
  { label: '2.1 账号登录', key: 'account-login' },
  { label: '2.2 界面导航', key: 'interface-navigation' },
  { label: '2.3 基本操作步骤', key: 'basic-operations' },
  { label: '3. 影像诊断模块', key: 'diagnosis-module' },
  { label: '3.1 影像导入', key: 'image-upload' },
  { label: '3.2 影像标注与标记', key: 'image-annotation' },
  { label: '3.3 影像测量工具', key: 'image-tools' },
  { label: '3.4 AI辅助诊断', key: 'ai-diagnosis' },
  { label: '4. 病例管理', key: 'case-management' },
  { label: '4.1 创建病例', key: 'case-create' },
  { label: '4.2 病例检索', key: 'case-search' },
  { label: '4.3 诊断报告生成', key: 'case-report' },
  { label: '5. 数据统计分析', key: 'data-statistics' },
  { label: '5.1 统计概览', key: 'statistics-overview' },
  { label: '5.2 自定义报表', key: 'custom-reports' },
  { label: '6. 医生知识库', key: 'knowledge-base' },
  { label: '6.1 疾病数据库', key: 'disease-database' },
  { label: '6.2 典型病例库', key: 'case-library' },
  { label: '7. 系统设置', key: 'system-settings' },
  { label: '7.1 个人设置', key: 'personal-settings' },
  { label: '7.2 权限管理', key: 'permission-management' },
  { label: '8. 常见问题', key: 'faq' },
  { label: '9. 故障排除', key: 'troubleshooting' }
]

const faqs = ref([
  {
    question: '如何导出影像诊断报告？',
    answer: '在系统诊断报告页面，点击右上角的"导出"按钮，选择导出格式（PDF或Word），然后选择保存位置即可。导出的报告包含完整的患者信息、影像截图和诊断内容。如需批量导出多个报告，可以在病例列表中勾选需要导出的病例，然后点击"批量导出"按钮。',
    open: false
  },
  {
    question: '系统支持哪些影像格式导入？',
    answer: '系统支持DICOM (.dcm)、JPEG (.jpg, .jpeg)、PNG (.png)、TIFF (.tif, .tiff)、BMP (.bmp)等常见医学影像格式。其中DICOM格式是推荐使用的格式，因为它包含完整的患者信息和影像参数。对于非DICOM格式的影像，系统会提示您手动输入必要的患者信息和检查参数。',
    open: false
  },
  {
    question: '如何申请增加用户账号或修改权限？',
    answer: '普通用户无法自行创建账号或修改权限。如需增加用户账号或修改权限，请联系您所在医院的系统管理员。管理员会根据您的工作需要和职责，为您创建账号并分配相应的权限。如果您是管理员，可以在"系统设置-权限管理"模块中进行用户和权限的管理。',
    open: false
  },
  {
    question: '忘记密码怎么办？',
    answer: '如果忘记登录密码，请联系系统管理员进行密码重置。出于安全考虑，系统不支持用户自助重置密码。管理员会为您重置密码并通过安全方式告知新密码。收到新密码后，请立即登录系统并修改为您自己的密码。建议使用包含大小写字母、数字和特殊字符的强密码，并定期更换。',
    open: false
  },
  {
    question: 'AI辅助诊断的准确率如何？',
    answer: '系统的AI辅助诊断功能基于深度学习算法，在大量临床数据上训练而成。根据临床验证，AI在常见疾病的检测和分类上具有较高的准确率，部分疾病的检测准确率可达90%以上。但需要注意的是，AI的诊断结果仅供参考，不能替代医生的专业判断。医生应结合患者的临床表现、实验室检查和自己的专业经验，对AI的建议进行审核和验证，做出最终的诊断决策。',
    open: false
  },
  {
    question: '如何查看历史诊断记录？',
    answer: '在病例管理模块中，使用检索功能输入患者姓名或病例号，即可查找到该患者的所有历史病例。点击病例可以查看详细的诊断记录，包括影像资料、诊断报告、操作历史等。系统还提供时间轴视图，可以按时间顺序查看患者的所有检查记录，方便进行病情对比和随访评估。',
    open: false
  },
  {
    question: '系统支持移动设备访问吗？',
    answer: '系统采用响应式设计，支持在平板电脑和大屏手机上访问。但由于医学影像诊断需要高分辨率显示和精确操作，我们强烈建议使用台式电脑或笔记本电脑进行诊断工作。移动设备可以用于查看病例信息、审核报告等辅助工作，但不建议用于正式的影像诊断。',
    open: false
  },
  {
    question: '如何备份重要数据？',
    answer: '系统会自动进行数据备份，包括病例数据、影像文件、诊断报告等。备份策略由系统管理员配置，通常采用每日增量备份和每周全量备份的方式。如果您需要导出特定病例的数据进行本地备份，可以使用病例导出功能。对于重要的研究数据或教学病例，建议定期导出并保存到安全的存储设备中。',
    open: false
  }
])

const showSection = (section: string) => {
  activeSection.value = section
  // Scroll to top when switching sections
  if (contentArea.value) {
    contentArea.value.scrollTop = 0
  }
}

const handleSearch = () => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return
  const hit = navSections.find(s => s.label.toLowerCase().includes(term))
  if (hit) {
    showSection(hit.key)
  }
}

const toggleFaq = (index: number) => {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.help-doc-page {
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #f5f7fa;
}

.help-container {
  display: flex;
  margin-top: 0;
  height: 100vh;
  padding-top: 0;
}

.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
  padding: 16px 0;
  height: 100%;
  position: sticky;
  top: 0;
}

.search-box {
  margin: 0 16px 16px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.search-box input:focus {
  border-color: #1677ff;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.nav-title {
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f5f7fa;
  color: #1677ff;
}

.nav-item.active {
  background: #e6f4ff;
  color: #1677ff;
  border-left-color: #1677ff;
  font-weight: 500;
}

.nav-item.sub-item {
  padding-left: 32px;
  font-size: 13px;
}

.nav-item.sub-sub-item {
  padding-left: 48px;
  font-size: 13px;
  color: #666;
}

.content-area {
  margin-left: 240px;
  flex: 1;
  padding: 32px 48px;
  max-width: 1200px;
  overflow-y: auto;
  min-height: calc(100vh - 64px);
}

.doc-header {
  margin-bottom: 24px;
}

.doc-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.doc-meta {
  font-size: 13px;
  color: #999;
}

.content-section {
  display: block;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 32px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1677ff;
}

.subsection-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 12px;
}

.sub-subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px;
}

.info-box {
  background: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  display: flex;
  gap: 12px;
}

.info-box-icon {
  color: #1677ff;
  font-size: 18px;
}

.info-box-content {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.warning-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  display: flex;
  gap: 12px;
}

.warning-box-icon {
  color: #faad14;
  font-size: 18px;
}

.warning-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 16px 0;
}

.feature-card {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.feature-card-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-card-icon {
  color: #1677ff;
}

.feature-card-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.requirements-list {
  margin: 12px 0;
  padding-left: 20px;
}

.requirements-list li {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.step-list {
  margin: 16px 0;
}

.step-item {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #1677ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding-top: 2px;
}

.step-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.step-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.tip-box {
  background: #e6f4ff;
  border-left: 4px solid #1677ff;
  padding: 16px;
  margin: 16px 0;
  border-radius: 4px;
}

.tip-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #1677ff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.faq-item {
  margin: 16px 0;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  padding: 16px;
  background: #fafafa;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question:hover {
  background: #f0f0f0;
}

.faq-answer {
  padding: 16px;
  display: none;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.faq-item.open .faq-answer {
  display: block;
}

.faq-icon {
  transition: transform 0.3s;
}

.faq-item.open .faq-icon {
  transform: rotate(180deg);
}

p {
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

.code-block {
  background: #f6f8fa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 12px;
  margin: 12px 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #333;
  overflow-x: auto;
}

.table-container {
  overflow-x: auto;
  margin: 16px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  border: 1px solid #e8e8e8;
  padding: 12px;
  text-align: left;
}

th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

td {
  color: #666;
}
</style>

