import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-front',
  imports: [FormsModule, RouterLink],
  templateUrl: './front.component.html',
  styleUrl: './front.component.scss'
})
export class FrontComponent {
  newquesArray:Array<any> = [];
  opt:Array<any>=[];
  // 多選M 單選Q 文字輸入T
  quest = {
    id: 1,
    title: '範例問卷標題',
    sDate: '2024/11/06',
    eDate: '2024/12/23',
    explain: '問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明\
              問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明\
              問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明\
              問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明',
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
  ngOnInit(): void {
    for(let ques of this.quest.questArray){
      this.newquesArray.push({...ques, answer:'',radioAnswer:''});
    }
    console.log(this.newquesArray);
    for(let opsArray of this.newquesArray){

      for(let opt of opsArray.options){
        this.opt.push({...opsArray,checkboolean:''});
      }
    }
  }

    tidArray(){
      
    }
  }



