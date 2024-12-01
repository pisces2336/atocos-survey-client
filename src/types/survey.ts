export interface Survey {
  userId: string
  title: string
  description: string
  questions: Question[]
}

export interface Question {
  displayOrder: number
  type: 'SingleSelection' | 'MultipleSelection' | 'FreeText'
  questionaire: string
  options: Option[]
}

export interface Option {
  label: string
}
