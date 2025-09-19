import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnswerDataService } from '../@service/answer-data.service';


@Component({
  selector: 'app-front',
  imports: [FormsModule, RouterLink],
  templateUrl: './front.component.html',
  styleUrl: './front.component.scss'
})
export class FrontComponent {
  constructor(private answerDataService:AnswerDataService,
    private router:Router
  ){}
  newquesArray:Array<any> = [];
  // 多選M 單選Q 文字輸入T
  quest = {
    id: 1,
    title: '範例問卷標題',
    sDate: '2024/11/06',
    eDate: '2024/12/23',
    explain: '5555555555555555555',
    questArray: [
      {
        questId: 1,
        need: true,
        questName: '請選擇最喜歡的運動',
        type: 'M',
        options: [
          { optionName: '籃球', code: 'A' },
          { optionName: '足球', code: 'B' },
          { optionName: '桌球', code: 'C' },
        ]
      },
      {
        questId: 2,
        need: true,
        questName: '請選擇最喜歡的運動員',
        type: 'Q',
        options: [
          { optionName: '梅西', code: 'A' },
          { optionName: '內馬爾', code: 'B' },
          { optionName: '鈴木一郎', code: 'C' },
        ]
      },
      {
        questId: 3,
        need: false,
        questName: '請輸入你想跟他們說的話',
        type: 'T',
        options: []
      },
      {
        questId: 4,
        need: false,
        questName: '請選擇最喜歡的運動員2',
        type: 'Q',
        options: [
          { optionName: '梅西', code: 'A' },
          { optionName: '內馬爾', code: 'B' },
          { optionName: '鈴木一郎', code: 'C' },
        ]
      },
      {
        questId: 5,
        need: true,
        questName: '請選擇最喜歡的運動2',
        type: 'M',
        options: [
          { optionName: '籃球', code: 'A' },
          { optionName: '足球', code: 'B' },
          { optionName: '桌球', code: 'C' },
        ]
      },
    ]
  }
  title!:string;
  sDate!:string;
  eDate!:string;
  explain!:string;
  userName!:string;
  userPhone!:string;
  userEmail!:string;
  userAge!:string;


  ngOnInit(): void {
    this.title = this.quest.title;
    this.sDate = this.quest.sDate;
    this.eDate = this.quest.eDate;
    this.explain = this.quest.explain;

    if(!this.answerDataService.questData){
      this.tidArray();
    }else{
      this.title = this.answerDataService.questData.title;
      this.sDate = this.answerDataService.questData.sDate;
      this.eDate = this.answerDataService.questData.eDate;
      this.explain = this.answerDataService.questData.explain;
      this.userName = this.answerDataService.questData.userName;
      this.userAge = this.answerDataService.questData.userAge;
      this.userEmail = this.answerDataService.questData.userEmail;
      this.userPhone = this.answerDataService.questData.userPhone;
      this.newquesArray = this.answerDataService.questData.questArray;
    }
  }

    tidArray(){
      for(let ques of this.quest.questArray){
      this.newquesArray.push({...ques, Answer:'',radioAnswer:''});
      }
    for(let opsArray of this.newquesArray){
      let opts = [];
      for(let opt of opsArray.options){
        opts.push({...opt,checkboolean:false});
      }
      opsArray.options =opts;
      }
      console.log(this.newquesArray);

     }
    Preview(){
      if(this.checkNeed()){
    this.answerDataService.questData ={
      title:this.quest.title,
      sDate:this.quest.sDate,
      eDate:this.quest.eDate,
      explain:this.quest.explain,
      userName:this.userName,
      userAge:this.userAge,
      userEmail:this.userEmail,
      userPhone:this.userPhone,
      questArray:this.newquesArray,
    }
     console.log(this.answerDataService.questData);
     this.router.navigate(['/preview']);
    };

    }
     checkNeed():boolean{
      if (!this.userName || !this.userPhone){
        alert('請輸入完全')
        return false;
      };
       for (let ques of this.newquesArray){
        if(ques.need){
          if (ques.type == 'M'){
            let check = false;
            for(let ops of ques.options){
                if(ops.checkboolean){
                  check = true;
                }
            }
            if(!check){
              alert('請輸入完全')
              return false;
            }
          }else if(ques.type == 'Q'){
            if(!ques.radioAnswer){
              alert('請輸入完全')
              return false;
            }
          }else if(ques.type == 'T'){
            if(!ques.Answer){
              alert('請輸入完全')
              return false;
            }
          }
        }
       }
       return true;
     }
  }



