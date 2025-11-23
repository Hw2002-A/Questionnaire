import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnswerDataService } from '../../@service/answer-data.service';
import { Location } from '@angular/common';
import { HttpService } from '../../@http-service/http.service';
import { SimpleDialogComponent } from '../../shared/simple-dialog/simple-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-preview',
  imports: [FormsModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  preview: boolean = false;
  questionData: any;
  email: string | null | undefined;
  targetFeedback: any;
  constructor(private answerDataService: AnswerDataService,
    private router: Router,
    private location: Location,
    private http: HttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  quest: any = null;
  newquesArray: Array<any> = [];

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.preview = this.route.snapshot.queryParamMap.get('preview') === 'true'
    console.log('quizId:', quizId, 'email:', this.email, 'preview:', this.preview);
    if (this.preview) {
      this.http.getApi(`http://localhost:8080/quiz/feedback?quizId=${quizId}`)
        .subscribe((res: any) => {
          const feedbackVoList = res.feedbackVoList;
         const result = feedbackVoList.find((f: any) => f.user.email === this.email);
          this.targetFeedback = result;
        });
        setTimeout(() => this.createCharts(), 1000);
    } else {
      this.quest = this.answerDataService.answerDataPreview;
      console.log(this.quest);

      for (let ques of this.quest.answerList) {
        this.newquesArray.push({ ...ques });
      }
    }

  }

  createCharts(): void {
    console.log(this.targetFeedback);
    if (this.targetFeedback) {
        const answers = this.targetFeedback.questionVoList.map((q:  any) => ({
          ...q
        }));
        console.log(answers);
        this.newquesArray  = answers;
      }
     this.quest = { ...this.targetFeedback.quiz, ...this.targetFeedback.user };
    console.log( this.quest);

  }

  cancelButton() {
    this.location.back();
  }
  putButton() {
    const clearList = this.quest.answerList.map((ans: any) => {
      return {
        questionId: ans.questionId,
        textAnswer: ans.Answer,
        radioAnswer: ans.radioAnswer ? +ans.radioAnswer : null,
        optionsList: ans.optionsList
      }
    });
    const data = {
      quizId: this.quest.quizId,
      user: {
        name: this.quest.name,
        phone: this.quest.phone,
        email: this.quest.email,
        age: this.quest.age,
        gender: ""
      },
      answerList: clearList
    }
    console.log("data", data);

    this.http.postApi("http://localhost:8080/quiz/fillin", data).subscribe({
      next: (res: any) => {
        console.log("送出成功", res);
        this.router.navigate(['/list']);
        this.showAlert('送出成功！');
      },
      error: (err) => {
        console.error(err);
        this.showAlert('送出失敗');

      }
    });
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
