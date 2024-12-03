export interface Survey {
  userId?: string
  title: string
  description: string
  questions: Question[]
}

export interface Question {
  id?: string
  displayOrder?: number
  type: 'SingleSelection' | 'MultipleSelection' | 'FreeText'
  questionnaire: string
  options: Option[]
}

export interface Option {
  label: string
  displayOrder?: number
}
