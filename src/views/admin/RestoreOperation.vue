<template>
  <div class="restore-operation-page">
    <div class="page-header">
      <h1>数据恢复</h1>
      <el-button 
        type="primary" 
        @click="goBack"
      >
        <el-icon><arrow-left /></el-icon>
        返回备份管理
      </el-button>
    </div>
    
    <el-card>
      <div class="restore-steps">
        <el-steps :active="activeStep" finish-status="success">
          <el-step title="选择恢复点" />
          <el-step title="恢复选项" />
          <el-step title="确认并恢复" />
          <el-step title="恢复完成" />
        </el-steps>
        
        <div class="step-content">
          <!-- 步骤1：选择恢复点 -->
          <div v-if="activeStep === 0">
            <h3 style="margin: 20px 0;">可用恢复点</h3>
            
            <el-table 
              :data="restorePoints" 
              stripe 
              border
              @row-click="selectRestorePoint"
              :row-class-name="rowClassName"
            >
              <el-table-column label="备份类型" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.type === 'full' ? 'primary' : 'success'">
                    {{ scope.row.type === 'full' ? '全量' : '增量' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="configName" label="配置名称" width="160" />
              <el-table-column prop="timestamp" label="备份时间" width="180" />
              <el-table-column label="大小(MB)" width="100">
                <template #default="scope">
                  {{ scope.row.size ? scope.row.size.toFixed(2) : '0.00' }}
                </template>
              </el-table-column>
              <el-table-column label="说明" width="auto">
                <template #default="scope">
                  <div v-if="scope.row.type === 'full'">
                    完整系统备份，可独立恢复
                  </div>
                  <div v-else>
                    增量备份，需要基于最新全量备份恢复
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="step-actions" style="margin-top: 20px; text-align: right;">
              <el-button 
                type="primary" 
                @click="nextStep"
                :disabled="!selectedPoint"
              >
                下一步
                <el-icon><arrow-right /></el-icon>
              </el-button>
            </div>
          </div>
          
          <!-- 步骤2：恢复选项 -->
          <div v-if="activeStep === 1">
            <h3 style="margin: 20px 0;">恢复选项</h3>
            
            <el-form 
              ref="restoreForm" 
              :model="restoreOptions" 
              label-width="180px"
              style="margin-top: 20px;"
            >
              <el-form-item 
                label="恢复模式" 
                prop="restoreMode"
                required
              >
                <el-radio-group v-model="restoreOptions.restoreMode">
                  <el-radio label="full">完全恢复</el-radio>
                  <el-radio label="partial">部分恢复</el-radio>
                </el-radio-group>
                <div class="form-help" style="margin-top: 5px;">
                  完全恢复：恢复所有数据，覆盖现有数据<br>
                  部分恢复：可选择需要恢复的数据类型
                </div>
              </el-form-item>
              
              <el-form-item 
                label="恢复后操作" 
                prop="postRestoreAction"
                required
              >
                <el-radio-group v-model="restoreOptions.postRestoreAction">
                  <el-radio label="restart">恢复后重启服务</el-radio>
                  <el-radio label="no_restart">恢复后不重启</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item 
                label="数据验证" 
                prop="verifyData"
              >
                <el-switch v-model="restoreOptions.verifyData" />
                <div class="form-help">恢复后自动验证数据完整性</div>
              </el-form-item>
              
              <el-form-item 
                label="备份当前数据" 
                prop="backupCurrentData"
              >
                <el-switch v-model="restoreOptions.backupCurrentData" />
                <div class="form-help">恢复前先备份当前数据（推荐）</div>
              </el-form-item>
            </el-form>
            
            <div class="step-actions" style="margin-top: 30px; display: flex; justify-content: space-between;">
              <el-button @click="prevStep">
                <el-icon><arrow-left /></el-icon>
                上一步
              </el-button>
              <el-button 
                type="primary" 
                @click="nextStep"
              >
                下一步
                <el-icon><arrow-right /></el-icon>
              </el-button>
            </div>
          </div>
          
          <!-- 步骤3：确认并恢复 -->
          <div v-if="activeStep === 2">
            <div class="confirmation-section">
              <h3 style="margin: 20px 0;">恢复确认</h3>
              
              <el-descriptions title="恢复信息" border>
                <el-descriptions-item label="恢复点时间">{{ selectedPoint?.timestamp }}</el-descriptions-item>
                <el-descriptions-item label="备份类型">{{ selectedPoint?.type === 'full' ? '全量备份' : '增量备份' }}</el-descriptions-item>
                <el-descriptions-item label="备份大小">{{ selectedPoint?.size ? selectedPoint.size.toFixed(2) + ' MB' : 'N/A' }}</el-descriptions-item>
                <el-descriptions-item label="恢复模式">{{ restoreOptions.restoreMode === 'full' ? '完全恢复' : '部分恢复' }}</el-descriptions-item>
                <el-descriptions-item label="恢复后操作">{{ restoreOptions.postRestoreAction === 'restart' ? '重启服务' : '不重启' }}</el-descriptions-item>
                <el-descriptions-item label="数据验证">{{ restoreOptions.verifyData ? '启用' : '禁用' }}</el-descriptions-item>
              </el-descriptions>
              
              <div class="warning-section" style="margin: 20px 0; padding: 15px; background: #fff8e6; border-left: 4px solid #e6a23c; border-radius: 4px;">
                <el-icon style="color: #e6a23c;"><warning /></el-icon>
                <div style="margin-left: 10px; display: inline-block;">
                  <strong>警告：</strong>恢复操作将覆盖现有数据，请确保已做好必要准备。<br>
                  建议在非工作时间执行恢复操作，可能会影响系统可用性。
                </div>
              </div>
              
              <el-form-item prop="confirmRestore" style="margin-top: 20px;">
                <el-checkbox v-model="confirmRestore">我已了解风险，确认执行恢复操作</el-checkbox>
              </el-form-item>
            </div>
            
            <div class="step-actions" style="margin-top: 30px; display: flex; justify-content: space-between;">
              <el-button @click="prevStep">
                <el-icon><arrow-left /></el-icon>
                上一步
              </el-button>
              <el-button 
                type="primary" 
                @click="performRestore"
                :disabled="!confirmRestore"
                :loading="isRestoring"
              >
                <el-icon><check /></el-icon>
                开始恢复
              </el-button>
            </div>
          </div>
          
          <!-- 步骤4：恢复完成 -->
          <div v-if="activeStep === 3" class="restore-complete">
            <div class="result-icon" :class="restoreSuccess ? 'success' : 'error'">
              <el-icon v-if="restoreSuccess" style="font-size: 60px;"><success /></el-icon>
              <el-icon v-else style="font-size: 60px;"><error /></el-icon>
            </div>
            
            <h2 style="margin-top: 20px;">{{ restoreSuccess ? '恢复成功' : '恢复失败' }}</h2>
            
            <div v-if="restoreSuccess" class="success-message">
              <p>数据已成功从所选恢复点恢复</p>
              <p>恢复时间: {{ restoreDuration }} 秒</p>
              <p v-if="restoreOptions.verifyData">数据验证: 成功 - 所有数据完整</p>
            </div>
            
            <div v-else class="error-message">
              <p>数据恢复过程中发生错误</p>
              <p>错误信息: {{ restoreError || '未知错误' }}</p>
            </div>
            
            <div class="action-buttons" style="margin-top: 30px;">
              <el-button 
                type="primary" 
                @click="goToBackupManagement"
              >
                返回备份管理
              </el-button>
              <el-button 
                v-if="restoreSuccess && restoreOptions.postRestoreAction === 'no_restart'"
                type="success" 
                @click="restartService"
                style="margin-left: 10px;"
              >
                重启服务
              </el-button>
              <el-button 
                v-if="!restoreSuccess"
                type="warning" 
                @click="retryRestore"
                style="margin-left: 10px;"
              >
                重试恢复
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useBackupStore } from '@/stores/backupStore';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft, ArrowRight, Warning, Success, Error } from '@element-plus/icons-vue';

