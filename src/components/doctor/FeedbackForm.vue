<template>
  <el-card class="feedback-form-card">
    <el-form
      ref="feedbackFormRef"
      :model="feedback"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item label="总体评分" prop="rating">
        <el-rate
          v-model="feedback.rating"
          :max="5"
          :allow-half="false"
          text-color="#ff9900"
          @change="handleRatingChange"
        >
          <template #text="{ value }">
            <span v-if="value === 1">很差</span>
            <span v-if="value === 2">较差</span>
            <span v-if="value === 3">一般</span>
            <span v-if="value === 4">良好</span>
            <span v-if="value === 5">优秀</span>
          </template>
        </el-rate>
      </el-form-item>

      <el-form-item label="反馈标签" prop="tags">
        <el-checkbox-group v-model="feedback.tags" class="tag-group">
          <el-checkbox label="diagnosis_accuracy" border>诊断准确性</el-checkbox>
          <el-checkbox label="treatment_rationality" border>治疗建议合理性</el-checkbox>
          <el-checkbox label="case_analysis_depth" border>病例分析深度</el-checkbox>
          <el-checkbox label="user_experience" border>用户体验</el-checkbox>
          <el-checkbox label="interface_design" border>界面设计</el-checkbox>
          <el-checkbox label="other" border>其他</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="详细评价" prop="comment">
        <el-input
          v-model="feedback.comment"
          type="textarea"
          :rows="5"
          placeholder="请输入您的详细评价和建议..."
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="是否公开" prop="isPublic">
        <el-switch v-model="feedback.isPublic" active-text="公开" inactive-text="私有" />
        <el-tooltip content="公开反馈将匿名用于模型优化案例展示" placement="right">
          <el-icon class="info-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="上传附件" prop="attachments">
        <el-upload
          v-model:file-list="uploadFiles"
          :limit="3"
          :multiple="true"
          accept=".jpg,.jpeg,.png,.pdf"
          :auto-upload="false"
          class="upload-demo"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              最多上传3个文件，支持jpg、jpeg、png、pdf格式
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">提交反馈</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { ElMessage } from 'element-plus';
import type { UploadFile } from 'element-plus';

const props = defineProps<{
  caseId: string;
  diagnosisId: string;
  visible?: boolean;
  initialData?: any;
}>();

const emit = defineEmits<{
  (e: 'submit', data: any): void;
  (e: 'cancel'): void;
  (e: 'update:visible', value: boolean): void;
}>();

const feedbackStore = useFeedbackStore();
const feedbackFormRef = ref();
const submitting = ref(false);
const uploadFiles = ref<UploadFile[]>([]);

const feedback = reactive({
  rating: 0,
  tags: [] as string[],
  comment: '',
  isPublic: false,
  caseId: props.caseId,
  diagnosisId: props.diagnosisId
});

const rules = {
  rating: [
    { required: true, message: '请给出评分', trigger: 'change' }
  ],
  tags: [
    {
      type: 'array',
      required: true,
      message: '请至少选择一个反馈标签',
      trigger: 'change'
    }
  ],
  comment: [
    { required: true, message: '请输入详细评价', trigger: 'blur' },
    { min: 10, message: '评价内容至少10个字符', trigger: 'blur' }
  ]
};

// 监听初始数据变化
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(feedback, newData);
  }
}, { immediate: true });

// 验证方法供父组件调用
defineExpose({
  validate: async () => {
    if (!feedbackFormRef.value) return false;
    try {
      await feedbackFormRef.value.validate();
      return true;
    } catch {
      return false;
    }
  },
  resetFields: () => {
    if (feedbackFormRef.value) {
      feedbackFormRef.value.resetFields();
      uploadFiles.value = [];
    }
  }
});

const handleSubmit = async () => {
  if (!feedbackFormRef.value) return;
  
  try {
    await feedbackFormRef.value.validate();
    submitting.value = true;
    
    // 准备提交数据
    const submitData = {
      ...feedback,
      files: uploadFiles.value.map(file => file.raw)
    };
    
    // 使用store提交反馈
    await feedbackStore.submitFeedback(submitData);
    
    ElMessage.success('反馈提交成功！');
    emit('submit', submitData);
    
    // 重置表单
    resetForm();
    emit('update:visible', false);
  } catch (error) {
    console.error('提交反馈失败:', error);
    ElMessage.error('提交失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

const resetForm = () => {
  feedback.rating = 0;
  feedback.tags = [];
  feedback.comment = '';
  feedback.isPublic = false;
  uploadFiles.value = [];
  if (feedbackFormRef.value) {
    feedbackFormRef.value.resetFields();
  }
};

const handleCancel = () => {
  resetForm();
  emit('cancel');
  emit('update:visible', false);
};

const handleRatingChange = (value: number) => {
  console.log('评分变化:', value);
};
</script>

<style scoped>
.feedback-form-card {
  max-width: 100%;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
}

.info-icon {
  margin-left: 8px;
  color: #606266;
  cursor: help;
}

.upload-demo {
  margin-top: 8px;
}
</style>