<template>
  <div class="data-validator">
    <div class="validation-header">
      <h3>数据验证</h3>
      <el-tag :type="validationStatus === 'passed' ? 'success' : 'warning'">
        {{ validationStatus === 'passed' ? '验证通过' : '验证中' }}
      </el-tag>
    </div>

    <el-divider></el-divider>

    <div class="validation-stats">
      <el-statistic :value="totalRecords" title="总记录数"></el-statistic>
      <el-statistic :value="validRecords" title="有效记录" prefix="✅"></el-statistic>
      <el-statistic :value="invalidRecords" title="无效记录" prefix="❌" :value-style="{ color: '#F56C6C' }"></el-statistic>
      <el-statistic :value="duplicateRecords" title="重复记录" prefix="🔄" :value-style="{ color: '#E6A23C' }"></el-statistic>
    </div>

    <el-divider></el-divider>

    <div class="validation-results">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="错误记录详情" name="errors">
          <el-table 
            v-if="invalidRecords > 0" 
            :data="validationErrors" 
            border
            size="small"
            max-height="400"
          >
            <el-table-column prop="row" label="行号" width="80"></el-table-column>
            <el-table-column prop="field" label="字段" width="120"></el-table-column>
            <el-table-column prop="value" label="值" width="150"></el-table-column>
            <el-table-column prop="error" label="错误原因"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button 
                  type="text" 
                  size="small" 
                  @click="handleFixError(scope.row)"
                >
                  修复
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="no-errors">
            <el-empty description="没有错误记录"></el-empty>
          </div>
        </el-collapse-item>
        
        <el-collapse-item title="验证规则" name="rules">
          <el-table :data="validationRules" border size="small">
            <el-table-column prop="field" label="字段名"></el-table-column>
            <el-table-column prop="rule" label="验证规则"></el-table-column>
            <el-table-column prop="example" label="示例值"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="validation-actions">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button 
        type="primary" 
        @click="$emit('next', { 
          validationResults: {
            total: totalRecords,
            valid: validRecords,
            invalid: invalidRecords,
            errors: validationErrors
          }
        })"
        :disabled="invalidRecords > 0"
      >
        继续导入
      </el-button>
      <el-button 
        type="success" 
        @click="handleAutoFix"
        v-if="invalidRecords > 0"
      >
        自动修复错误
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { validateHisData } from '@/utils/his-import';

// Props and Emits
const props = defineProps({
  importData: {
    type: Object,
    required: true
  }
});

// State
const validationStatus = ref('processing'); // processing/passed/failed
const totalRecords = ref(0);
const validRecords = ref(0);
const invalidRecords = ref(0);
const duplicateRecords = ref(0);
const validationErrors = ref([]);
const activeNames = ref(['errors']);

// Validation rules
const validationRules = [
  { field: 'patientId', rule: '必填，数字或字母组合', example: 'PAT-2023-001' },
  { field: 'patientName', rule: '必填，长度1-50', example: '张三' },
  { field: 'gender', rule: '必填，只能是male/female/other', example: 'male' },
  { field: 'age', rule: '必填，0-150之间的数字', example: '45' },
  { field: 'admissionDate', rule: '必填，YYYY-MM-DD格式', example: '2023-10-20' },
  { field: 'diseaseCode', rule: '必填，ICD-10编码格式', example: 'M89.50' },
  { field: 'diseaseName', rule: '必填，长度1-100', example: '骨质疏松症' }
];

// Process validation
const processValidation = async () => {
  try {
    // Simulate validation process
    validationStatus.value = 'processing';
    
    // In real implementation, read file content and validate
    // For demo, we'll use mock data
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      patientId: `PAT-${i}`,
      patientName: `患者${i}`,
      gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
      age: Math.floor(Math.random() * 100),
      admissionDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      diseaseCode: i % 5 === 0 ? `M89.${i}` : `Z12.${i}`,
      diseaseName: i % 5 === 0 ? '骨质疏松症' : '常规体检'
    }));
    
    // Add some invalid records for demo
    mockData[10].patientId = ''; // Missing patientId
    mockData[25].age = 200; // Invalid age
    mockData[42].gender = 'invalid'; // Invalid gender
    mockData[67].admissionDate = '2023/13/01'; // Invalid date format
    mockData[88].diseaseCode = 'INVALID'; // Invalid disease code
    
    // Add duplicates
    mockData[95] = { ...mockData[90] }; // Duplicate of record 90
    mockData[96] = { ...mockData[90] }; // Duplicate of record 90
    
    totalRecords.value = mockData.length;
    
    // Validate data
    const { valid, errors } = validateHisData(mockData);
    
    // Update stats
    validRecords.value = totalRecords.value - errors.length;
    invalidRecords.value = errors.length;
    duplicateRecords.value = 2; // Hardcoded for demo
    validationErrors.value = errors;
    
    validationStatus.value = valid ? 'passed' : 'failed';
    
  } catch (error) {
    console.error('Validation error:', error);
    ElMessage.error('数据验证失败');
    validationStatus.value = 'failed';
  }
};

// Handle error fixing
const handleFixError = (error) => {
  ElMessage.info(`修复错误: ${error.field} - ${error.error}`);
  // In real implementation, show edit dialog to fix error
};

// Handle auto fix
const handleAutoFix = () => {
  ElMessage.success('自动修复完成，已修复部分错误');
  // In real implementation, attempt to automatically fix errors
  invalidRecords.value = Math.max(0, invalidRecords.value - 2); // Demo only
};

// Start validation on mount
onMounted(() => {
  processValidation();
});
</script>

<style scoped>
.data-validator {
  padding: 10px;
}

.validation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.validation-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.validation-results {
  margin-top: 20px;
}

.validation-actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.no-errors {
  text-align: center;
  padding: 40px 0;
}
</style>