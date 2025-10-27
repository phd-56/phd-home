// esm-test.mjs - 使用 ES 模块语法
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== ES 模块环境验证 ===');
console.log('当前目录:', __dirname);
console.log('');

const packages = [
  { name: 'TensorFlow.js', import: '@tensorflow/tfjs' },
  { name: 'COCO-SSD', import: '@tensorflow-models/coco-ssd' },
  { name: 'Sharp', import: 'sharp' },
  { name: 'Jimp', import: 'jimp' },
  { name: 'Canvas', import: 'canvas' },
  { name: 'Chart.js', import: 'chart.js' },
  { name: 'D3', import: 'd3' },
  { name: 'jsPDF', import: 'jspdf' },
  { name: 'PDF-lib', import: 'pdf-lib' },
  { name: 'html2canvas', import: 'html2canvas' }
];

for (const pkg of packages) {
  try {
    const module = await import(pkg.import);
    console.log(`✅ ${pkg.name} - 安装成功`);
  } catch (error) {
    console.log(`❌ ${pkg.name} - 安装失败: ${error.message}`);
  }
}

console.log('\n🎯 ES 模块验证完成！');