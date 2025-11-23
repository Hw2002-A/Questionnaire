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

  constructor() {
    // App 初始化時嘗試還原狀態
    const saved = localStorage.getItem('isAdmin');
    this.adminLogin = saved === 'true';
  }

  setAdminLogin(status: boolean) {
    this.adminLogin = status;
    localStorage.setItem('isAdmin', String(status));
  }

  isAdminLogin(): boolean {
    return this.adminLogin;
  }

  logout() {
    this.adminLogin = false;
    localStorage.removeItem('isAdmin');
  }




  questData: QuizFromDb[] = [];
  answerDataPreview: any;

  inquesData: Quiz[] = [];

  questionDataPreview:Array<any> = [];

  addQuestion(q: Quiz) {
    if (this.inquesData.length > 0) {
      this.inquesData[0] = q;
    } else {
      this.inquesData.push(q);
    }
  }

  addQuestionToQuiz(quizIndex: number, question: Question) {
    this.inquesData[quizIndex].options.push(question);
  }





}
