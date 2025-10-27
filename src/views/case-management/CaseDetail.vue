<template>
  <div class="case-detail-page">
    <el-card v-loading="isLoading">
      <div class="case-header">
        <div class="case-title">
          <h2>病例详情 #{{ caseData.caseNumber }}</h2>
          <el-tag :type="getStatusTagType(caseData.status)">
            {{ getStatusText(caseData.status) }}
          </el-tag>
        </div>
        <div class="case-actions">
          <el-button type="primary" @click="handleEdit">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button type="success" @click="handleExport">
            <i class="el-icon-download"></i> 导出报告
          </el-button>
          <el-dropdown>
            <el-button type="default">
              <i class="el-icon-more"></i> 更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handlePrint">
                <i class="el-icon-printer"></i> 打印
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleAudit">
                <i class="el-icon-check"></i> 审核病例
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete" style="color: #ff4d4f">
                <i class="el-icon-delete"></i> 删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-divider></el-divider>

      <el-tabs v-model="activeTab" type="border-card" class="case-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <div class="tab-content">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="患者姓名">{{ caseData.patientName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ caseData.gender || '-' }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ caseData.age || '-' }}</el-descriptions-item>
              <el-descriptions-item label="就诊日期">{{ caseData.admissionDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="病例编号" :span="2">{{ caseData.caseNumber || '-' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
        <el-tab-pane label="诊断记录" name="diagnosis">
          <div class="tab-content">
            <el-empty v-if="!caseData.diagnosis || caseData.diagnosis.length === 0" description="暂无诊断记录"></el-empty>
            <el-timeline v-else>
              <el-timeline-item 
                v-for="(item, index) in caseData.diagnosis" 
                :key="index"
                :timestamp="item.diagnosisDate"
              >
                <h4>{{ item.diseaseName }}</h4>
                <p>{{ item.description }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
        <el-tab-pane label="治疗方案" name="treatment">
          <div class="tab-content">
            <el-empty v-if="!caseData.treatmentPlan || caseData.treatmentPlan.length === 0" description="暂无治疗方案"></el-empty>
            <div v-else>
              <el-card v-for="(plan, index) in caseData.treatmentPlan" :key="index" style="margin-bottom: 10px;">
                <template #header>
                  <div class="card-header">
                    <span>治疗方案 {{ index + 1 }}</span>
                    <span class="date">{{ plan.startDate }}</span>
                  </div>
                </template>
                <p>{{ plan.description }}</p>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="医学影像" name="images">
          <div class="tab-content">
            <el-empty v-if="!caseData.images || caseData.images.length === 0" description="暂无医学影像"></el-empty>
            <el-image v-else :src="caseData.images[0].url" v-show="false"></el-image>
            <el-button type="primary">查看影像</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="相关文档" name="documents">
          <div class="tab-content">
            <el-empty v-if="!caseData.documents || caseData.documents.length === 0" description="暂无相关文档"></el-empty>
            <el-table v-else :data="caseData.documents" style="width: 100%">
              <el-table-column prop="name" label="文档名称"></el-table-column>
              <el-table-column prop="type" label="文档类型"></el-table-column>
              <el-table-column label="操作">
                <template #default>
                  <el-button type="text">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="病程记录" name="progress">
          <div class="tab-content">
            <el-empty v-if="!caseData.progressRecords || caseData.progressRecords.length === 0" description="暂无病程记录"></el-empty>
            <el-timeline v-else>
              <el-timeline-item 
                v-for="(record, index) in caseData.progressRecords" 
                :key="index"
                :timestamp="record.recordDate"
              >
                <p>{{ record.content }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCaseStore } from '@/stores/caseStore';
import { ElMessage, ElMessageBox } from 'element-plus';

// Router and route
const route = useRoute();
const router = useRouter();
const caseStore = useCaseStore();

// State
const isLoading = ref(true);
const activeTab = ref('basic');
const caseId = ref(route.params.id);

// Get current case from store
const caseData = computed(() => caseStore.currentCase || {});

// Get status tag type based on case status
const getStatusTagType = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'closed': return 'info';
    case 'archived': return 'warning';
    default: return 'default';
  }
};

// Get status display text
const getStatusText = (status) => {
  switch (status) {
    case 'active': return '进行中';
    case 'closed': return '已结案';
    case 'archived': return '已归档';
    default: return status;
  }
};

// Fetch case details
const fetchCaseDetail = async () => {
  isLoading.value = true;
  try {
    await caseStore.getCaseDetail(caseId.value);
  } catch (error) {
    ElMessage.error('获取病例详情失败');
    console.error('Error fetching case detail:', error);
    router.push('/cases'); // Redirect to list if error
  } finally {
    isLoading.value = false;
  }
};

// Handle edit action
const handleEdit = () => {
  router.push(`/cases/${caseId.value}/edit`);
};

// Handle export action
const handleExport = () => {
  ElMessage.info('正在生成病例报告...');
  // In real implementation, call export API
  console.log('Export case report:', caseId.value);
};

// Handle print action
const handlePrint = () => {
  window.print();
};

// Handle audit action
const handleAudit = () => {
  ElMessage.success('病例审核已完成');
  // In real implementation, call audit API
};

// Handle delete action
const handleDelete = () => {
  ElMessageBox.confirm(
    '您确定要删除这个病例吗？此操作不可撤销。',
    '确认删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await caseStore.deleteCase(caseId.value);
      ElMessage.success('病例已成功删除');
      router.push('/cases');
    } catch (error) {
      ElMessage.error('删除病例失败，请重试');
    }
  }).catch(() => {
    // 取消操作，无需处理
  });
};

// Fetch data on mount and when caseId changes
onMounted(() => {
  fetchCaseDetail();
});

watch(() => route.params.id, (newId) => {
  caseId.value = newId;
  fetchCaseDetail();
});
</script>

<style scoped>
.case-detail-page {
  padding: 20px;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.case-title {
  display: flex;
  align-items: center;
}

.case-title h2 {
  margin-right: 15px;
}

.case-actions {
  display: flex;
  gap: 10px;
}

.case-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 12px;
  color: #909399;
}
</style>