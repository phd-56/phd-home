// src/services/reportStorageService.ts
export interface MedicalReport {
  id: string
  patientInfo: any
  reportData: any
  findings: string
  diagnosis: string
  recommendation: string
  doctorInfo: {
    reportDoctor: string
    reviewDoctor: string
  }
  signatures: {
    reportDoctor: string
    reviewDoctor: string
  }
  createdAt: string
  updatedAt: string
  status: 'draft' | 'signed' | 'completed'
}

export class ReportStorageService {
  private static readonly STORAGE_KEY = 'medicalReports'

  static saveReport(report: MedicalReport): void {
    const reports = this.getAllReports()
    const existingIndex = reports.findIndex(r => r.id === report.id)

    if (existingIndex >= 0) {
      reports[existingIndex] = report
    } else {
      reports.push(report)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports))
  }

  static getReport(id: string): MedicalReport | null {
    const reports = this.getAllReports()
    return reports.find(r => r.id === id) || null
  }

  static getAllReports(): MedicalReport[] {
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  static deleteReport(id: string): void {
    const reports = this.getAllReports().filter(r => r.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports))
  }

  static generateReportId(): string {
    return `REP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}