import dicomParser from 'dicom-parser'

export interface DicomImageData {
  pixelData: Uint8Array
  width: number
  height: number
  windowWidth: number
  windowCenter: number
  photometricInterpretation: string
  bitsAllocated: number
  bitsStored: number
  highBit: number
  pixelRepresentation: number
}

export class DicomProcessor {
  /**
   * 解析DICOM文件
   */
  static async parseDicomFile(file: File): Promise<DicomImageData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          const byteArray = new Uint8Array(arrayBuffer)
          const dataSet = dicomParser.parseDicom(byteArray)

          // 提取像素数据
          const pixelDataElement = dataSet.elements.x7fe00010
          if (!pixelDataElement) {
            throw new Error('No pixel data found in DICOM file')
          }

          const pixelData = new Uint8Array(
            arrayBuffer,
            pixelDataElement.dataOffset,
            pixelDataElement.length
          )

          // 获取图像参数
          const width = dataSet.uint16('x00280011') || 512
          const height = dataSet.uint16('x00280010') || 512
          const windowWidth = dataSet.uint16('x00281051') || 400
          const windowCenter = dataSet.uint16('x00281050') || 50
          const photometricInterpretation = dataSet.string('x00280004') || 'MONOCHROME2'
          const bitsAllocated = dataSet.uint16('x00280100') || 8
          const bitsStored = dataSet.uint16('x00280101') || 8
          const highBit = dataSet.uint16('x00280102') || 7
          const pixelRepresentation = dataSet.uint16('x00280103') || 0

          resolve({
            pixelData,
            width,
            height,
            windowWidth,
            windowCenter,
            photometricInterpretation,
            bitsAllocated,
            bitsStored,
            highBit,
            pixelRepresentation
          })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 应用窗宽窗位调整
   */
  static applyWindowLevel(
    pixelData: Uint8Array,
    windowWidth: number,
    windowCenter: number,
    bitsStored: number = 8
  ): Uint8Array {
    const output = new Uint8Array(pixelData.length)
    const windowMin = windowCenter - windowWidth / 2
    const windowMax = windowCenter + windowWidth / 2
    const maxValue = Math.pow(2, bitsStored) - 1

    for (let i = 0; i < pixelData.length; i++) {
      let value = pixelData[i]

      // 标准化到0-255范围
      if (value < windowMin) {
        value = 0
      } else if (value > windowMax) {
        value = maxValue
      } else {
        value = ((value - windowMin) / windowWidth) * maxValue
      }

      // 确保在0-255范围内
      output[i] = Math.max(0, Math.min(255, Math.floor(value)))
    }

    return output
  }

  /**
   * 将DICOM像素数据转换为Canvas图像
   */
  static convertToImageData(
    pixelData: Uint8Array,
    width: number,
    height: number
  ): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    const imageData = ctx.createImageData(width, height)

    // 填充像素数据 (灰度图像)
    for (let i = 0; i < pixelData.length; i++) {
      const value = pixelData[i]
      imageData.data[i * 4] = value     // R
      imageData.data[i * 4 + 1] = value // G
      imageData.data[i * 4 + 2] = value // B
      imageData.data[i * 4 + 3] = 255   // A
    }

    return imageData
  }

  /**
   * 生成DICOM图像URL
   */
  static async createDicomImageUrl(file: File): Promise<string> {
    try {
      const dicomData = await this.parseDicomFile(file)
      const processedData = this.applyWindowLevel(
        dicomData.pixelData,
        dicomData.windowWidth,
        dicomData.windowCenter,
        dicomData.bitsStored
      )

      const imageData = this.convertToImageData(
        processedData,
        dicomData.width,
        dicomData.height
      )

      const canvas = document.createElement('canvas')
      canvas.width = dicomData.width
      canvas.height = dicomData.height
      const ctx = canvas.getContext('2d')!
      ctx.putImageData(imageData, 0, 0)

      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('DICOM processing error:', error)
      throw new Error('Failed to process DICOM file')
    }
  }
}