import { Injectable } from '@angular/core';
import { Question, Quiz, QuizFromDb } from '../@interface/interface.service';

@Injectable({
  providedIn: 'root'
})
export class AnswerDataService {
  // questData={
  // title:"",
  // sDate:"",
  // eDate:"",
  // explain:"",
  // userName:"",
  // userPhone:"",
  // userEmail:"",
  // userAge:"",
  // questArray: [] as Array<any>,
  // }
  adminLogin: boolean = false;
  questData: QuizFromDb[] = [];


  inquesData: Quiz[] = [];
  addQuestion(q: Quiz) {
    this.inquesData.push(q);
  }
  addQuestionToQuiz(quizIndex: number, question: Question) {
    this.inquesData[quizIndex].options.push(question);
  }
  constructor() { }
}
