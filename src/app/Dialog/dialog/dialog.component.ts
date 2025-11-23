
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
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
  constructor(private answerDataService: AnswerDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  // readonly data = inject<any>(MAT_DIALOG_DATA);

  questId!: number;
  questName!: string;
  type!: Question['type'];
  need: boolean = false;
  options: { optionName: string; code: number }[] = [];

  ngOnInit(): void {
    console.log('dialog data:', this.data);

    console.log(this.answerDataService.questionDataPreview);

    if (this.answerDataService.questionDataPreview.length > 0) {
      const target = this.answerDataService.questionDataPreview.find(
        (q: any) => q.questionId === this.data.questionId
      );

      if (target) {
        this.questId = target.questionId;
        this.questName = target.name;
        this.type = target.type;
        this.need = target.required;
        this.options = target.optionsList;
      }
    }
  }
  onNOClick(): void {
    let returnData = ['questId', 'questName', 'type', 'need', 'options'];
    this.dialogRef.close(returnData);
  }

  safeData(): void {
    this.answerDataService.addQuestionToQuiz(0, {
      questionId: this.questId,
      required: this.need,
      name: this.questName,
      type: this.type,
      optionsList: this.options
    });

    if (!this.answerDataService.questionDataPreview) {
      this.answerDataService.questionDataPreview = [];
    }
    const index = this.answerDataService.questionDataPreview.findIndex(
      q => q.questionId === this.questId
    );
    const newData = {
      questionId: this.questId,
      required: this.need,
      name: this.questName,
      type: this.type,
      optionsList: this.options
    };
    if (index >= 0) {
      // 已存在 → 更新
      this.answerDataService.questionDataPreview[index] = newData;
    } else {
      // 不存在 → 新增
      this.answerDataService.questionDataPreview.push(newData);
    }
    // this.answerDataService.questionDataPreview.push({
    //   questionId: this.questId,
    //   required: this.need,
    //   name: this.questName,
    //   type: this.type,
    //   optionsList: this.options
    // })
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

