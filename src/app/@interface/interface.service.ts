export interface Quiz {
  id?:number;
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  publish: boolean,
  options: Question[]
}
export interface Question {
  questionId: number,
  required: boolean,
  name: string,
  type: 'S' | 'M' | 'T',
  optionsList: { optionName: string, code: number }[]
}

export interface QuizFromDb{
  id:number,
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  status:string,
  publish: boolean
}

export interface Preview{
  quiz_id:number,
  question_id:number;
}


export interface feedback{
 name:string,
 fillinDate:string,

}
