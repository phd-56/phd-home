declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Element Plus 图标类型扩展
declare module '@element-plus/icons-vue' {
  export const Upload: any
  export const Monitor: any
  export const Files: any
  // 添加其他使用的图标
}

// 自定义事件类型扩展
declare global {
  interface HTMLElement {
    clickOutsideEvent?: (event: Event) => void
  }
}

// Tailwind CSS 类型声明
declare module 'tailwindcss'
declare module 'autoprefixer'