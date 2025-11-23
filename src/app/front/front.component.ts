import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerDataService } from '../@service/answer-data.service';
import { HttpService } from '../@http-service/http.service';
import { SimpleDialogComponent } from '../shared/simple-dialog/simple-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-front',
  imports: [FormsModule],
  templateUrl: './front.component.html',
  styleUrl: './front.component.scss'
})
export class FrontComponent {
  questionData: Array<any> = [];
  quizId!: number;
  title!: string;
  startDate!: string;
  endDate!: string;
  description!: string;
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;

  constructor(private answerDataService: AnswerDataService,
    private router: Router,
    private http: HttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  newquesArray: Array<any> = [];
  // 多選M 單選Q 文字輸入T
  // quest = {
  //   id: 1,
  //   title: '範例問卷標題',
  //   sDate: '2024/11/06',
  //   eDate: '2024/12/23',
  //   explain: '5555555555555555555',
  //   questArray: [
  //     {
  //       questId: 1,
  //       need: true,
  //       questName: '請選擇最喜歡的運動',
  //       type: 'M',
  //       options: [
  //         { optionName: '籃球', code: 'A' },
  //         { optionName: '足球', code: 'B' },
  //         { optionName: '桌球', code: 'C' },
  //       ]
  //     },
  //     {
  //       questId: 2,
  //       need: true,
  //       questName: '請選擇最喜歡的運動員',
  //       type: 'Q',
  //       options: [
  //         { optionName: '梅西', code: 'A' },
  //         { optionName: '內馬爾', code: 'B' },
  //         { optionName: '鈴木一郎', code: 'C' },
  //       ]
  //     },
  //     {
  //       questId: 3,
  //       need: false,
  //       questName: '請輸入你想跟他們說的話',
  //       type: 'T',
  //       options: []
  //     },
  //     {
  //       questId: 4,
  //       need: false,
  //       questName: '請選擇最喜歡的運動員2',
  //       type: 'Q',
  //       options: [
  //         { optionName: '梅西', code: 'A' },
  //         { optionName: '內馬爾', code: 'B' },
  //         { optionName: '鈴木一郎', code: 'C' },
  //       ]
  //     },
  //     {
  //       questId: 5,
  //       need: true,
  //       questName: '請選擇最喜歡的運動2',
  //       type: 'M',
  //       options: [
  //         { optionName: '籃球', code: 'A' },
  //         { optionName: '足球', code: 'B' },
  //         { optionName: '桌球', code: 'C' },
  //       ]
  //     },
  //   ]
  // }



  ngOnInit(): void {
    if(!this.answerDataService.answerDataPreview){
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    const selectedQuiz = this.answerDataService.questData.find(q => q.id === this.quizId)!;
    console.log(selectedQuiz);

    // 呼叫後端 API 取得該問卷的題目
    this.http.getApi(`http://localhost:8080/quiz/question_list?quizId=${this.quizId}`)
    .subscribe((res: any) => {
      this.questionData = res.questionVoList;
      this.newquesArray = this.questionData.map(ques => ({
      ...ques,
      Answer: '',
      radioAnswer: 0
    }));
    console.log(this.newquesArray);
      console.log('載入問卷：', this.questionData);
    });

    this.title = selectedQuiz.title;
    this.startDate = selectedQuiz.startDate;
    this.endDate = selectedQuiz.endDate;
    this.description = selectedQuiz.description;



    }
    else{
      this.quizId =this.answerDataService.answerDataPreview.quizId;
      this.title = this.answerDataService.answerDataPreview.title;
      this.startDate = this.answerDataService.answerDataPreview.startDate;
      this.endDate = this.answerDataService.answerDataPreview.endDate;
      this.description = this.answerDataService.answerDataPreview.description;
      this.userName = this.answerDataService.answerDataPreview.name;
      this.userAge = this.answerDataService.answerDataPreview.age;
      this.userEmail = this.answerDataService.answerDataPreview.email;
      this.userPhone = this.answerDataService.answerDataPreview.phone;
      this.newquesArray = this.answerDataService.answerDataPreview.answerList;
    }
  }

  tidArray() {
    //   for(let ques of this.quest.questArray){
    //   this.newquesArray.push({...ques, Answer:'',radioAnswer:''});
    //   }
    // for(let opsArray of this.newquesArray){
    //   let opts = [];
    //   for(let opt of opsArray.options){
    //     opts.push({...opt,checkBoolean:false});
    //   }
    //   opsArray.options =opts;
    //   }
    //   console.log(this.newquesArray);


  }
  Preview(){
    if(this.checkNeed()){
  this.answerDataService.answerDataPreview ={
    quizId:this.quizId,
    title:this.title,
    startDate:this.startDate,
    endDate:this.endDate,
    description:this.description,
    name:this.userName,
    age:this.userAge,
    email:this.userEmail,
    phone:this.userPhone,
    answerList:this.newquesArray,
  }
   console.log(this.answerDataService.answerDataPreview);
   this.router.navigate(['/preview']);
  };
  }
  // }
  checkNeed(): boolean {
    if (!this.userName || !this.userPhone || this.userEmail ) {
      this.showAlert('請輸入完全');
      return false;
    };
    for (let ques of this.newquesArray) {
      if (ques.required) {
        if (ques.type == 'M') {
          let check = false;
          for (let ops of ques.optionsList) {
            if (ops.checkBoolean) {
              check = true;
            }
          }
          if (!check) {
            this.showAlert('請輸入完全');
            return false;
          }
        } else if (ques.type == 'S') {
          if (!ques.radioAnswer) {
            this.showAlert('請輸入完全');
            return false;
          }
        } else if (ques.type == 'T') {
          if (!ques.Answer) {
            this.showAlert('請輸入完全');
            return false;
          }
        }
      }
    }
    return true;
  }
  showAlert(message: string, title?: string) {
  this.dialog.open(SimpleDialogComponent, {
    width: '420px',
    data: {
      title: title || '提示',
      message,
      type: 'info'
    }
  });
}
}



