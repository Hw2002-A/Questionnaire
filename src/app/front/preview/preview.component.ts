import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnswerDataService } from '../../@service/answer-data.service';
@Component({
  selector: 'app-preview',
  imports: [FormsModule, RouterLink],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
 constructor(private answerDataService:AnswerDataService){}
  quest: any = null;
  newquesArray:Array<any>=[];

 ngOnInit(): void {
  this.quest = this.answerDataService.questData;
 console.log(this.quest.questArray[2].Answer);

  for(let ques of this.quest.questArray){
      this.newquesArray.push({...ques});
      }

 }
}
