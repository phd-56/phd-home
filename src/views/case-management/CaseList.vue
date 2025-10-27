<template>
  <div class="case-list-page">
    <el-card>
      <div class="page-header">
        <h2>病例管理</h2>
        <el-button 
          type="primary" 
          icon="el-icon-plus"
          @click="navigateToCreate"
        >
          创建病例
        </el-button>
      </div>

      <el-divider></el-divider>

      <case-filter 
        :filter-options="filterOptions"
        @filter-change="handleFilterChange"
      />

      <el-divider></el-divider>

      <div class="table-actions">
        <el-input 
          v-model="searchText" 
          placeholder="搜索病例..." 
          prefix-icon="el-icon-search"
          class="search-input"
        />
        <el-button 
          type="text" 
          icon="el-icon-download"
          @click="handleExport"
        >
          导出病例
        </el-button>
      </div>

      <el-table 
        :data="filteredCases" 
        border 
        stripe
        v-loading="isLoading"
        element-loading-text="加载中..."
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="caseNumber" label="病例编号" width="140"></el-table-column>
        <el-table-column prop="patientName" label="患者姓名"></el-table-column>
        <el-table-column prop="admissionDate" label="就诊日期" width="120"></el-table-column>
        <el-table-column prop="diagnosisSummary" label="主要诊断">
          <template slot-scope="scope">
            {{ scope.row.diagnosis && scope.row.diagnosis[0] ? scope.row.diagnosis[0].diseaseName : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag 
              :type="scope.row.status === 'active' ? 'success' : 
                     scope.row.status === 'closed' ? 'info' : 'warning'"
            >
              {{ scope.row.status === 'active' ? '进行中' : 
                 scope.row.status === 'closed' ? '已结案' : '已归档' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button 
              type="text" 
              size="small"
              @click="navigateToDetail(scope.row.id)"
            >
              查看
            </el-button>
            <el-button 
              type="text" 
              size="small"
              @click="navigateToEdit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              style="color: #ff4d4f"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCaseStore } from '@/stores/caseStore';
import CaseFilter from '@/components/case-management/CaseFilter.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// Router and store
const router = useRouter();
const caseStore = useCaseStore();

// State
const isLoading = ref(true);
const searchText = ref('');
const filterOptions = ref({
  status: 'all',
  dateRange: [],
  diagnosisType: ''
});

// Pagination
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// Get cases from store
const cases = computed(() => caseStore.cases);

// Filter cases based on search and filter options
const filteredCases = computed(() => {
  return cases.value.filter(caseItem => {
    // Search text filter
    const matchesSearch = caseItem.patientName.toLowerCase().includes(searchText.value.toLowerCase()) ||
                         caseItem.caseNumber.includes(searchText.value);
    
    // Status filter
    const matchesStatus = filterOptions.value.status === 'all' || 
                         caseItem.status === filterOptions.value.status;
    
    // Date range filter (simplified)
    const matchesDateRange = !filterOptions.value.dateRange.length ||
                            (caseItem.admissionDate >= filterOptions.value.dateRange[0] && 
                             caseItem.admissionDate <= filterOptions.value.dateRange[1]);
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });
});

// Navigate to create case page
const navigateToCreate = () => {
  router.push('/cases/create');
};

// Navigate to case detail page
const navigateToDetail = (caseId) => {
  router.push(`/cases/${caseId}`);
};

// Navigate to case edit page
const navigateToEdit = (caseId) => {
  router.push(`/cases/${caseId}/edit`);
};

// Handle filter change
const handleFilterChange = (newFilters) => {
  filterOptions.value = newFilters;
  pagination.currentPage = 1; // Reset to first page when filters change
  fetchCases();
};

// Handle search
const handleSearch = () => {
  fetchCases();
};

// Handle export
const handleExport = () => {
  // Show export options dialog
  console.log('Export cases with filters:', filterOptions.value);
  
  // In real implementation, show dialog to select export format and fields
  ElMessage.info('导出功能已触发，正在准备文件...');
};

// Handle pagination size change
const handleSizeChange = (val) => {
  pagination.pageSize = val;
  fetchCases();
};

// Handle pagination current page change
const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  fetchCases();
};

// Handle case deletion
const handleDelete = (caseId) => {
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
      await caseStore.deleteCase(caseId);
      ElMessage.success('病例已成功删除');
      fetchCases();
    } catch (error) {
      ElMessage.error('删除病例失败，请重试');
    }
  }).catch(() => {
    // 取消操作，无需处理
  });
};

// Fetch cases from API
const fetchCases = async () => {
  isLoading.value = true;
  try {
    await caseStore.fetchCases({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...filterOptions.value
    });
    
    // Update pagination total
    pagination.total = caseStore.pagination.total;
  } catch (error) {
    ElMessage.error('获取病例列表失败，请刷新页面重试');
    console.error('Error fetching cases:', error);
  } finally {
    isLoading.value = false;
  }
};

// Initial data fetch
onMounted(() => {
  fetchCases();
  
  // Watch for search text changes
  const searchTimeout = ref(null);
  watch(searchText, (newVal) => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
      fetchCases();
    }, 500);
  });
});
</script>

<style scoped>
.case-list-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>