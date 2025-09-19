import { Injectable } from '@angular/core';

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
  adminLogin:boolean=false;
  questData: any = null;
  inquesData:any = null;
  constructor() { }
}
