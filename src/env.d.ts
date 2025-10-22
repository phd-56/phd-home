// src/env.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_ALIYUN_ACCESS_KEY_ID: string
  readonly VITE_ALIYUN_ACCESS_KEY_SECRET: string
  readonly VITE_ALIYUN_REGION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}