/**
 * 文件处理工具函数
 */

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

/**
 * 验证上传文件
 */
export function validateFile(file: File): FileValidationResult {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/png', 'application/dicom', 'application/octet-stream']
  const isValidType = validTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith('.dcm') ||
    file.name.toLowerCase().endsWith('.jpg') ||
    file.name.toLowerCase().endsWith('.jpeg') ||
    file.name.toLowerCase().endsWith('.png')

  if (!isValidType) {
    return {
      isValid: false,
      error: '请上传DICOM、JPG或PNG格式的影像文件'
    }
  }

  // 检查文件大小 (50MB限制)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: '文件大小不能超过50MB'
    }
  }

  return { isValid: true }
}

/**
 * 获取文件类型
 */
export function getFileType(fileName: string): 'dicom' | 'jpg' | 'png' {
  const ext = fileName.toLowerCase().split('.').pop()
  if (ext === 'dcm') return 'dicom'
  if (ext === 'jpg' || ext === 'jpeg') return 'jpg'
  return 'png'
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 生成文件缩略图
 */
export function createThumbnail(file: File, maxWidth: number = 200, maxHeight: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // 计算缩略图尺寸
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 批量验证文件
 */
export function validateFiles(files: File[]): {
  validFiles: File[]
  errors: string[]
} {
  const validFiles: File[] = []
  const errors: string[] = []

  files.forEach(file => {
    const validation = validateFile(file)
    if (validation.isValid) {
      validFiles.push(file)
    } else if (validation.error) {
      errors.push(`${file.name}: ${validation.error}`)
    }
  })

  return { validFiles, errors }
}