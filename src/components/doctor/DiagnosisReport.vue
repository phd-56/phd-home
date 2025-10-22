<template>
  <div class="diagnosis-report">
    <el-row :gutter="20">
      <!-- 原始图像 -->
      <el-col :span="12">
        <el-card class="image-card">
          <template #header>
            <span>原始影像</span>
          </template>
          <div class="image-container">
            <img 
              v-if="originalImage" 
              :src="originalImage" 
              alt="原始影像"
              class="medical-image"
            />
            <div v-else class="no-image">
              <el-empty description="暂无影像" />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- AI分析结果 -->
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <span>AI分析结果</span>
            <el-tag type="success">分析完成</el-tag>
          </template>

          <!-- 总体置信度 -->
          <div v-if="hasResult" class="overall-confidence">
            <el-alert
              :title="`总体诊断置信度: ${overallConfidence}%`"
              :type="confidenceType"
              show-icon
              :closable="false"
            />
          </div>

          <!-- 影像学发现 -->
          <div v-if="hasFindings" class="findings-section">
            <h4>影像学发现 ({{ findings.length }})</h4>
            <el-collapse>
              <el-collapse-item
                v-for="(finding, index) in findings"
                :key="finding.id"
                :name="index"
              >
                <template #title>
                  <div class="finding-header">
                    <el-tag :type="getSeverityType(finding.severity)">
                      {{ getFindingCategory(finding.category) }}
                    </el-tag>
                    <span class="confidence">置信度: {{ finding.confidence }}%</span>
                  </div>
                  <div class="finding-preview">
                    {{ getFindingPreview(finding.description) }}
                  </div>
                </template>
                <div class="finding-details">
                  <p><strong>描述:</strong> {{ finding.description }}</p>
                  <p><strong>位置:</strong> {{ finding.location }}</p>
                  <p><strong>临床意义:</strong> {{ finding.clinicalSignificance }}</p>
                  <p><strong>严重程度:</strong> 
                    <el-tag :type="getSeverityType(finding.severity)" size="small">
                      {{ getSeverityText(finding.severity) }}
                    </el-tag>
                  </p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- 处理建议 -->
          <el-card 
            v-if="hasSuggestions" 
            class="recommendations-card"
          >
            <template #header>
              <span>处理建议</span>
            </template>
            <ul class="recommendations-list">
              <li v-for="(suggestion, index) in suggestions" 
                  :key="index"
                  class="recommendation-item">
                <i class="el-icon-info" style="color: #409EFF; margin-right: 8px;"></i>
                {{ suggestion }}
              </li>
            </ul>
          </el-card>

          <!-- 空状态 -->
          <div v-if="!hasResult" class="no-data">
            <el-empty description="暂无诊断数据，请先进行AI分析" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作按钮 -->
    <div v-if="hasResult" class="report-actions">
      <el-button type="primary" @click="handleNewDiagnosis">
        新建诊断
      </el-button>
      <el-button @click="exportReport">
        导出报告
      </el-button>
      <el-button @click="requestConsultation">
        申请会诊
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useAIDiagnosisStore } from '@/stores/aiDiagnosisStore';
import { adaptDiagnosisResult } from '@/utils/diagnosisAdapter';
import type { UnifiedDiagnosisResult } from '@/types/diagnosis';

// Store
const diagnosisStore = useAIDiagnosisStore();

// 统一的结果数据
const unifiedResult = computed((): UnifiedDiagnosisResult | null => {
  return adaptDiagnosisResult(diagnosisStore.currentResult);
});

// 计算属性 - 使用统一的数据结构
const hasResult = computed(() => unifiedResult.value !== null);
const originalImage = computed(() => diagnosisStore.originalImage);
const findings = computed(() => unifiedResult.value?.findings || []);
const hasFindings = computed(() => findings.value.length > 0);
const suggestions = computed(() => unifiedResult.value?.suggestions || []);
const hasSuggestions = computed(() => suggestions.value.length > 0);
const overallConfidence = computed(() => unifiedResult.value?.overallConfidence || 0);

const confidenceType = computed(() => {
  const confidence = overallConfidence.value;
  if (confidence >= 80) return 'success';
  if (confidence >= 60) return 'warning';
  return 'error';
});

// 方法
const getSeverityType = (severity: string) => {
  const typeMap = {
    normal: 'success',
    mild: 'info',
    moderate: 'warning',
    severe: 'danger'
  };
  return typeMap[severity as keyof typeof typeMap] || 'info';
};

const getSeverityText = (severity: string) => {
  const textMap = {
    normal: '正常',
    mild: '轻度',
    moderate: '中度',
    severe: '重度'
  };
  return textMap[severity as keyof typeof textMap] || severity;
};

const getFindingCategory = (category: string) => {
  const categoryMap = {
    bone: '骨骼',
    joint: '关节',
    soft_tissue: '软组织',
    other: '其他'
  };
  return categoryMap[category as keyof typeof categoryMap] || '发现';
};

const getFindingPreview = (description: string) => {
  if (!description) return '';
  return description.length > 50 ? description.substring(0, 50) + '...' : description;
};

const handleNewDiagnosis = () => {
  diagnosisStore.clearResult();
};

const exportReport = () => {
  console.log('导出报告', unifiedResult.value);
  ElMessage.success('报告导出功能开发中');
};

const requestConsultation = () => {
  console.log('申请会诊', unifiedResult.value);
  ElMessage.success('会诊申请已提交');
};
</script>

<style scoped>
/* 样式保持不变 */
.diagnosis-report {
  padding: 10px;
}

.image-card, .analysis-card {
  height: 100%;
}

.image-container {
  text-align: center;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medical-image {
  max-width: 100%;
  max-height: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.no-image {
  width: 100%;
}

.overall-confidence {
  margin-bottom: 20px;
}

.findings-section {
  margin: 20px 0;
}

.finding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.confidence {
  color: #666;
  font-size: 12px;
  font-weight: bold;
}

.finding-preview {
  color: #999;
  font-size: 12px;
  text-align: left;
}

.finding-details {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
}

.finding-details p {
  margin: 8px 0;
  line-height: 1.5;
}

.recommendations-card {
  margin-top: 15px;
}

.recommendations-list {
  margin: 0;
  padding-left: 0;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 4px;
  border-left: 3px solid #409EFF;
}

.recommendation-item:last-child {
  margin-bottom: 0;
}

.report-actions {
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.no-data {
  text-align: center;
  padding: 40px 0;
}
</style>