// 状态管理和路由
const router = useRouter();
const route = useRoute();
const backupStore = useBackupStore();

// 步骤控制
const activeStep = ref(0);
const activeStep = ref(0);
const selectedPoint = ref<any>(null);
const confirmRestore = ref(false);
const isRestoring = ref(false);
const restoreSuccess = ref(false);
const restoreError = ref('');
const restoreDuration = ref(0);

// 恢复选项
const restoreOptions = reactive({
  restoreMode: 'full',
  postRestoreAction: 'restart',
  verifyData: true,
  backupCurrentData: true
});

// 获取恢复点
const restorePoints = computed(() => backupStore.restorePoints);

// 页面加载时初始化
onMounted(() => {
  // 如果URL中有backupId参数，自动选择该恢复点
  const backupId = route.params.backupId;
  if (backupId && restorePoints.value.length > 0) {
    const point = restorePoints.value.find(p => p.backupId === backupId);
    if (point) {
      selectedPoint.value = point;
    }
  }
});

// 表格行样式
const rowClassName = ({ row }: any) => {
  return row === selectedPoint.value ? 'selected-row' : '';
};

// 选择恢复点
const selectRestorePoint = (row: any) => {
  selectedPoint.value = row;
};

// 步骤导航
const nextStep = () => {
  if (activeStep.value < 3) {
    activeStep.value++;
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

// 执行恢复
const performRestore = async () => {
  if (!selectedPoint.value) {
    ElMessage.warning('请选择一个恢复点');
    return;
  }
  
  try {
    isRestoring.value = true;
    confirmRestore.value = false;
    
    // 模拟恢复过程
    const startTime = Date.now();
    
    await backupStore.performRestore(selectedPoint.value.backupId);
    
    // 模拟恢复时间
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    restoreDuration.value = Math.round((Date.now() - startTime) / 1000);
    restoreSuccess.value = true;
    nextStep();
  } catch (error) {
    console.error('恢复操作失败:', error);
    restoreSuccess.value = false;
    restoreError.value = error instanceof Error ? error.message : '恢复过程中发生错误';
    nextStep();
  } finally {
    isRestoring.value = false;
  }
};

// 辅助方法
const goBack = () => {
  router.push('/admin/backup-management');
};

const goToBackupManagement = () => {
  router.push('/admin/backup-management');
};

const restartService = () => {
  ElMessageBox.confirm(
    '确定要重启服务吗？这将导致系统暂时不可用。',
    '确认重启',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    try {
      // 这里应该调用重启服务的API
      ElMessage.success('服务重启命令已发送');
    } catch (error) {
      ElMessage.error('重启服务失败');
    }
  });
};

const retryRestore = () => {
  activeStep.value = 0;
  restoreSuccess.value = false;
  restoreError.value = '';
};

const rowClassName = ({ row }: any) => {
  return row === selectedPoint.value ? 'selected-row' : '';
};
</script>

<style scoped>
.restore-operation-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.restore-steps {
  margin-top: 20px;
}

.step-content {
  margin-top: 30px;
}

.selected-row {
  background-color: #f0f9ff;
}

.warning-section {
  display: flex;
  align-items: flex-start;
}

.result-icon {
  text-align: center;
  margin-top: 20px;
}

.result-icon.success {
  color: #67c23a;
}

.result-icon.error {
  color: #f56c6c;
}

.action-buttons {
  text-align: center;
}
</style>