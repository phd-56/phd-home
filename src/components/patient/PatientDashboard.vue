<template>
  <div class="patient-dashboard">
    <el-container class="h-screen">
      <el-aside width="220px">
        <PatientSidebar :active-tab="activeTab" @tab-change="handleTabChange" />
      </el-aside>
      
      <el-main>
        <component :is="currentComponent" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import PatientSidebar from '@/views/patient/PatientSidebar.vue'
import MyImages from '@/views/patient/MyImages.vue'
import MyDiagnosis from '@/views/patient/MyDiagnosis.vue'
import MyReports from '@/views/patient/MyReports.vue'
import HealthEducation from '@/views/patient/HealthEducation.vue'
import Profile from '@/views/patient/Profile.vue'

const activeTab = ref('diagnosis')

const tabComponents = {
  diagnosis: shallowRef(MyDiagnosis),
  images: shallowRef(MyImages),
  reports: shallowRef(MyReports),
  education: shallowRef(HealthEducation),
  profile: shallowRef(Profile)
}

const currentComponent = computed(() => tabComponents[activeTab.value])

const handleTabChange = (tab: string) => {
  activeTab.value = tab
}
</script>