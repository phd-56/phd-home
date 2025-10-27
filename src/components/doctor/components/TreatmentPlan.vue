<template>
  <div class="treatment-plan">
    <h4>治疗方案</h4>
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="药物治疗" name="medication">
        <div v-if="treatments.medication.length">
          <el-table :data="treatments.medication" border size="small">
            <el-table-column prop="name" label="药物名称" width="200" />
            <el-table-column prop="dosage" label="剂量" />
            <el-table-column prop="frequency" label="用药频率" />
            <el-table-column prop="precautions" label="注意事项" />
          </el-table>
        </div>
        <div v-else class="empty-state">无药物治疗方案数据</div>
      </el-tab-pane>
      <el-tab-pane label="物理治疗" name="physical">
        <ul v-if="treatments.physical.length" class="treatment-list">
          <li v-for="(item, index) in treatments.physical" :key="index">
            {{ item }}
          </li>
        </ul>
        <div v-else class="empty-state">无物理治疗方案数据</div>
      </el-tab-pane>
      <el-tab-pane label="手术治疗" name="surgical">
        <ul v-if="treatments.surgical.length" class="treatment-list">
          <li v-for="(item, index) in treatments.physical" :key="index">
            {{ item }}
          </li>
        </ul>
        <div v-else class="empty-state">无手术治疗方案数据</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KnowledgeItem } from '@/types'

const props = defineProps<{
  treatments: KnowledgeItem['treatments']
}>()

const activeTab = ref('medication')
</script>

<style scoped>
.treatment-plan {
  padding: 16px 0;
}
.treatment-list {
  padding-left: 20px;
}
.treatment-list li {
  margin: 8px 0;
  line-height: 1.6;
}
.empty-state {
  padding: 20px;
  text-align: center;
  color: #999;
  background-color: #f9fafb;
  border-radius: 4px;
}
</style>