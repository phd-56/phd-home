// utils/imageAnalysis.ts
export interface ImageAnalysisResult {
  imageStats: {
    width: number;
    height: number;
    meanIntensity: number;
    stdIntensity: number;
    entropy: number;
    contrast: number;
  };
  regions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    meanIntensity: number;
    type: 'normal' | 'high_density' | 'low_density' | 'texture_abnormal';
    confidence: number;
  }>;
}

export class ImageAnalyzer {
  async analyzeImage(file: File): Promise<ImageAnalysisResult> {
    const imageData = await this.loadImageData(file);
    return this.analyzeImageData(imageData);
  }

  private async loadImageData(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(imageData);
      };

      img.onerror = reject;
      img.src = url;
    });
  }

  private analyzeImageData(imageData: ImageData): ImageAnalysisResult {
    const { data, width, height } = imageData;
    const stats = this.calculateImageStats(data);
    const regions = this.detectRegions(imageData);

    return {
      imageStats: {
        width,
        height,
        meanIntensity: stats.mean,
        stdIntensity: stats.std,
        entropy: this.calculateEntropy(data),
        contrast: this.calculateContrast(data, width, height)
      },
      regions
    };
  }

  private calculateImageStats(data: Uint8ClampedArray): { mean: number; std: number } {
    let sum = 0;
    let sumSquares = 0;
    const count = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const intensity = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += intensity;
      sumSquares += intensity * intensity;
    }

    const mean = sum / count;
    const std = Math.sqrt(sumSquares / count - mean * mean);

    return { mean, std };
  }

  private calculateEntropy(data: Uint8ClampedArray): number {
    const histogram = new Array(256).fill(0);
    const total = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const intensity = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
      histogram[intensity]++;
    }

    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (histogram[i] > 0) {
        const probability = histogram[i] / total;
        entropy -= probability * Math.log2(probability);
      }
    }

    return entropy;
  }

  private calculateContrast(data: Uint8ClampedArray, width: number, height: number): number {
    let contrastSum = 0;
    let contrastCount = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const centerIntensity = this.getPixelIntensity(data, x, y, width);
        const neighbors = [
          this.getPixelIntensity(data, x - 1, y, width),
          this.getPixelIntensity(data, x + 1, y, width),
          this.getPixelIntensity(data, x, y - 1, width),
          this.getPixelIntensity(data, x, y + 1, width)
        ];

        const neighborMean = neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
        contrastSum += Math.abs(centerIntensity - neighborMean);
        contrastCount++;
      }
    }

    return contrastSum / contrastCount;
  }

  private getPixelIntensity(data: Uint8ClampedArray, x: number, y: number, width: number): number {
    const index = (y * width + x) * 4;
    return (data[index] + data[index + 1] + data[index + 2]) / 3;
  }

  private detectRegions(imageData: ImageData): ImageAnalysisResult['regions'] {
    const regions: ImageAnalysisResult['regions'] = [];
    const { data, width, height } = imageData;
    const gridSize = 8; // 将图像分成 8x8 网格进行分析

    const cellWidth = Math.floor(width / gridSize);
    const cellHeight = Math.floor(height / gridSize);

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;
        const regionStats = this.analyzeRegion(data, x, y, cellWidth, cellHeight, width);

        if (regionStats.type !== 'normal') {
          regions.push({
            x: x / width,
            y: y / height,
            width: cellWidth / width,
            height: cellHeight / height,
            meanIntensity: regionStats.mean,
            type: regionStats.type,
            confidence: regionStats.confidence
          });
        }
      }
    }

    return regions;
  }

  private analyzeRegion(
    data: Uint8ClampedArray,
    x: number,
    y: number,
    width: number,
    height: number,
    imageWidth: number
  ): { mean: number; type: 'normal' | 'high_density' | 'low_density' | 'texture_abnormal'; confidence: number } {
    let sum = 0;
    let count = 0;

    for (let i = y; i < y + height && i < imageWidth; i++) {
      for (let j = x; j < x + width && j < imageWidth; j++) {
        const intensity = this.getPixelIntensity(data, j, i, imageWidth);
        sum += intensity;
        count++;
      }
    }

    const mean = sum / count;
    let type: 'normal' | 'high_density' | 'low_density' | 'texture_abnormal' = 'normal';
    let confidence = 0;

    // 基于医学影像的典型强度范围
    if (mean > 200) {
      type = 'high_density';
      confidence = 0.7;
    } else if (mean < 50) {
      type = 'low_density';
      confidence = 0.6;
    } else if (this.calculateRegionTexture(data, x, y, width, height, imageWidth) > 40) {
      type = 'texture_abnormal';
      confidence = 0.5;
    }

    return { mean, type, confidence };
  }

  private calculateRegionTexture(
    data: Uint8ClampedArray,
    x: number,
    y: number,
    width: number,
    height: number,
    imageWidth: number
  ): number {
    let variance = 0;
    let sum = 0;
    let count = 0;

    // 计算区域均值
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        const intensity = this.getPixelIntensity(data, j, i, imageWidth);
        sum += intensity;
        count++;
      }
    }
    const mean = sum / count;

    // 计算方差
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        const intensity = this.getPixelIntensity(data, j, i, imageWidth);
        variance += Math.pow(intensity - mean, 2);
      }
    }

    return Math.sqrt(variance / count);
  }
}