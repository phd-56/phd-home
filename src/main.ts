import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// 样式导入
import './assets/main.css'  // 引入Tailwind样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'

// Element Plus 导入
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 中文语言包导入
import zhCn from 'element-plus/es/locale/lang/zh-cn'



const app = createApp(App)
const pinia = createPinia()


// 初始化认证状态
import { useAuthStore } from '@/stores/auth'

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件 - 只注册一次
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(router)

app.mount('#app')

// 应用挂载后初始化认证状态
const authStore = useAuthStore()
authStore.initialize()