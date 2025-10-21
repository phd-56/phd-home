<template>
  <div class="case-create-page">
    <h1>创建新病例</h1>
    
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>患者ID:</label>
          <input 
            type="text" 
            v-model="formData.patientId" 
            placeholder="请输入患者ID"
            required
          >
        </div>
        
        <div class="form-group">
          <label>患者姓名:</label>
          <input 
            type="text" 
            v-model="formData.patientName" 
            placeholder="请输入患者姓名"
            required
          >
        </div>
        
        <div class="form-group">
          <label>性别:</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="formData.gender" value="male"> 男
            </label>
            <label>
              <input type="radio" v-model="formData.gender" value="female"> 女
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label>年龄:</label>
          <input 
            type="number" 
            v-model.number="formData.age" 
            placeholder="请输入年龄"
            min="0"
          >
        </div>
        
        <div class="form-group">
          <label>主诉:</label>
          <textarea 
            v-model="formData.chiefComplaint" 
            rows="3"
            placeholder="请输入患者主诉"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>现病史:</label>
          <textarea 
            v-model="formData.presentIllness" 
            rows="4"
            placeholder="请输入现病史"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>既往史:</label>
          <textarea 
            v-model="formData.pastHistory" 
            rows="3"
            placeholder="请输入既往史"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn-cancel">取消</button>
          <button type="submit" class="btn-submit">创建病例</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 表单数据
const formData = reactive({
  patientId: '',
  patientName: '',
  gender: '',
  age: null,
  chiefComplaint: '',
  presentIllness: '',
  pastHistory: ''
});

// 提交方法
const handleSubmit = () => {
  // 简单验证
  if (!formData.patientId || !formData.patientName) {
    alert('请填写患者ID和姓名');
    return;
  }
  
  console.log('提交病例数据:', formData);
  
  // 模拟创建病例
  alert('病例创建成功！');
  router.push('/cases');
};

// 取消方法
const handleCancel = () => {
  router.push('/cases');
};
</script>

<style scoped>
.case-create-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #606266;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px;
  font-size: 14px;
  color: #303133;
  background-color: #fff !important;
}

input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus {
  border-color: #409eff !important;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  width: auto;
  margin-right: 6px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f7fa;
  color: #606266;
  margin-right: 12px;
}

.btn-cancel:hover {
  background: #e4e7ed;
}

.btn-submit {
  background: #409eff;
  color: #fff;
}

.btn-submit:hover {
  background: #66b1ff;
}
</style>