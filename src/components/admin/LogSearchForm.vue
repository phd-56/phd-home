<template>
  <el-form 
    :model="queryParams" 
    label-width="100px"
    class="log-search-form"
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="用户ID" prop="userId">
          <el-input 
            v-model="queryParams.userId" 
            placeholder="输入用户ID"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="queryParams.username" 
            placeholder="输入用户名"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="操作类型" prop="action">
          <el-select 
            v-model="queryParams.action" 
            placeholder="选择操作类型"
          >
            <el-option value="">全部操作</el-option>
            <el-option label="create" value="create">创建</el-option>
            <el-option label="update" value="update">更新</el-option>
            <el-option label="delete" value="delete">删除</el-option>
            <el-option label="login" value="login">登录</el-option>
            <el-option label="logout" value="logout">登出</el-option>
            <el-option label="download" value="download">下载</el-option>
            <el-option label="upload" value="upload">上传</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="资源类型" prop="resourceType">
          <el-select 
            v-model="queryParams.resourceType" 
            placeholder="选择资源类型"
          >
            <el-option value="">全部资源</el-option>
            <el-option label="user" value="user">用户</el-option>
            <el-option label="case" value="case">病例</el-option>
            <el-option label="image" value="image">影像</el-option>
            <el-option label="report" value="report">报告</el-option>
            <el-option label="configuration" value="configuration">配置</el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="操作时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="异常操作" prop="isAnomaly">
          <el-select 
            v-model="queryParams.isAnomaly" 
            placeholder="选择异常状态"
          >
            <el-option value="">全部状态</el-option>
            <el-option label="是" :value="true">是</el-option>
            <el-option label="否" :value="false">否</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" style="text-align: right; padding-top: 5px;">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset" style="margin-left: 10px;">重置</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

// Props and Emits
const props = defineProps({
  queryParams: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['search', 'reset']);

// 状态
const dateRange = ref<string[]>([]);

// 监听查询参数变化，同步日期范围
watch(() => props.queryParams, (newVal) => {
  if (newVal.startTime && newVal.endTime) {
    dateRange.value = [newVal.startTime, newVal.endTime];
  } else {
    dateRange.value = [];
  }
}, { immediate: true });

// 监听日期范围变化
watch(dateRange, (newVal) => {
  if (newVal && newVal.length === 2) {
    // 不直接修改props，而是通过emit通知父组件
    const params = {
      startTime: newVal[0],
      endTime: newVal[1]
    };
    emits('search', params);
  }
});

// 方法
const handleSearch = () => {
  const params = { ...props.queryParams };
  
  // 处理日期范围
  if (dateRange.value && dateRange.value.length === 2) {
    params.startTime = dateRange.value[0];
    params.endTime = dateRange.value[1];
  } else {
    params.startTime = undefined;
    params.endTime = undefined;
  }
  
  emits('search', params);
};

const handleReset = () => {
  dateRange.value = [];
  emits('reset');
};
</script>

<style scoped>
.log-search-form {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>