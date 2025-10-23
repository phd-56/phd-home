import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN';
import enUS from './en-US';

// 自动检测语言
const detectLanguage = (): string => {
  // 检查localStorage中保存的语言偏好
  const savedLang = localStorage.getItem('app-language');
  if (savedLang) {
    return savedLang;
  }
  
  // 检测浏览器语言
  const browserLang = navigator.language || navigator.userLanguage;
  
  if (browserLang.includes('zh')) {
    return 'zh-CN';
  } else if (browserLang.includes('en')) {
    return 'en-US';
  }
  
  // 默认语言
  return 'zh-CN';
};

// 定义消息类型，添加索引签名
interface Messages {
  'zh-CN': typeof zhCN;
  'en-US': typeof enUS;
  [key: string]: any;
}

// 语言消息
const messages: Messages = {
  'zh-CN': zhCN,
  'en-US': enUS
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用Composition API
  locale: detectLanguage(),
  fallbackLocale: 'zh-CN',
  messages,
  globalInjection: true, // 全局注入$t函数
  silentTranslationWarn: true // 关闭翻译警告
});

/**
 * 设置应用语言
 * @param lang 语言代码，如'zh-CN'、'en-US'
 */
export const setLanguage = (lang: string): void => {
  if (messages[lang]) {
    i18n.global.locale.value = lang;
    localStorage.setItem('app-language', lang);
    
    // 触发语言变更事件
    const event = new CustomEvent('language-changed', { detail: { lang } });
    window.dispatchEvent(event);
  }
};

/**
 * 获取当前语言
 * @returns 当前语言代码
 */
export const getCurrentLanguage = (): string => {
  return i18n.global.locale.value;
};

/**
 * 获取支持的语言列表
 * @returns 语言列表
 */
export const getSupportedLanguages = (): Array<{ code: string; name: string }> => {
  return [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' }
  ];
};

export default i18n;