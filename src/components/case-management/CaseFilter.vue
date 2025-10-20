<template>
  <div class="case-filter">
    <el-card>
      <el-form 
        :model="filterForm" 
        inline 
        class="filter-form"
        @submit.native.prevent
      >
        <el-form-item label="患者姓名">
          <el-input 
            v-model="filterForm.patientName" 
            placeholder="请输入患者姓名" 
            clearable
            size="small"
          />
        </el-form-item>

        <el-form-item label="病例编号">
          <el-input 
            v-model="filterForm.caseNumber" 
            placeholder="请输入病例编号" 
            clearable
            size="small"
          />
        </el-form-item>

        <el-form-item label="就诊日期">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="病例状态">
          <el-select 
            v-model="filterForm.status" 
            placeholder="全部状态" 
            size="small"
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option label="进行中" value="active"></el-option>
            <el-option label="已结案" value="closed"></el-option>
            <el-option label="已归档" value="archived"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="主要诊断">
          <el-input 
            v-model="filterForm.diagnosis" 
            placeholder="请输入主要诊断" 
            clearable
            size="small"
          />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-search" 
            @click="handleSearch"
          >
            搜索
          </el-button>
          <el-button 
            size="small" 
            icon="el-icon-refresh" 
            @click="handleReset"
            style="margin-left: 10px"
          >
            重置
          </el-button>
          <el-button 
            type="text" 
            size="small" 
            icon="el-icon-filter" 
            @click="toggleAdvancedFilter"
            style="margin-left: 10px"
          >
            高级筛选
            <i class="el-icon-arrow-down" v-if="!showAdvancedFilter"></i>
            <i class="el-icon-arrow-up" v-if="showAdvancedFilter"></i>
          </el-button>
        </el-form-item>
      </el-form>

      <el-collapse v-if="showAdvancedFilter" class="advanced-filter">
        <el-collapse-item title="高级筛选条件" name="advanced">
          <el-form 
            :model="advancedFilter" 
            inline 
            size="small"
          >
            <el-form-item label="医生姓名">
              <el-input 
                v-model="advancedFilter.doctorName" 
                placeholder="请输入医生姓名" 
                clearable
                size="small"
              />
            </el-form-item>

            <el-form-item label="患者年龄">
              <el-input 
                v-model="advancedFilter.ageMin" 
                placeholder="最小" 
                size="small"
                style="width: 80px"
              />
              <span style="margin: 0 5px">-</span>
              <el-input 
                v-model="advancedFilter.ageMax" 
                placeholder="最大" 
                size="small"
                style="width: 80px"
              />
            </el-form-item>

            <el-form-item label="患者性别">
              <el-select 
                v-model="advancedFilter.gender" 
                placeholder="全部" 
                size="small"
                clearable
              >
                <el-option label="男" value="male"></el-option>
                <el-option label="女" value="female"></el-option>
                <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                v-model="advancedFilter.createTimeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                size="small" 
                @click="handleAdvancedSearch"
              >
                应用高级筛选
              </el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';

// 定义Props
const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  }
});

// 定义Emits
const emit = defineEmits(['search', 'reset']);

// 基础筛选表单数据
const filterForm = reactive({
  patientName: '',
  caseNumber: '',
  dateRange: [],
  status: 'all',
  diagnosis: ''
});

// 高级筛选表单数据
const advancedFilter = reactive({
  doctorName: '',
  ageMin: '',
  ageMax: '',
  gender: '',
  createTimeRange: []
});

// 显示高级筛选
const showAdvancedFilter = ref(false);

// 初始化筛选条件
watch(
  () => props.initialFilters,
  (newFilters) => {
    if (newFilters) {
      Object.assign(filterForm, newFilters);
    }
  },
  { immediate: true }
);

// 切换高级筛选显示
const toggleAdvancedFilter = () => {
  showAdvancedFilter.value = !showAdvancedFilter.value;
};

// 处理搜索
const handleSearch = () => {
  // 构建筛选参数
  const searchParams = {
    ...filterForm,
    startDate: filterForm.dateRange && filterForm.dateRange.length > 0 ? filterForm.dateRange[0] : '',
    endDate: filterForm.dateRange && filterForm.dateRange.length > 0 ? filterForm.dateRange[1] : '',
    ...(showAdvancedFilter.value ? {
      ...advancedFilter,
      createStartTime: advancedFilter.createTimeRange && advancedFilter.createTimeRange.length > 0 ? advancedFilter.createTimeRange[0] : '',
      createEndTime: advancedFilter.createTimeRange && advancedFilter.createTimeRange.length > 0 ? advancedFilter.createTimeRange[1] : ''
    } : {})
  };
  
  // 删除不需要的属性
  delete searchParams.dateRange;
  if (showAdvancedFilter.value) {
    delete searchParams.createTimeRange;
  }
  
  emit('search', searchParams);
};

// 处理高级搜索
const handleAdvancedSearch = () => {
  handleSearch();
};

// 处理重置
const handleReset = () => {
  // 重置基础筛选
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = key === 'status' ? 'all' : '';
  });
  filterForm.dateRange = [];
  
  // 重置高级筛选
  Object.keys(advancedFilter).forEach(key => {
    advancedFilter[key] = '';
  });
  advancedFilter.createTimeRange = [];
  
  // 关闭高级筛选面板
  showAdvancedFilter.value = false;
  
  // 触发重置事件
  emit('reset');
};
</script>

<style scoped>
.case-filter {
  padding: 10px;
}

.filter-form {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.advanced-filter {
  margin-top: 10px;
}
</style>