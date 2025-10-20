<template>
  <div class="file-uploader">
    <el-upload
      ref="uploadRef"
      class="upload-container"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :file-list="fileList"
      :accept="acceptTypes"
      :multiple="multiple"
      :limit="fileLimit"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-remove="handleRemove"
      :auto-upload="autoUpload"
      drag
    >
      <el-icon class="upload-icon">
        <upload-filled />
      </el-icon>
      <div class="upload-text">
        <div class="upload-main-text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="upload-sub-text">{{ fileTypeDesc }}，单个文件不超过{{ fileSizeLimit }}MB，最多上传{{ fileLimit }}个文件</div>
      </div>
    </el-upload>

    <!-- 上传文件列表 -->
    <div v-if="fileList.length > 0" class="upload-file-list">
      <el-card class="file-list-card" v-for="(file, index) in fileList" :key="file.uid || index">
        <div class="file-item">
          <div class="file-icon">
            <el-icon :class="getFileIconClass(file)"></el-icon>
          </div>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-meta">
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <span class="file-status" :class="getStatusClass(file.status)">
                {{ getStatusText(file.status) }}
              </span>
              <span class="file-progress" v-if="file.status === 'uploading'">
                {{ file.percentage.toFixed(0) }}%
              </span>
            </div>
          </div>
          <div class="file-actions">
            <el-button 
              type="text" 
              size="small" 
              icon="el-icon-refresh" 
              @click="handleRetry(file)"
              v-if="file.status === 'fail'"
            ></el-button>
            <el-button 
              type="text" 
              size="small" 
              icon="el-icon-close" 
              @click="handleRemove(file)"
              v-if="file.status !== 'uploading'"
            ></el-button>
          </div>
        </div>
        <div v-if="file.status === 'uploading'" class="file-progress-bar">
          <el-progress :percentage="file.percentage" :status="file.status === 'fail' ? 'exception' : ''" :stroke-width="2"></el-progress>
        </div>
      </el-card>
    </div>

    <!-- 上传按钮 -->
    <div class="upload-actions" v-if="!autoUpload && fileList.length > 0">
      <el-button 
        type="primary" 
        @click="submitUpload"
        :loading="uploading"
        icon="el-icon-upload2"
      >
        开始上传
      </el-button>
      <el-button 
        @click="clearFiles"
        icon="el-icon-delete"
      >
        清空列表
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, computed } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { UploadFilled, File, Picture, Document, Video, Music, Archive, HelpFilled } from '@element-plus/icons-vue';

// 定义Props
const props = defineProps({
  // 上传URL
  uploadUrl: {
    type: String,
    default: '/api/upload'
  },
  // 允许上传的文件类型
  fileTypes: {
    type: Array,
    default: () => ['xlsx', 'csv', 'json']
  },
  // 是否允许多文件上传
  multiple: {
    type: Boolean,
    default: false
  },
  // 文件大小限制(MB)
  fileSizeLimit: {
    type: Number,
    default: 10
  },
  // 文件数量限制
  fileLimit: {
    type: Number,
    default: 1
  },
  // 是否自动上传
  autoUpload: {
    type: Boolean,
    default: false
  },
  // 额外的上传参数
  extraParams: {
    type: Object,
    default: () => ({})
  }
});

// 定义Emits
const emit = defineEmits(['upload-success', 'upload-error', 'upload-complete', 'file-removed', 'file-added']);

// 上传组件引用
const uploadRef = ref(null);

// 文件列表
const fileList = ref([]);

// 上传状态
const uploading = ref(false);

// 接受的文件类型
const acceptTypes = computed(() => {
  if (props.fileTypes.length === 0) return '';
  return props.fileTypes.map(type => {
    if (type === 'image') return 'image/*';
    if (type === 'video') return 'video/*';
    if (type === 'audio') return 'audio/*';
    return `.${type}`;
  }).join(',');
});

