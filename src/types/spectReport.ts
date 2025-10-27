export interface SPECTPatientInfo {
  name: string
  gender: string
  age: string
  address: string
  room: string
  bedNumber: string
  inpatientNumber: string
  outpatientNumber: string
  clinicalDiagnosis: string
}

export interface AuxiliaryExams {
  ct: string
  ecg: string
  xray: string
  labResults: string
  ultrasound: string
  other: string
}

export interface SPECTReportData {
  medicalHistory: string
  auxiliaryExams: AuxiliaryExams
  clinicalDiagnosis: string
  requestedExams: string[]
  otherExams: string
  examPurpose: string
  aiFindings?: string
  aiDiagnosis?: string
  confidence?: number
  bodyPart?: string
  abnormality?: string
}

export interface DoctorInfo {
  reportDoctor: string
  reviewDoctor: string
  department: string
}

export interface HospitalInfo {
  name: string
  department: string
  address: string
}