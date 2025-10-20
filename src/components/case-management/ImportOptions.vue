<template>
  <div class="import-options">
    <el-card>
      <h3 class="card-title">选择导入方式</h3>
      
      <el-radio-group v-model="importMethod" class="import-method-group">
        <el-radio label="file" class="import-method-item">
          <div class="method-icon">
            <el-icon><document /></el-icon>
          </div>
          <div class="method-content">
            <h4>文件导入</h4>
            <p>通过上传Excel、CSV或JSON文件导入病例数据</p>
          </div>
        </el-radio>
        
        <el-radio label="api" class="import-method-item">
          <div class="method-icon">
            <el-icon><connection /></el-icon>
          </div>
          <div class="method-content">
            <h4>API导入</h4>
            <p>通过HIS系统API接口直接同步病例数据</p>
          </div>
        </el-radio>
        
        <el-radio label="manual" class="import-method-item">
          <div class="method-icon">
            <el-icon><edit /></el-icon>
          </div>
          <div class="method-content">
            <h4>手动录入</h4>
            <p>通过表单手动录入病例数据</p>
          </div>
        </el-radio>
      </el-radio-group>
      
      <el-divider v-if="importMethod === 'file'"></el-divider>
      
      <!-- 文件导入选项 -->
      <div v-if="importMethod === 'file'" class="file-import-options">
        <el-form 
          :model="fileImportForm" 
          ref="fileImportFormRef"
          label-width="120px"
        >
          <el-form-item label="文件格式" prop="fileType">
            <el-select v-model="fileImportForm.fileType" placeholder="请选择文件格式">
              <el-option label="Excel (.xlsx)" value="xlsx"></el-option>
              <el-option label="CSV (.csv)" value="csv"></el-option>
              <el-option label="JSON (.json)" value="json"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="模板下载">
            <el-button 
              type="text" 
              icon="el-icon-download"
              @click="downloadTemplate"
            >
              下载导入模板
            </el-button>
            <div class="template-tip">
              下载并按照模板格式填写数据，可提高导入成功率
            </div>
          </el-form-item>
          
          <el-form-item label="导入模式" prop="importMode">
            <el-radio-group v-model="fileImportForm.importMode">
              <el-radio label="insert">仅新增</el-radio>
              <el-radio label="update">仅更新</el-radio>
              <el-radio label="insertOrUpdate">新增或更新</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="重复判断依据" prop="duplicateKey" v-if="fileImportForm.importMode !== 'insert'">
            <el-select v-model="fileImportForm.duplicateKey" placeholder="请选择重复判断依据">
              <el-option label="病例编号" value="caseNumber"></el-option>
              <el-option label="患者ID+就诊日期" value="patientIdAdmissionDate"></el-option>
              <el-option label="自定义唯一键" value="custom"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="冲突处理方式" prop="conflictResolution" v-if="fileImportForm.importMode === 'update' || fileImportForm.importMode === 'insertOrUpdate'">
            <el-select v-model="fileImportForm.conflictResolution" placeholder="请选择冲突处理方式">
              <el-option label="覆盖现有数据" value="overwrite"></el-option>
              <el-option label="保留现有数据" value="keep"></el-option>
              <el-option label="合并数据（取最新值）" value="merge"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- API导入选项 -->
      <div v-if="importMethod === 'api'" class="api-import-options">
        <el-form 
          :model="apiImportForm" 
          ref="apiImportFormRef"
          label-width="120px"
        >
          <el-form-item label="HIS系统类型" prop="systemType">
            <el-select v-model="apiImportForm.systemType" placeholder="请选择HIS系统类型">
              <el-option label="用友HIS" value="yonyou"></el-option>
              <el-option label="金蝶HIS" value="kingdee"></el-option>
              <el-option label="卫宁HIS" value="winning"></el-option>
              <el-option label="东软HIS" value="neusoft"></el-option>
              <el-option label="其他HIS系统" value="other"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="API地址" prop="apiUrl">
            <el-input v-model="apiImportForm.apiUrl" placeholder="请输入HIS系统API地址"></el-input>
          </el-form-item>
          
          <el-form-item label="API密钥" prop="apiKey">
            <el-input v-model="apiImportForm.apiKey" type="password" placeholder="请输入API密钥"></el-input>
          </el-form-item>
          
          <el-form-item label="数据范围" prop="dataRange">
            <el-radio-group v-model="apiImportForm.dataRange">
              <el-radio label="all">全部数据</el-radio>
              <el-radio label="dateRange">指定日期范围</el-radio>
              <el-radio label="lastSync">上次同步之后</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="日期范围" prop="dateRange" v-if="apiImportForm.dataRange === 'dateRange'">
            <el-date-picker
              v-model="apiImportForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              icon="el-icon-refresh-right"
              @click="testApiConnection"
              :loading="testingConnection"
            >
              测试连接
            </el-button>
            <div v-if="connectionStatus" class="connection-status">
              <el-tag :type="connectionStatus === 'success' ? 'success' : 'danger'">
                {{ connectionStatus === 'success' ? '连接成功' : '连接失败' }}
              </el-tag>
            </div>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="action-buttons">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmOptions"
          :loading="confirmLoading"
        >
          下一步
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Document, Connection, Edit } from '@element-plus/icons-vue';

