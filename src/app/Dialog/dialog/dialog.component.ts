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
  type!:string;
  need:boolean=false;
  options:{optionName:string;code:number}[]= [];
  questArray:{questId:number;questName:string;type:string;need:boolean;options:Array<any>}[] = [];

onNOClick():void{
  let returnData = ['ada','adadas'];
  this.dialogRef.close(returnData);
}
safeData():void{
  this.questArray.push({
    questId:Number(this.questId),
    questName:this.questName,
    type:this.type,
    need:this.need,
    options:this.options
  });
  this.answerDataService.inquesData = this.questArray;
  this.dialogRef.close(this.questArray);
}

readonly dialog = inject(MatDialog);
addOption() {
    const nextCode = this.options.length + 1;
    this.options.push({
      code: nextCode,
      optionName: ''
    });
  }
   saveOptions() {
    console.log('目前選項:', this.options);
  }
}
