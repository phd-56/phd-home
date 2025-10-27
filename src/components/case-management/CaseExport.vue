<template>
  <div class="case-export">
    <el-dropdown 
      trigger="click" 
      @command="handleExportCommand"
      placement="bottom"
    >
      <el-button 
        type="primary" 
        size="small" 
        :loading="exportLoading"
        icon="el-icon-download"
      >
        导出病例
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="selected">
          <i class="el-icon-check"></i> 导出选中项
          <span v-if="selectedCount > 0" class="selected-count">({{ selectedCount }})</span>
        </el-dropdown-item>
        <el-dropdown-item command="currentPage">
          <i class="el-icon-document"></i> 导出当前页
        </el-dropdown-item>
        <el-dropdown-item command="all">
          <i class="el-icon-files"></i> 导出全部数据
        </el-dropdown-item>
        <el-dropdown-item command="custom">
          <i class="el-icon-setting"></i> 自定义导出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 自定义导出对话框 -->
    <el-dialog 
      title="自定义导出" 
      :visible.sync="customExportVisible" 
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="exportForm" 
        ref="exportFormRef" 
        label-width="120px"
      >
        <el-form-item label="导出范围" prop="exportRange">
          <el-radio-group v-model="exportForm.exportRange">
            <el-radio label="selected">导出选中项</el-radio>
            <el-radio label="currentPage">导出当前页</el-radio>
            <el-radio label="all">导出全部数据</el-radio>
            <el-radio label="customRange">自定义范围</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item 
          v-if="exportForm.exportRange === 'customRange'" 
          label="记录范围"
        >
          <el-input 
            v-model="exportForm.customRange.start" 
            placeholder="开始记录" 
            size="small"
            style="width: 100px; display: inline-block"
          />
          <span style="margin: 0 10px">-</span>
          <el-input 
            v-model="exportForm.customRange.end" 
            placeholder="结束记录" 
            size="small"
            style="width: 100px; display: inline-block"
          />
        </el-form-item>

        <el-form-item label="导出格式" prop="exportFormat">
          <el-radio-group v-model="exportForm.exportFormat">
            <el-radio label="excel">Excel (.xlsx)</el-radio>
            <el-radio label="pdf">PDF 文档 (.pdf)</el-radio>
            <el-radio label="csv">CSV 文件 (.csv)</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="导出字段" prop="exportFields">
          <el-checkbox-group v-model="exportForm.exportFields">
            <el-checkbox 
              v-for="field in availableFields" 
              :key="field.value" 
              :label="field.value"
              :disabled="field.required"
            >
              {{ field.label }}
              <span v-if="field.required" class="required-mark">*</span>
            </el-checkbox>
          </el-checkbox-group>
          <div class="field-tip">
            <span class="required-mark">*</span> 为必填字段
          </div>
        </el-form-item>

        <el-form-item label="导出选项">
          <el-checkbox v-model="exportForm.includeDiagnosis">包含诊断信息</el-checkbox>
          <el-checkbox v-model="exportForm.includeTreatment">包含治疗信息</el-checkbox>
          <el-checkbox v-model="exportForm.includeDocuments">包含文档列表</el-checkbox>
        </el-form-item>

        <el-form-item label="文件名称" prop="fileName">
          <el-input 
            v-model="exportForm.fileName" 
            placeholder="请输入导出文件名称"
          />
          <div class="filename-tip">
            如不填写，系统将自动生成文件名
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="customExportVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmCustomExport"
          :loading="exportLoading"
        >
          确认导出
        </el-button>
      </div>
    </el-dialog>

    <!-- 导出进度对话框 -->
    <el-dialog 
      title="导出进度" 
      :visible.sync="exportProgressVisible" 
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="export-progress-content">
        <div class="progress-icon">
          <el-icon :size="48" class="loading-icon">
            <loading />
          </el-icon>
        </div>
        <div class="progress-text">
          <p>{{ exportProgressText }}</p>
          <p class="sub-text">{{ exportSubText }}</p>
        </div>
        <el-progress 
          :percentage="exportProgress" 
          :status="exportProgressStatus"
          class="progress-bar"
        ></el-progress>
        <div class="progress-stats" v-if="exportStats.total > 0">
          <span>已处理: {{ exportStats.processed }}/{{ exportStats.total }}</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-if="exportProgressStatus === 'success' || exportProgressStatus === 'error'">
        <el-button 
          v-if="exportProgressStatus === 'error'" 
          type="primary" 
          @click="retryExport"
        >
          重试
        </el-button>
        <el-button 
          v-if="exportProgressStatus === 'success'" 
          type="primary" 
          @click="downloadExportFile"
        >
          下载文件
        </el-button>
        <el-button 
          v-if="exportProgressStatus === 'success' || exportProgressStatus === 'error'" 
          @click="closeExportProgress"
        >
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, computed, onMounted } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';

