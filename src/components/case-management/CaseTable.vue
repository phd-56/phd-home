<template>
  <div class="case-table">
    <el-table
      :data="caseList"
      border
      stripe
      v-loading="loading"
      element-loading-text="加载中..."
      :header-cell-style="{ 'background-color': '#f5f7fa', 'font-weight': 'bold' }"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleRowDblClick"
    >
      <el-table-column 
        type="selection" 
        width="55"
        v-if="showSelection"
      ></el-table-column>
      
      <el-table-column 
        type="index" 
        label="序号" 
        width="60"
        v-if="showIndex"
      ></el-table-column>
      
      <el-table-column 
        prop="caseNumber" 
        label="病例编号" 
        width="140"
        sortable
      >
        <template slot-scope="scope">
          <el-link 
            type="primary" 
            :underline="false"
            @click="handleViewDetail(scope.row.id)"
          >
            {{ scope.row.caseNumber }}
          </el-link>
        </template>
      </el-table-column>
      
      <el-table-column 
        prop="patientName" 
        label="患者姓名" 
        sortable
      ></el-table-column>
      
      <el-table-column 
        prop="patientGender" 
        label="性别" 
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.patientGender === 'male' ? '男' : scope.row.patientGender === 'female' ? '女' : '其他' }}
        </template>
      </el-table-column>
      
      <el-table-column 
        prop="patientAge" 
        label="年龄" 
        width="80"
        sortable
      ></el-table-column>
      
      <el-table-column 
        prop="admissionDate" 
        label="就诊日期" 
        width="120"
        sortable
      ></el-table-column>
      
      <el-table-column 
        label="主要诊断" 
        width="200"
      >
        <template slot-scope="scope">
          <div class="diagnosis-list">
            <div v-for="(diagnosis, index) in scope.row.diagnosis.slice(0, 2)" :key="index">
              {{ diagnosis.diseaseName }}
            </div>
            <div v-if="scope.row.diagnosis && scope.row.diagnosis.length > 2">
              <el-tooltip 
                :content="scope.row.diagnosis.slice(2).map(d => d.diseaseName).join(', ')"
                placement="top"
              >
                <span class="more-diagnosis">+{{ scope.row.diagnosis.length - 2 }} 项</span>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column 
        prop="doctorName" 
        label="主治医生" 
        width="120"
      ></el-table-column>
      
      <el-table-column 
        prop="status" 
        label="状态" 
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <el-tag 
            :type="getStatusTagType(scope.row.status)"
          >
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column 
        label="操作" 
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button 
            type="text" 
            size="small" 
            icon="el-icon-view"
            @click="handleViewDetail(scope.row.id)"
            v-if="operations.includes('view')"
          >
            查看
          </el-button>
          
          <el-button 
            type="text" 
            size="small" 
            icon="el-icon-edit"
            @click="handleEdit(scope.row.id)"
            v-if="operations.includes('edit')"
          >
            编辑
          </el-button>
          
          <el-button 
            type="text" 
            size="small" 
            icon="el-icon-delete"
            class="delete-btn"
            @click="handleDelete(scope.row.id)"
            v-if="operations.includes('delete')"
          >
            删除
          </el-button>
          
          <el-dropdown 
            size="small" 
            v-if="operations.includes('more')"
          >
            <el-button type="text" size="small">
              更多 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handlePrint(scope.row.id)">
                <i class="el-icon-printer"></i> 打印
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleExportSingle(scope.row.id)">
                <i class="el-icon-download"></i> 导出
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleChangeStatus(scope.row.id, scope.row.status)">
                <i class="el-icon-refresh"></i> 变更状态
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination" v-if="showPagination && total > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        :small="smallPagination"
      ></el-pagination>
    </div>
    
    <div v-if="caseList.length === 0 && !loading" class="empty-state">
      <el-empty description="暂无病例数据"></el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import { ElMessage, ElConfirm } from 'element-plus';

// 定义Props
const props = defineProps({
  caseList: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10
    })
  },
  showSelection: {
    type: Boolean,
    default: true
  },
  showIndex: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  smallPagination: {
    type: Boolean,
    default: false
  },
  operations: {
    type: Array,
    default: () => ['view', 'edit', 'delete', 'more']
  }
});

// 定义Emits
const emit = defineEmits([
  'selection-change',
  'view-detail',
  'edit',
  'delete',
  'print',
  'export-single',
  'change-status',
  'size-change',
  'current-change',
  'row-dblclick'
]);

// 处理选择变化
const handleSelectionChange = (selection) => {
  emit('selection-change', selection);
};

// 处理查看详情
const handleViewDetail = (id) => {
  emit('view-detail', id);
};

// 处理编辑
const handleEdit = (id) => {
  emit('edit', id);
};

// 处理删除
const handleDelete = (id) => {
  ElConfirm({
    title: '确认删除',
    message: '您确定要删除此病例吗？此操作不可撤销。',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    async confirm() {
      emit('delete', id);
    }
  });
};

// 处理打印
const handlePrint = (id) => {
  emit('print', id);
};

// 处理单条导出
const handleExportSingle = (id) => {
  emit('export-single', id);
};

// 处理状态变更
const handleChangeStatus = (id, currentStatus) => {
  emit('change-status', id, currentStatus);
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  emit('size-change', size);
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  emit('current-change', page);
};

// 处理行双击事件
const handleRowDblClick = (row) => {
  emit('row-dblclick', row.id);
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'closed':
      return 'info';
    case 'archived':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
};

// 获取状态显示文本
const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return '进行中';
    case 'closed':
      return '已结案';
    case 'archived':
      return '已归档';
    case 'cancelled':
      return '已取消';
    default:
      return status;
  }
};
</script>

<style scoped>
.case-table {
  width: 100%;
  overflow-x: auto;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.pagination {
  margin-top: 15px;
  text-align: right;
}

.delete-btn {
  color: #f56c6c;
}

.diagnosis-list {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-diagnosis {
  color: #606266;
  font-size: 12px;
}
</style>