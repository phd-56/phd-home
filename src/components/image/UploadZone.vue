<template>
  <div class="simple-upload">
    <h3>文件上传区域</h3>
    <div class="upload-area">
      <p>拖拽文件到这里或点击上传</p>
      <button @click="handleUpload">选择文件</button>
      <input type="file" ref="fileInput" style="display: none" @change="handleFileChange">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement>()

const handleUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    alert(`选择了文件: ${file.name}`)
  }
}
</script>

<style scoped>
.simple-upload {
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin: 10px 0;
}
.upload-area {
  border: 2px dashed #dcdfe6;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  background: #fafafa;
}
button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>