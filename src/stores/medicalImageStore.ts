import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ImageFile {
  id: string
  name: string
  type: 'dicom' | 'jpg' | 'png'
  size: number
  url: string
  uploadTime: Date
  thumbnail?: string
  seriesId?: string // DICOM序列ID
  instanceNumber?: number // DICOM实例号
}

export interface Annotation {
  id: string
  type: 'rectangle' | 'circle' | 'freehand' | 'text'
  points: number[]
  color: string
  lineWidth: number
  label?: string
  createdAt: Date
}

export interface AnalysisFinding {
  type: string
  confidence: number
  bbox: [number, number, number, number]
  description: string
}

export interface AnalysisResult {
  id: string
  imageId: string
  findings: AnalysisFinding[]
  analysisTime: Date
}

export const useMedicalImageStore = defineStore('medicalImage', () => {
  const images = ref<ImageFile[]>([])
  const currentImage = ref<ImageFile | null>(null)
  const analysisResults = ref<Record<string, AnalysisResult>>({})
  const annotations = ref<Record<string, Annotation[]>>({})
  const isLoading = ref(false)
  const uploadProgress = ref(0)

  // DICOM序列数据
  const dicomSeries = ref<Record<string, ImageFile[]>>({})

  // 模拟分析结果数据
  const mockAnalysisResults: Record<string, AnalysisResult> = {
    '1': {
      id: 'analysis-1',
      imageId: '1',
      findings: [
        {
          type: '肿瘤',
          confidence: 0.92,
          bbox: [100, 150, 80, 60],
          description: '检测到疑似肿瘤病灶，建议进一步检查'
        }
      ],
      analysisTime: new Date()
    }
  }

  const uploadImage = async (file: File): Promise<ImageFile> => {
    return new Promise((resolve) => {
      isLoading.value = true
      uploadProgress.value = 0

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(progressInterval)

          const reader = new FileReader()
          reader.onload = (e) => {
            const imageData: ImageFile = {
              id: Date.now().toString(),
              name: file.name,
              type: getFileType(file.name),
              size: file.size,
              url: e.target?.result as string,
              uploadTime: new Date(),
              thumbnail: e.target?.result as string
            }

            images.value.push(imageData)
            isLoading.value = false
            resolve(imageData)
          }
          reader.readAsDataURL(file)
        }
      }, 100)
    })
  }

  const uploadDicomSeries = async (files: File[]): Promise<void> => {
    isLoading.value = true
    uploadProgress.value = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const image = await uploadImage(file)

      // 分组DICOM序列
      const seriesId = generateSeriesId(file)
      if (!dicomSeries.value[seriesId]) {
        dicomSeries.value[seriesId] = []
      }
      dicomSeries.value[seriesId].push(image)

      uploadProgress.value = ((i + 1) / files.length) * 100
    }

    isLoading.value = false
  }

  const analyzeImage = (imageId: string): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      isLoading.value = true

      setTimeout(() => {
        const result = mockAnalysisResults[imageId] || {
          id: `analysis-${imageId}`,
          imageId,
          findings: [],
          analysisTime: new Date()
        }

        analysisResults.value[imageId] = result
        isLoading.value = false
        resolve(result)
      }, 2000)
    })
  }

  const addAnnotation = (imageId: string, annotation: Omit<Annotation, 'id' | 'createdAt'>) => {
    if (!annotations.value[imageId]) {
      annotations.value[imageId] = []
    }

    const newAnnotation: Annotation = {
      ...annotation,
      id: generateId(),
      createdAt: new Date()
    }

    annotations.value[imageId].push(newAnnotation)
    return newAnnotation
  }

  const removeAnnotation = (imageId: string, annotationId: string) => {
    if (annotations.value[imageId]) {
      annotations.value[imageId] = annotations.value[imageId].filter(
        ann => ann.id !== annotationId
      )
    }
  }

  const getFileType = (fileName: string): 'dicom' | 'jpg' | 'png' => {
    const ext = fileName.toLowerCase().split('.').pop()
    if (ext === 'dcm') return 'dicom'
    if (ext === 'jpg' || ext === 'jpeg') return 'jpg'
    return 'png'
  }

  const generateSeriesId = (file: File): string => {
    // 简化的系列ID生成，实际应根据DICOM元数据
    return file.name.split('.').slice(0, -1).join('.')
  }

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  return {
    images,
    currentImage,
    analysisResults,
    annotations,
    isLoading,
    uploadProgress,
    dicomSeries,
    uploadImage,
    uploadDicomSeries,
    analyzeImage,
    addAnnotation,
    removeAnnotation
  }
})