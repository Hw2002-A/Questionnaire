// Angular Component 與常用模組
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { AnswerDataService } from '../../@service/answer-data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpService } from '../../@http-service/http.service';
import { QuizFromDb } from '../../@interface/interface.service';
import { CommonModule } from '@angular/common';

// ---------------- Component 設定區 ----------------
@Component({
  selector: 'app-list',
  // 匯入 Angular Material 與 Router 模組
  imports: [
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  // ---------------- 依賴注入 (DI) ----------------
  constructor(
    private answerDataService: AnswerDataService, // 問卷資料服務
    private router: Router, // Router 用來跳轉頁面
    private http: HttpService
  ) { }

  // ---------------- 變數定義區 ----------------
  quizList: QuizFromDb[] = [];
  title = 'Questionnaire'; // 頁面標題
  displayedColumns: string[] = ['select', 'id', 'title', 'status', 'startDate', 'endDate', 'action']; // 表格欄位
  dataSource = new MatTableDataSource<QuizFromDb>(this.quizList); // 表格資料來源 (Material Table)
  @ViewChild(MatPaginator) paginator!: MatPaginator; // 分頁元件

  num = 1; // 測試用數字 (switch範例)
  upDown: boolean = false; // 排序方向控制 true=desc false=asc
  inputData!: string; // 搜尋框輸入的文字
  chooseDate!: string; // 選擇的日期
  endDate!: string; // 結束日期
  admincreate: boolean = false; // 是否為管理員模式
  selection: any; // 選取模型 (SelectionModel)
  findData:any;
  findQuestion:any;
  // ---------------- 生命週期鉤子 (LifeCycle Hook) ----------------
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    if (this.answerDataService.isAdminLogin()) {
      console.log('目前是管理員登入');
      this.displayedColumns.push('publish');
      this.http.getApi('http://localhost:8080/quiz/list').
        subscribe((res: any) => {
          this.quizList = res.quizList.map((quiz: any) => {
            const now = new Date();
            const start = new Date(quiz.startDate);
            const end = new Date(quiz.endDate);

            // 判斷現在時間是否在區間內
            let status: string;
            if (now < start) {
              status = '未開始';
            } else if (now > end) {
              status = '已截止';
            } else {
              status = '進行中';
            }
            return {
              ...quiz,
              status: status  // 新增 status 屬性
            };
          });
          this.answerDataService.questData = res.quizList;
          this.dataSource.data = this.quizList;
        });
      this.admincreate = this.answerDataService.adminLogin;
    } else {
      console.log('一般使用者');
      this.http.getApi('http://localhost:8080/quiz/publish_list').
        subscribe((res: any) => {
          this.quizList = res.quizList.map((quiz: any) => {
            const now = new Date();
            const start = new Date(quiz.startDate);
            const end = new Date(quiz.endDate);

            // 判斷現在時間是否在區間內
            let status: string;
            if (now < start) {
              status = '未開始';
            } else if (now > end) {
              status = '已截止';
            } else {
              status = '進行中';
            }
            return {
              ...quiz,
              status: status  // 新增 status 屬性
            };
          });
          this.answerDataService.questData = res.quizList;
          this.dataSource.data = this.quizList;
        });
    }

    // 初始化選擇模型 (可多選)
    const initialSelection: Array<any> = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<QuizFromDb>(allowMultiSelect, initialSelection);

    // 對表格資料依 position 欄位做排序 (升冪)
    this.dataSource.data.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      } else {
        return 1;
      }
    });

    //  switch 範例邏輯
    // switch (this.num) {
    //   case 1:
    //     console.log(1);
    //     break;
    //   case 2:
    //     console.log(2);
    //     break;
    // }

    // 範例: 計算日期
    // let newDate = new Date('2025-09-04');
    // newDate.setDate(newDate.getDate() + 30);
    // console.log(newDate);
  }

  // ---------------- 事件處理函式區 ----------------

  // 🔹 管理員登入事件：開啟登入頁面
  adminlogin() {
    this.router.navigate(['/login']);
  }

  adminlogout() {
    this.answerDataService.setAdminLogin(false);
    this.answerDataService.logout();
    this.router.navigate(['/login']);
  }
  // 🔹 上下排序按鈕：依 position 欄位切換排序方向
  powerDown() {
    if (this.upDown == false) {
      // 升冪排序
      this.dataSource.data = [...this.dataSource.data.sort((a, b) => a.id - b.id)];
    } else {
      // 降冪排序
      this.dataSource.data = [...this.dataSource.data.sort((a, b) => b.id - a.id)];
    }
    this.upDown = !this.upDown; // 切換排序狀態
  }

  // 🔹 搜尋功能：依據輸入關鍵字過濾表格資料
  changeData(event: any) {
    console.log((event.target as HTMLInputElement).value);
    console.log(this.inputData);

    let tidyData: QuizFromDb[] = [];

    // 遍歷原始資料陣列
    for (let data of this.quizList) {
      // 若名稱包含輸入字串，加入 tidyData
      if (data.title.indexOf(this.inputData) != -1) {
        tidyData.push(data);
      }
    }
    // 更新表格顯示
    this.dataSource.data = tidyData;
  }

  // ---------------- 選取控制相關函式 ----------------

  /** 檢查是否全選 */
  isAllSelected() {
    const unpublishedRows = this.dataSource.data.filter(d => !d.publish);
    // const numRows = this.dataSource.data.length;
    return unpublishedRows.length > 0 && unpublishedRows.every(row => this.selection.isSelected(row));
  }

  /** 若未全選 → 全選；若已全選 → 清空選取 */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.clear(); // 先清空
      this.dataSource.data.forEach(row => {
        if (!row.publish) {
          this.selection.select(row); // 只選未發布的
        }
      });
    }
  }
  deleteQuiz(): void {
    const selectedIds = this.selection.selected.map((row: any) => row.id);
    const deleteData = {
      quizIdList: selectedIds
    };
    console.log('目前選取的列 ID:', deleteData);
    this.http.postApi('http://localhost:8080/quiz/delete', deleteData).subscribe({
      next: (res: any) => {
        console.log("刪除成功", res);
      },
      error: (err) => {
        console.error(err);
        alert("伺服器連線錯誤");
      }
    });
  }
  updateQuiz(): void {
    const selectedIds = this.selection.selected.map((row: any) => row.id);
    this.http.getApi('http://localhost:8080/quiz/list').
      subscribe((res: any) => {
        this.findData = res.quizList.find((item: { id: any; }) => item.id === selectedIds[0]);
        console.log(this.findData);
      })
      this.http.getApi(`http://localhost:8080/quiz/question_list?quizId=${selectedIds[0]}`).
      subscribe((res: any) => {
        this.findQuestion = res.questionVoList;
        console.log(this.findQuestion);
      })
      setTimeout(() => this.updateFindData(), 500);

  }

  updateFindData(){
    const selectedIds = this.selection.selected.map((row: any) => row.id);
    this.answerDataService.addQuestion({
      title: this.findData.title,
      startDate: this.findData.startDate,
      endDate: this.findData.endDate,
      description: this.findData.description,
      publish: this.findData.publish,
      options: []
    });
    this.answerDataService.questionDataPreview = this.findQuestion;
    console.log(this.answerDataService.inquesData);

    this.router.navigate(['/backstage', selectedIds]);
  }

  goToQuiz(id: number) {
    this.router.navigate(['/quiz', id]);
  }
  goToResult(id: number) {
    if (this.admincreate == false) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/statistic', id]));
      window.open(url, '_blank');
    } else {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/statistic', id]));
      window.open(url, '_blank');
      
      this.router.navigate(['/userstatistic', id], { queryParams: { tab: 2 } });

    }
  }

  searchByDate() {
    if (this.answerDataService.isAdminLogin()) {
      const data = {
        title: this.inputData,
        startDate: this.chooseDate,
        endDate: this.endDate,
        getPublish: false
      }
      this.http.postApi("http://localhost:8080/quiz/search", data)
        .subscribe((res: any) => {
          this.quizList = res.quizList.map((quiz: any) => {
            const now = new Date();
            const start = new Date(quiz.startDate);
            const end = new Date(quiz.endDate);
            // 判斷現在時間是否在區間內
            let status: string;
            if (now < start) {
              status = '未開始';
            } else if (now > end) {
              status = '已截止';
            } else {
              status = '進行中';
            }
            return {
              ...quiz,
              status: status  // 新增 status 屬性
            };
          });
          this.dataSource.data = this.quizList;
        });
    } else {
      const data = {
        title: this.inputData,
        startDate: this.chooseDate,
        endDate: this.endDate,
        getPublish: true
      }
      this.http.postApi("http://localhost:8080/quiz/search", data)
        .subscribe((res: any) => {
          this.quizList = res.quizList.map((quiz: any) => {
            const now = new Date();
            const start = new Date(quiz.startDate);
            const end = new Date(quiz.endDate);
            // 判斷現在時間是否在區間內
            let status: string;
            if (now < start) {
              status = '未開始';
            } else if (now > end) {
              status = '已截止';
            } else {
              status = '進行中';
            }
            return {
              ...quiz,
              status: status  // 新增 status 屬性
            };
          });
          this.dataSource.data = this.quizList;
        });
    }

  }

}


