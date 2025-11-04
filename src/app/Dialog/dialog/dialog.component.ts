import { Component ,inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,} from '@angular/material/dialog';
import { AnswerDataService } from '../../@service/answer-data.service';
import { Question } from '../../@interface/interface.service';
@Component({
  selector: 'app-dialog',
  imports: [FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  constructor(private answerDataService:AnswerDataService){}
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  questId!:number;
  questName!:string;
  type!: Question['type'];
  need:boolean=false;
  options:{optionName:string;code:number}[]= [];


onNOClick():void{
  let returnData = ['questId','questName','type','need','options'];
  this.dialogRef.close(returnData);
}
safeData():void{
    this.answerDataService.addQuestionToQuiz(0,{
      questionId: this.questId,
      required: this.need,
      name: this.questName,
      type: this.type,
      optionsList: this.options
    });
  this.dialogRef.close(this.answerDataService.inquesData);
}

readonly dialog = inject(MatDialog);
addOption() {
    const nextCode = this.options.length + 1;
    this.options.push({
      code: nextCode,
      optionName: ''
    });
    console.log(this.options);

  }
   saveOptions() {
    console.log('目前選項:', this.options);
  }
}

