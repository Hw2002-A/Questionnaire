import { feedback } from './../@interface/interface.service';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogComponent } from '../Dialog/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AnswerDataService } from '../@service/answer-data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpService } from '../@http-service/http.service';
import { MatIconModule } from '@angular/material/icon';
import { SimpleDialogComponent } from '../shared/simple-dialog/simple-dialog.component';


@Component({
  selector: 'app-backstage',
  imports: [MatTabsModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    RouterLink, MatIconModule],
  templateUrl: './backstage.component.html',
  styleUrl: './backstage.component.scss'
})
export class BackstageComponent {
  id!: number;
  constructor(private answerDataService: AnswerDataService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute) { }
  feedbackVoList: Array<any> = [];


  // MatTable 欄位名稱
  displayedColumns: string[] = ['select', 'questionId', 'name', 'type', 'edit'];
  dataSource = new MatTableDataSource<PeriodicElement>();


  feedbackColumns: string[] = ['number', 'name', 'fillinDate', 'action'];
  feedbackSource = new MatTableDataSource<feedback>(this.feedbackVoList);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  quizId!: number;
  questName!: string;
  questExplan!: string;
  chooseDate!: string;
  endDate!: string;
  publish!: boolean;
  userNameArray: Array<any> = [];
  isPreview: boolean = false;
  isUpdate: boolean = false;
  // 當前的分頁索引（對應 MatTab）
  tabNumber = 0;
  // selection 用於記錄被勾選的資料列
  selection: any;
  // 存放問卷資料的陣列
  questArray: Array<any> = [];
  // 生命周期：當 View 元件載入完成後設定 paginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // 生命周期：初始化 selection 物件
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('0'));
    console.log(this.id);

    // 接收 tab
    this.route.queryParams.subscribe(params => {
      this.tabNumber = +params['tab'] || 0;
    });

    // 接收 id
    this.route.params.subscribe(p => {
      const id = p['id'];
      console.log('目前問卷 ID:', id);
      this.quizId = id;
       console.log(this.quizId);
    });
    if (this.quizId) {
      this.isPreview = true;
    }
    if (this.quizId) {
      this.http.getApi(`http://localhost:8080/quiz/feedback?quizId=${this.quizId}`).
        subscribe((res: any) => {
          const result = res.feedbackVoList.map((quiz: any, index: number) => ({
            number: index + 1,
            name: quiz.user.name,
            email: quiz.user.email,
            fillinDate: quiz.fillinDate
          }));
          this.feedbackSource.data = result;

          console.log(this.feedbackVoList);
        });
    }
    if (this.answerDataService.inquesData?.length) {
      this.isUpdate = true;
      const title = this.answerDataService.inquesData.map(res => res.title);
      const startDate = this.answerDataService.inquesData.map(res => res.startDate);
      const endDate = this.answerDataService.inquesData.map(res => res.endDate);
      const description = this.answerDataService.inquesData.map(res => res.description);
      const publish = this.answerDataService.inquesData.map(res => res.publish);
      this.questName = title[0];
      this.chooseDate = startDate[0];
      this.endDate = endDate[0];
      this.questExplan = description[0];
      this.publish = publish[0];
      this.dataSource.data = [...this.answerDataService.questionDataPreview];
    }

    const initialSelection: Array<any> = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<PeriodicElement>(allowMultiSelect, initialSelection);

  }
  // 切換至下一個分頁 (tab)
  nextTab() {
    if(this.questName == null){
      this.showAlert('尚未填寫完成！');
      return;
    }
    this.answerDataService.addQuestion({
      title: this.questName,
      startDate: this.chooseDate,
      endDate: this.endDate,
      description: this.questExplan,
      publish: this.publish,
      options: []
    });
    this.tabNumber = 1;
    console.log(this.answerDataService.inquesData);
  }
  // 新增一筆問卷資料到表格中
  addRow() {
    const currentData = this.dataSource.data;
    // 找出目前最大 questId，並自動遞增
    const maxId = currentData.length > 0 ? Math.max(...currentData.map(d => d.questionId)) : 0;
    // 建立新的問卷資料物件
    const questContent: PeriodicElement = {
      questionId: maxId + 1,
      name: "未編輯",
      type: '未編輯',
    };
    // 更新表格資料（建立新的陣列以觸發 Angular 變更檢測）
    this.dataSource.data = [...this.dataSource.data, questContent];
  }
  // 檢查是否所有列都被選取
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }
  // 全選或取消全選
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  // 刪除被選取的列
  deleteSelected() {
    const selectedIds = this.selection.selected.map((row: any) => row.questionId);
    const remaining = this.dataSource.data.filter(item => !selectedIds.includes(item.questionId));
    this.dataSource.data = remaining;
    this.answerDataService.questionDataPreview = this.dataSource.data;
    console.log(this.dataSource.data);
    console.log(this.answerDataService.questionDataPreview);
    this.selection.clear();
  }



  // 這段寫在要顯示dialog的畫面的TS裡
  // MatDialog 依賴注入（顯示彈出視窗用）
  readonly dialog = inject(MatDialog);
  // 顯示對話框 DialogComponent
  showDialog(questionId: number) {
    console.log(questionId);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '1000px',
      data: {
        questionId: questionId
      }
    });
    // 訂閱對話框關閉事件，接收回傳資料
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.answerDataService.questionDataPreview];
      }


      console.log("目前 dataSource:", this.dataSource.data);

    });

  }



  submitAllQuestions() {
    if(this.answerDataService.questionDataPreview.length == 0){
      this.showAlert('尚未填寫完成！');
      return;
    }
    console.log("資料內容:", this.answerDataService.inquesData);
    this.http.postQuestion(this.answerDataService.inquesData).subscribe({
      next: (res: any) => {
        console.log("送出成功", res);
        this.showAlert('送出成功！');

      },
      error: (err) => {
        console.error(err);
        this.showAlert('送出失敗！');

      }
    });
  }

  updateAllQuestions() {

    this.answerDataService.inquesData[0].id = this.id;
    this.http.postUpdate(this.answerDataService.inquesData).subscribe({
      next: (res: any) => {
        console.log("送出成功", res);
        this.showAlert('送出成功！');

      },
      error: (err) => {
        console.error(err);
        this.showAlert('送出失敗！');

      }
    });

  }

  goToResult(email: string) {
    const urlTree = this.router.createUrlTree(
      ['/userfeedback', this.quizId],
      { queryParams: { email: email, preview: true } }
    );
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }
showAlert(message: string, title?: string) {
  this.dialog.open(SimpleDialogComponent, {
    width: '420px',
    data: {
      title: title || '提示',
      message,
      type: 'info'
    },
    panelClass: 'custom-dialog-container'
  });
}
} 
// 問卷資料的型別定義
export interface PeriodicElement {
  questionId: number,
  name: string,
  type: string,
}
// 初始空資料