// 文件类型描述
const fileTypeDesc = computed(() => {
  if (props.fileTypes.length === 0) return '支持所有文件类型';
  
  const typeMap = {
    'xlsx': 'Excel文件',
    'csv': 'CSV文件',
    'json': 'JSON文件',
    'pdf': 'PDF文件',
    'doc': 'Word文件',
    'docx': 'Word文件',
    'image': '图片文件',
    'video': '视频文件',
    'audio': '音频文件'
  };
  
  const descriptions = props.fileTypes.map(type => typeMap[type] || type.toUpperCase() + '文件');
  
  if (descriptions.length <= 3) {
    return `支持${descriptions.join('、')}`;
  } else {
    return `支持${descriptions.slice(0, 2).join('、')}等${descriptions.length}种文件类型`;
  }
});

// 上传头部
const uploadHeaders = computed(() => {
  // 获取认证token
  const token = localStorage.getItem('token') || '';
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  };
});

// 文件超出限制处理
const handleExceed = (files, fileList) => {
  ElMessage.warning(`当前限制选择 ${props.fileLimit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
};

// 上传前检查
const beforeUpload = (file) => {
  // 检查文件大小
  const isLtMaxSize = file.size / 1024 / 1024 <= props.fileSizeLimit;
  if (!isLtMaxSize) {
    ElMessage.error(`文件 ${file.name} 大小超出限制，请上传不超过 ${props.fileSizeLimit}MB 的文件`);
    return false;
  }
  
  // 添加文件状态
  file.status = 'ready';
  file.percentage = 0;
  
  // 触发文件添加事件
  emit('file-added', file);
  
  return true;
};

// 上传进度处理
const handleProgress = (event, file, fileList) => {
  // 更新文件进度
  const index = fileList.findIndex(f => f.uid === file.uid);
  if (index !== -1) {
    fileList[index].percentage = event.percent;
    fileList[index].status = 'uploading';
  }
  
  // 更新本地文件列表
  file.percentage = event.percent;
  file.status = 'uploading';
};

// 上传成功处理
const handleSuccess = (response, file, fileList) => {
  // 检查响应状态
  if (response.code === 200) {
    file.status = 'success';
    file.response = response;
    
    ElMessage.success(`文件 ${file.name} 上传成功`);
    
    // 触发上传成功事件
    emit('upload-success', {
      file,
      response,
      fileList
    });
    
    // 检查是否所有文件都已上传完成
    checkAllUploaded(fileList);
  } else {
    file.status = 'fail';
    file.error = response.message || '上传失败';
    
    ElMessage.error(`文件 ${file.name} 上传失败: ${response.message || '未知错误'}`);
    
    // 触发上传错误事件
    emit('upload-error', {
      file,
      error: response.message || '未知错误',
      response
    });
  }
};

// 上传错误处理
const handleError = (err, file, fileList) => {
  file.status = 'fail';
  file.error = err.message || '上传失败';
  
  ElMessage.error(`文件 ${file.name} 上传失败: ${err.message || '网络错误'}`);
  
  // 触发上传错误事件
  emit('upload-error', {
    file,
    error: err.message || '网络错误',
    response: err
  });
  
  // 检查是否所有文件都已上传完成
  checkAllUploaded(fileList);
};

// 文件移除处理
const handleRemove = (file) => {
  // 从文件列表中移除
  const index = fileList.findIndex(f => f.uid === file.uid);
  if (index !== -1) {
    fileList.splice(index, 1);
  }
  
  // 触发文件移除事件
  emit('file-removed', file);
};

// 重试上传
const handleRetry = (file) => {
  // 重置文件状态
  file.status = 'ready';
  file.percentage = 0;
  
  // 重新上传
  if (props.autoUpload) {
    // 自动上传模式下直接上传
    uploadRef.value.submit();
  }
};

// 提交上传
const submitUpload = () => {
  if (fileList.length === 0) {
    ElMessage.warning('请先选择文件');
    return;
  }
  
  // 检查是否有就绪状态的文件
  const readyFiles = fileList.filter(file => file.status === 'ready');
  if (readyFiles.length === 0) {
    ElMessage.warning('没有待上传的文件');
    return;
  }
  
  uploading = true;
  uploadRef.value.submit();
};

// 清空文件列表
const clearFiles = () => {
  uploadRef.value.clearFiles();
  fileList.value = [];
};

// 检查所有文件是否上传完成
const checkAllUploaded = (fileList) => {
  // 检查是否还有上传中的文件
  const hasUploading = fileList.some(file => file.status === 'uploading');
  
  if (!hasUploading) {
    uploading = false;
    
    // 触发上传完成事件
    emit('upload-complete', {
      successCount: fileList.filter(file => file.status === 'success').length,
      failCount: fileList.filter(file => file.status === 'fail').length,
      totalCount: fileList.length
    });
    
    // 显示上传结果通知
    const successCount = fileList.filter(file => file.status === 'success').length;
    const failCount = fileList.filter(file => file.status === 'fail').length;
    
    if (successCount > 0 && failCount === 0) {
      ElNotification({
        title: '上传成功',
        message: `所有 ${successCount} 个文件上传成功`,
        type: 'success',
        duration: 3000
      });
    } else if (successCount > 0 && failCount > 0) {
      ElNotification({
        title: '部分上传成功',
        message: `成功 ${successCount} 个，失败 ${failCount} 个`,
        type: 'warning',
        duration: 3000
      });
    } else if (successCount === 0 && failCount > 0) {
      ElNotification({
        title: '上传失败',
        message: `所有 ${failCount} 个文件上传失败`,
        type: 'error',
        duration: 3000
      });
    }
  }
};

// 获取文件图标类名
const getFileIconClass = (file) => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) return 'el-icon-document';
  if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'el-icon-document';
  if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return 'el-icon-table';
  if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return 'el-icon-picture-outline';
  if (fileName.endsWith('.txt')) return 'el-icon-document';
  if (fileName.endsWith('.csv')) return 'el-icon-table';
  if (fileName.endsWith('.json')) return 'el-icon-setting';
  
  if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) return 'el-icon-picture';
  if (fileName.match(/\.(mp4|avi|mov|mkv|flv)$/)) return 'el-icon-video-camera';
  if (fileName.match(/\.(mp3|wav|flac|m4a)$/)) return 'el-icon-music';
  if (fileName.match(/\.(zip|rar|7z|tar|gz)$/)) return 'el-icon-folder-opened';
  
  return 'el-icon-file';
};

// 获取状态类名
const getStatusClass = (status) => {
  switch (status) {
    case 'success': return 'status-success';
    case 'fail': return 'status-error';
    case 'uploading': return 'status-uploading';
    default: return 'status-ready';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'ready': return '等待上传';
    case 'uploading': return '上传中';
    case 'success': return '上传成功';
    case 'fail': return '上传失败';
    default: return '未知状态';
  }
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.file-uploader {
  padding: 10px;
}

.upload-container {
  width: 100%;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.upload-container:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #409eff;
  margin-bottom: 10px;
}

.upload-text {
  text-align: center;
}

.upload-main-text {
  font-size: 14px;
  color: #606266;
}

.upload-sub-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.upload-file-list {
  margin-top: 20px;
}

.file-list-card {
  margin-bottom: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-icon {
  font-size: 20px;
  margin-right: 10px;
  color: #409eff;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.file-size {
  margin-right: 10px;
}

.file-status {
  margin-right: 10px;
}

.status-success {
  color: #67c23a;
}

.status-error {
  color: #f56c6c;
}

.status-uploading {
  color: #409eff;
}

.status-ready {
  color: #e6a23c;
}

.file-progress {
  margin-left: auto;
  margin-right: 10px;
}

.file-progress-bar {
  margin-top: 10px;
}

.upload-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>