// 定义Props
const props = defineProps({
  selectedIds: {
    type: Array,
    default: () => []
  },
  currentPageParams: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10,
      filters: {}
    })
  },
  totalCount: {
    type: Number,
    default: 0
  }
});

// 定义Emits
const emit = defineEmits(['export-start', 'export-complete', 'export-error']);

// 状态管理
const customExportVisible = ref(false);
const exportProgressVisible = ref(false);
const exportLoading = ref(false);
const exportProgress = ref(0);
const exportProgressStatus = ref('progress'); // progress/success/error
const exportProgressText = ref('正在准备导出数据...');
const exportSubText = ref('请稍候，这可能需要几分钟时间');
const exportStats = ref({
  total: 0,
  processed: 0
});
const exportFileUrl = ref('');

// 选中数量计算
const selectedCount = computed(() => {
  return props.selectedIds.length;
});

// 可用导出字段
const availableFields = ref([
  { label: '病例编号', value: 'caseNumber', required: true },
  { label: '患者姓名', value: 'patientName', required: true },
  { label: '患者ID', value: 'patientId', required: true },
  { label: '就诊日期', value: 'admissionDate', required: true },
  { label: '主治医生', value: 'doctorName', required: true },
  { label: '病例状态', value: 'status', required: true },
  { label: '患者性别', value: 'gender', required: false },
  { label: '患者年龄', value: 'age', required: false },
  { label: '创建时间', value: 'createdAt', required: false },
  { label: '最后更新时间', value: 'updatedAt', required: false },
  { label: '病例描述', value: 'description', required: false }
]);

// 导出表单数据
const exportForm = reactive({
  exportRange: 'currentPage',
  customRange: {
    start: 1,
    end: 10
  },
  exportFormat: 'excel',
  exportFields: [],
  includeDiagnosis: true,
  includeTreatment: true,
  includeDocuments: false,
  fileName: ''
});

// 导出表单引用
const exportFormRef = ref(null);

// 初始化
onMounted(() => {
  // 默认选中所有导出字段
  exportForm.exportFields = availableFields.value.map(field => field.value);
});

// 处理导出命令
const handleExportCommand = (command) => {
  if (command === 'selected' && selectedCount.value === 0) {
    ElMessage.warning('请先选择要导出的病例');
    return;
  }
  
  if (command === 'custom') {
    // 打开自定义导出对话框
    // 初始化导出范围
    exportForm.exportRange = 'currentPage';
    
    // 生成默认文件名
    generateDefaultFileName();
    
    customExportVisible = true;
  } else {
    // 非自定义导出，使用默认配置
    const exportConfig = {
      exportRange: command,
      exportFormat: 'excel',
      exportFields: availableFields.value.map(field => field.value),
      includeDiagnosis: true,
      includeTreatment: true,
      includeDocuments: false,
      fileName: generateDefaultFileName()
    };
    
    startExport(exportConfig);
  }
};

// 确认自定义导出
const confirmCustomExport = async () => {
  // 简单验证
  if (!exportForm.fileName) {
    exportForm.fileName = generateDefaultFileName();
  }
  
  // 检查必填字段
  const requiredFields = availableFields.value
    .filter(field => field.required)
    .map(field => field.value);
    
  const hasAllRequired = requiredFields.every(field => 
    exportForm.exportFields.includes(field)
  );
  
  if (!hasAllRequired) {
    ElMessage.error('请选择所有必填字段');
    return;
  }
  
  // 关闭自定义导出对话框，打开进度对话框
  customExportVisible = false;
  exportProgressVisible = true;
  
  // 开始导出
  startExport({ ...exportForm });
};

// 开始导出
const startExport = (exportConfig) => {
  exportLoading = true;
  exportProgress = 0;
  exportProgressStatus = 'progress';
  exportProgressText = '正在导出数据...';
  exportSubText = '请稍候，这可能需要几分钟时间';
  exportStats.total = 0;
  exportStats.processed = 0;
  
  // 准备导出参数
  const exportParams = {
    ...exportConfig,
    // 根据导出范围添加相应参数
    ...getRangeParams(exportConfig.exportRange)
  };
  
  // 触发导出事件
  emit('export-start', exportParams);
  
  // 模拟导出进度
  simulateExportProgress();
};