// 定义Props
const props = defineProps({
  initialMethod: {
    type: String,
    default: 'file' // file/api/manual
  }
});

// 定义Emits
const emit = defineEmits(['confirm', 'cancel']);

// 导入方式
const importMethod = ref(props.initialMethod);

// 文件导入表单数据
const fileImportForm = reactive({
  fileType: 'xlsx',
  importMode: 'insertOrUpdate',
  duplicateKey: 'caseNumber',
  conflictResolution: 'merge'
});

// API导入表单数据
const apiImportForm = reactive({
  systemType: '',
  apiUrl: '',
  apiKey: '',
  dataRange: 'all',
  dateRange: []
});

// 状态管理
const testingConnection = ref(false);
const connectionStatus = ref(''); // success/error
const confirmLoading = ref(false);

// 表单引用
const fileImportFormRef = ref(null);
const apiImportFormRef = ref(null);

// 下载模板
const downloadTemplate = () => {
  // 根据选择的文件类型下载对应的模板
  const templateType = fileImportForm.fileType;
  const templateUrls = {
    xlsx: '/templates/case-import-template.xlsx',
    csv: '/templates/case-import-template.csv',
    json: '/templates/case-import-template.json'
  };
  
  ElMessage.info(`正在下载${templateType.toUpperCase()}模板...`);
  
  // 创建下载链接并触发下载
  const link = document.createElement('a');
  link.href = templateUrls[templateType];
  link.download = `病例导入模板.${templateType}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 测试API连接
const testApiConnection = async () => {
  if (!apiImportForm.apiUrl || !apiImportForm.apiKey) {
    ElMessage.error('请填写API地址和API密钥');
    return;
  }
  
  testingConnection = true;
  connectionStatus = '';
  
  try {
    // 模拟API连接测试
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟随机成功/失败
    if (Math.random() > 0.2) {
      connectionStatus = 'success';
      ElMessage.success('API连接成功');
    } else {
      connectionStatus = 'error';
      ElMessage.error('API连接失败，请检查API地址和密钥是否正确');
    }
  } catch (error) {
    connectionStatus = 'error';
    ElMessage.error('API连接测试失败');
    console.error('API connection test error:', error);
  } finally {
    testingConnection = false;
  }
};

// 确认选项
const confirmOptions = async () => {
  confirmLoading = true;
  
  try {
    // 根据导入方式验证表单
    if (importMethod === 'file') {
      // 验证文件导入表单
      if (!fileImportFormRef.value) {
        throw new Error('文件导入表单未初始化');
      }
      
      await fileImportFormRef.value.validate();
      
      // 准备文件导入参数
      const importParams = {
        method: 'file',
        options: {
          fileType: fileImportForm.fileType,
          importMode: fileImportForm.importMode,
          duplicateKey: fileImportForm.duplicateKey,
          conflictResolution: fileImportForm.conflictResolution
        }
      };
      
      emit('confirm', importParams);
    } else if (importMethod === 'api') {
      // 验证API导入表单
      if (!apiImportFormRef.value) {
        throw new Error('API导入表单未初始化');
      }
      
      await apiImportFormRef.value.validate();
      
      // 检查连接状态
      if (!connectionStatus) {
        const confirmResult = await ElMessageBox.confirm(
          '尚未测试API连接，是否继续？',
          '提示',
          {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        if (confirmResult !== 'confirm') {
          confirmLoading = false;
          return;
        }
      }
      
      // 准备API导入参数
      const importParams = {
        method: 'api',
        options: {
          systemType: apiImportForm.systemType,
          apiUrl: apiImportForm.apiUrl,
          apiKey: apiImportForm.apiKey,
          dataRange: apiImportForm.dataRange,
          startDate: apiImportForm.dataRange === 'dateRange' && apiImportForm.dateRange.length > 0 ? apiImportForm.dateRange[0] : '',
          endDate: apiImportForm.dataRange === 'dateRange' && apiImportForm.dateRange.length > 0 ? apiImportForm.dateRange[1] : ''
        }
      };
      
      emit('confirm', importParams);
    } else if (importMethod === 'manual') {
      // 手动录入不需要额外选项
      emit('confirm', {
        method: 'manual',
        options: {}
      });
    }
  } catch (error) {
    console.error('表单验证失败:', error);
    ElMessage.error('请完善导入选项');
  } finally {
    confirmLoading = false;
  }
};
</script>

<style scoped>
.import-options {
  padding: 20px;
}

.card-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
}

.import-method-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.import-method-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: all 0.3s;
}

.import-method-item:hover {
  border-color: #409eff;
}

.import-method-item.is-checked {
  border-color: #409eff;
  background-color: #f0f7ff;
}

.method-icon {
  font-size: 24px;
  color: #409eff;
  margin-right: 15px;
  width: 40px;
  text-align: center;
}

.method-content h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.method-content p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.file-import-options, .api-import-options {
  padding: 10px 0;
}

.template-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.action-buttons {
  margin-top: 30px;
  text-align: right;
}
</style>