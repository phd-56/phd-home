<template>
  <div class="document-upload">
    <el-card title="病例文档上传">
      <el-upload
        class="upload-demo"
        drag
        action="/api/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :file-list="fileList"
        multiple
        :limit="5"
        :on-exceed="handleExceed"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          支持上传PDF、Word、Excel、图片等格式文件，单个文件不超过10MB，最多上传5个文件
        </div>
      </el-upload>

      <el-divider>已上传文件列表</el-divider>

      <el-table v-if="uploadedFiles.length > 0" :data="uploadedFiles" border>
        <el-table-column prop="name" label="文件名" width="300"></el-table-column>
        <el-table-column prop="type" label="文件类型"></el-table-column>
        <el-table-column prop="size" label="文件大小" width="100">
          <template slot-scope="scope">{{ formatFileSize(scope.row.size) }}</template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button 
              type="text" 
              size="small" 
              @click="downloadFile(scope.row.id)"
            >
              下载
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              style="color: #ff4d4f"
              @click="deleteFile(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-else description="暂无上传文件"></el-empty>

      <div class="form-actions">
        <el-button @click="emit('prev')">上一步</el-button>
        <el-button type="primary" @click="handleSubmit">提交病例</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';

// Props and Emits
const props = defineProps({
  caseData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['prev', 'submit', 'update:caseData']);

// File upload state
const fileList = ref([]);
const uploadedFiles = ref([]);

// Format file size from bytes to human readable format
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Handle file preview
const handlePreview = (file) => {
  console.log('Preview file:', file);
  // In real implementation, open file preview dialog
};

// Handle file removal from upload list
const handleRemove = (file, fileList) => {
  console.log('Remove file:', file);
};

// Handle upload success
const handleSuccess = (response, file, fileList) => {
  if (response.success) {
    ElMessage.success(`文件 ${file.name} 上传成功`);
    
    // Add to uploaded files list
    uploadedFiles.value.push({
      id: response.fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadTime: new Date().toISOString().slice(0, 10),
      url: response.fileUrl
    });
  } else {
    ElMessage.error(`文件 ${file.name} 上传失败: ${response.message}`);
  }
};

// Handle upload error
const handleError = (err, file, fileList) => {
  ElMessage.error(`文件 ${file.name} 上传失败，请重试`);
  console.error('Upload error:', err);
};

// Before upload validation
const beforeUpload = (file) => {
  const fileSize = file.size / 1024 / 1024; // Convert to MB
  
  // Check file size
  if (fileSize > 10) {
    ElMessage.error('文件大小不能超过10MB');
    return false;
  }
  
  // Check file type (simple check by extension)
  const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    ElMessage.error('不支持的文件类型，请上传PDF、Word、Excel或图片文件');
    return false;
  }
  
  return true;
};

// Handle exceed file limit
const handleExceed = (files, fileList) => {
  ElMessage.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
};

// Download file
const downloadFile = (fileId) => {
  // In real implementation, call download API
  console.log('Download file with ID:', fileId);
  window.open(`/api/files/${fileId}/download`, '_blank');
};

// Delete file
const deleteFile = (fileId) => {
  // In real implementation, call delete API
  console.log('Delete file with ID:', fileId);
  
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId);
  ElMessage.success('文件已删除');
};

// Handle form submission
const handleSubmit = () => {
  if (uploadedFiles.value.length === 0) {
    // Ask user if they want to submit without documents
    if (confirm('当前没有上传任何文档，确定要提交病例吗？')) {
      emit('submit');
    }
  } else {
    // Prepare document data to submit
    const documentsData = uploadedFiles.value.map(file => ({
      id: file.id,
      name: file.name,
      type: file.type.includes('pdf') ? 'report' : 
            file.type.includes('image') ? 'image' : 'other',
      fileUrl: file.url,
      fileSize: file.size,
      uploadedAt: file.uploadTime
    }));
    
    emit('update:caseData', documentsData);
    emit('submit');
  }
};
</script>

<style scoped>
.document-upload {
  padding: 10px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
</style>