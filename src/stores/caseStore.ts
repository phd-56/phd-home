import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

// 本地定义Case接口以避免导入问题
// 本地定义Case接口以避免导入问题
interface Case {
  id: string;
  patientName?: string;
  caseNumber: string;
  [key: string]: any;
}

export const useCaseStore = defineStore('case', () => {
  // 状态
  const cases = ref<Case[]>([]);
  const currentCase = ref<Case | {}>({});
  const loading = ref(false);
  const error = ref<string | null>(null);
  const queryParams = ref({
    patientName: '',
    caseNumber: '',
    startDate: null,
    endDate: null,
    diagnosis: '',
    status: 'all'
  });
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  });

  // 计算属性
  const filteredCases = computed(() => {
    // 实现多条件筛选逻辑
    return cases.value.filter(caseItem => {
      // 患者姓名筛选 (添加可选链以防属性不存在)
      if (queryParams.value.patientName && caseItem &&
          'patientName' in caseItem && 
          !String(caseItem.patientName).toLowerCase().includes(queryParams.value.patientName.toLowerCase())) {
        return false;
      }
      // 其他筛选条件...
      return true;
    });
  });

  // Actions
  const fetchCases = async (params: { page: number; pageSize: number }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('/api/cases', { params });
      if (response.data.code === 200 && response.data.data) {
        cases.value = response.data.data.records || [];
        pagination.value.total = response.data.data.total || 0;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch cases';
      cases.value = [];
    } finally {
      loading.value = false;
    }
  };

  const getCaseDetail = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`/api/cases/${id}`);
      if (response.data.code === 200 && response.data.data) {
        currentCase.value = response.data.data;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get case detail';
    } finally {
      loading.value = false;
    }
  };

  const createCase = async (caseData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post('/api/cases', caseData);
      if (response.data.code === 200 && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create case';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateCase = async (id: string, caseData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`/api/cases/${id}`, caseData);
      if (response.data.code === 200 && response.data.data) {
        currentCase.value = response.data.data;
        return response.data.data;
      }
      return null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update case';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteCase = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`/api/cases/${id}`);
      // 从列表中移除删除的病例
      cases.value = cases.value.filter(c => c && c.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete case';
    } finally {
      loading.value = false;
    }
  };

  const batchDeleteCases = async (ids: string[]) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post('/api/cases/batch-delete', { ids });
      if (response.data.code === 200 && response.data.data) {
        // 从列表中移除删除的病例
        cases.value = cases.value.filter(c => c && !ids.includes(c.id));
        return response.data.data;
      }
      return null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to batch delete cases';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const importFromHIS = async (data: any[]) => {
    loading.value = true;
    error.value = null;
    try {
      // 实现HIS数据导入逻辑
      // 这里可以添加API调用和数据处理
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to import from HIS';
    } finally {
      loading.value = false;
    }
  };

  return {
    cases,
    currentCase,
    loading,
    error,
    queryParams,
    pagination,
    filteredCases,
    fetchCases,
    getCaseDetail,
    createCase,
    updateCase,
    deleteCase,
    batchDeleteCases,
    importFromHIS
  };
});