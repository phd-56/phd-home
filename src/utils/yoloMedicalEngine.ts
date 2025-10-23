import * as tf from "@tensorflow/tfjs";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
}

export interface DetectionResult {
  boxes: BoundingBox[];
  imageWidth: number;
  imageHeight: number;
}

export class YOLOMedicalEngine {
  private yoloModel: tf.LayersModel | null = null;
  private isInitialized: boolean = false;

  constructor() {
    console.log('YOLO Medical Engine initialized');
  }

  /**
   * 加载 YOLO 模型
   */
  async loadModel(modelUrl?: string): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log('Model already loaded');
        return;
      }

      const defaultModelUrl = modelUrl || '/models/yolo-medical/model.json';

      console.log('Loading YOLO model from:', defaultModelUrl);
      this.yoloModel = await tf.loadLayersModel(defaultModelUrl);

      // 预热模型
      const warmupInput = tf.ones([1, 416, 416, 3]);
      this.yoloModel.predict(warmupInput);
      warmupInput.dispose();

      this.isInitialized = true;
      console.log('YOLO model loaded successfully');
    } catch (error) {
      console.error('Failed to load YOLO model:', error);
      throw new Error(`YOLO model loading failed: ${error.message}`);
    }
  }

  /**
   * 预处理图像
   */
  private preprocessImage(imageElement: HTMLImageElement | HTMLCanvasElement): tf.Tensor {
    return tf.tidy(() => {
      // 将图像转换为张量
      let tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([416, 416])
        .toFloat();

      // 归一化到 0-1
      tensor = tensor.div(255.0);

      // 添加批次维度
      return tensor.expandDims(0);
    });
  }

  /**
   * 执行目标检测
   */
  async detect(image: HTMLImageElement | HTMLCanvasElement): Promise<DetectionResult> {
    if (!this.yoloModel || !this.isInitialized) {
      throw new Error('YOLO model not loaded. Please call loadModel() first.');
    }

    return tf.tidy(() => {
      // 预处理图像
      const inputTensor = this.preprocessImage(image);

      // 模型预测
      const predictions = this.yoloModel!.predict(inputTensor) as tf.Tensor;

      // 后处理 - 这里需要根据实际模型输出进行调整
      const boxes = this.postprocessPredictions(predictions, image.width, image.height);

      return {
        boxes,
        imageWidth: image.width,
        imageHeight: image.height
      };
    });
  }

  /**
   * 后处理预测结果
   */
  private postprocessPredictions(
    predictions: tf.Tensor,
    originalWidth: number,
    originalHeight: number
  ): BoundingBox[] {
    // 这里需要根据您的 YOLO 模型输出格式进行调整
    // 这是一个简化的示例实现

    const boxes: BoundingBox[] = [];

    // 将预测结果转换为 JavaScript 数组
    const predictionData = predictions.arraySync() as number[][][][];

    // 简化的后处理逻辑 - 需要根据实际模型调整
    predictionData[0].forEach((gridCell, index) => {
      gridCell.forEach(bbox => {
        const [x, y, width, height, confidence, ...classProbs] = bbox;

        // 找到最大概率的类别
        const maxClassIndex = classProbs.indexOf(Math.max(...classProbs));
        const classNames = ['tumor', 'fracture', 'lesion', 'abnormality']; // 示例类别

        if (confidence > 0.5) { // 置信度阈值
          boxes.push({
            x: x * originalWidth,
            y: y * originalHeight,
            width: width * originalWidth,
            height: height * originalHeight,
            confidence,
            class: classNames[maxClassIndex] || 'unknown'
          });
        }
      });
    });

    // 非极大值抑制 (NMS)
    return this.nonMaximumSuppression(boxes);
  }

  /**
   * 非极大值抑制
   */
  private nonMaximumSuppression(boxes: BoundingBox[], iouThreshold: number = 0.5): BoundingBox[] {
    if (boxes.length === 0) return [];

    // 按置信度排序
    const sortedBoxes = boxes.sort((a, b) => b.confidence - a.confidence);
    const selected: BoundingBox[] = [];

    while (sortedBoxes.length > 0) {
      const current = sortedBoxes.shift()!;
      selected.push(current);

      // 移除与当前框重叠度高的框
      for (let i = sortedBoxes.length - 1; i >= 0; i--) {
        if (this.calculateIOU(current, sortedBoxes[i]) > iouThreshold) {
          sortedBoxes.splice(i, 1);
        }
      }
    }

    return selected;
  }

  /**
   * 计算 IoU (交并比)
   */
  private calculateIOU(box1: BoundingBox, box2: BoundingBox): number {
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const area1 = box1.width * box1.height;
    const area2 = box2.width * box2.height;
    const union = area1 + area2 - intersection;

    return intersection / union;
  }

  /**
   * 在画布上绘制检测结果
   */
  drawDetections(
    canvas: HTMLCanvasElement,
    detections: DetectionResult,
    options: {
      boxColor?: string;
      textColor?: string;
      lineWidth?: number
    } = {}
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const {
      boxColor = '#FF0000',
      textColor = '#FFFFFF',
      lineWidth = 2
    } = options;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.boxes.forEach(box => {
      const { x, y, width, height, confidence, class: className } = box;

      // 绘制边界框
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(x, y, width, height);

      // 绘制标签背景
      const label = `${className} ${(confidence * 100).toFixed(1)}%`;
      ctx.fillStyle = boxColor;
      const textMetrics = ctx.measureText(label);
      const textHeight = 16;
      ctx.fillRect(x, y - textHeight, textMetrics.width + 8, textHeight);

      // 绘制标签文本
      ctx.fillStyle = textColor;
      ctx.font = '12px Arial';
      ctx.fillText(label, x + 4, y - 4);
    });
  }

  /**
   * 释放资源
   */
  dispose(): void {
    if (this.yoloModel) {
      this.yoloModel.dispose();
      this.yoloModel = null;
    }
    this.isInitialized = false;
  }

  /**
   * 检查模型是否已加载
   */
  isModelLoaded(): boolean {
    return this.isInitialized;
  }
}

// 导出单例实例
export const yoloMedicalEngine = new YOLOMedicalEngine();