// 获取范围参数
const getRangeParams = (range) => {
  const params = {};
  
  switch (range) {
    case 'selected':
      params.selectedIds = props.selectedIds;
      break;
    case 'currentPage':
      params.page = props.currentPageParams.page;
      params.pageSize = props.currentPageParams.pageSize;
      params.filters = props.currentPageParams.filters;
      break;
    case 'all':
      params.filters = props.currentPageParams.filters;
      break;
    case 'customRange':
      params.start = exportForm.customRange.start;
      params.end = exportForm.customRange.end;
      params.filters = props.currentPageParams.filters;
      break;
  }
  
  return params;
};

// 生成默认文件名
const generateDefaultFileName = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  return `病例数据导出_${dateStr}`;
};

// 模拟导出进度 (实际项目中应替换为真实的导出API调用)
const simulateExportProgress = () => {
  // 模拟总记录数
  const totalRecords = getTotalRecordsForExport();
  exportStats.total = totalRecords;
  
  // 模拟进度更新
  const interval = setInterval(() => {
    exportStats.processed += Math.floor(Math.random() * 5) + 1;
    
    if (exportStats.processed >= exportStats.total) {
      exportStats.processed = exportStats.total;
      exportProgress = 100;
      exportProgressStatus = 'success';
      exportProgressText = '导出完成';
      exportSubText = '文件已准备好，点击下载按钮获取文件';
      exportFileUrl = 'https://example.com/export/download?token=xxx'; // 实际项目中替换为真实下载URL
      clearInterval(interval);
      exportLoading = false;
      
      // 触发导出完成事件
      emit('export-complete', {
        fileName: exportForm.fileName || generateDefaultFileName(),
        fileUrl: exportFileUrl
      });
    } else {
      exportProgress = Math.floor((exportStats.processed / exportStats.total) * 100);
      
      // 随机更新状态文本
      const statusTexts = [
        '正在收集病例数据...',
        '正在处理病例信息...',
        '正在生成导出文件...',
        '正在压缩文件...'
      ];
      
      if (Math.random() > 0.7) {
        exportProgressText = statusTexts[Math.floor(Math.random() * statusTexts.length)];
      }
    }
  }, 500);
};

// 获取导出总记录数
const getTotalRecordsForExport = () => {
  switch (exportForm.exportRange) {
    case 'selected':
      return selectedCount.value;
    case 'currentPage':
      return props.currentPageParams.pageSize;
    case 'all':
      return props.totalCount;
    case 'customRange':
      return Math.max(0, exportForm.customRange.end - exportForm.customRange.start + 1);
    default:
      return props.currentPageParams.pageSize;
  }
};

// 获取范围参数
const getRangeParams = (range) => {
  const params = {};
  
  switch (range) {
    case 'selected':
      params.selectedIds = props.selectedIds;
      break;
    case 'currentPage':
      params.page = props.currentPageParams.page;
      params.pageSize = props.currentPageParams.pageSize;
      params.filters = props.currentPageParams.filters;
      break;
    case 'all':
      params.filters = props.currentPageParams.filters;
      break;
    case 'customRange':
      params.start = exportForm.customRange.start;
      params.end = exportForm.customRange.end;
      params.filters = props.currentPageParams.filters;
      break;
  }
  
  return params;
};

// 重试导出
const retryExport = () => {
  exportProgressVisible = false;
  customExportVisible = true;
};

// 下载导出文件
const downloadExportFile = () => {
  // 创建下载链接并触发下载
  if (exportFileUrl) {
    window.open(exportFileUrl, '_blank');
    
    // 关闭进度对话框
    exportProgressVisible = false;
    
    // 显示下载通知
    ElNotification({
      title: '下载开始',
      message: '导出文件下载已开始',
      type: 'success',
      duration: 3000
    });
  }
};

// 关闭导出进度对话框
const closeExportProgress = () => {
  exportProgressVisible = false;
  exportLoading = false;
};
</script>

<style scoped>
.case-export {
  display: inline-block;
}

.selected-count {
  color: #f56c6c;
  margin-left: 5px;
}

.custom-export-dialog .el-form-item {
  margin-bottom: 15px;
}

.field-tip, .filename-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.required-mark {
  color: #f56c6c;
}

.export-progress-content {
  text-align: center;
  padding: 20px 0;
}

.progress-icon {
  margin-bottom: 20px;
}

.loading-icon {
  color: #409eff;
  animation: rotate 2s linear infinite;
}

.progress-text {
  margin-bottom: 20px;
}

.progress-text p {
  margin: 0;
}

.sub-text {
  color: #606266;
  font-size: 14px;
  margin-top: 5px;
}

.progress-bar {
  margin-bottom: 15px;
}

.progress-stats {
  color: #606266;
  font-size: 14px;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>