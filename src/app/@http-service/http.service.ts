import { AnswerDataService } from './../@service/answer-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from '../@interface/interface.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
apiUrl = "http://localhost:8080/quiz";
  constructor(private http:HttpClient, private answerDataService:AnswerDataService) { }

  // 新增一個共用的方法 名稱為getApi
  // 並且呼叫方法時需要輸入一個值(api的url)
  // 方法內會去呼叫httpClient當中的get方法，並且把url帶入
  getApi(url:string):any {
    return this.http.get(url);
  }
  postApi(url:string,postData:any){
    return this.http.post(url,postData);
  }
  putApi(url:string,putData:any){
    return this.http.post(url,putData);
  }
  // 拿來刪除全部資料的
  delApi(url:string){
    return this.http.delete(url);
  }
  postAccount(account:String, password:String){
    const body = {account, password};
    return this.http.post("http://localhost:8080/quiz_login", body);
  }
  postSignAccount(account:String, password:String){
    const body = {account, password};
    return this.http.post("http://localhost:8080/add_info", body);
  }
  postQuestion(data:Array<Quiz>){
    const requestBody = {
    quiz: {
      title: this.answerDataService.inquesData[0].title,
      description: this.answerDataService.inquesData[0].description,
      startDate: this.answerDataService.inquesData[0].startDate,
      endDate: this.answerDataService.inquesData[0].endDate,
      publish: this.answerDataService.inquesData[0].publish
    },
    questionVoList: this.answerDataService.inquesData[0].options
  };
    console.log(requestBody);

    return this.http.post("http://localhost:8080/quiz/create", requestBody);
  }




}
