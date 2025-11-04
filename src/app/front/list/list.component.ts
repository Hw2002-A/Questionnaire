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
    RouterLink
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  // ---------------- 依賴注入 (DI) ----------------
  constructor(
    private answerDataService: AnswerDataService, // 問卷資料服務
    private router: Router, // Router 用來跳轉頁面
    private http : HttpService
  ) {}

  // ---------------- 變數定義區 ----------------
  quizList: QuizFromDb[] = [];
  title = 'Questionnaire'; // 頁面標題
  displayedColumns: string[] = ['select', 'id', 'title', 'publish', 'startDate', 'endDate','action']; // 表格欄位
  dataSource = new MatTableDataSource<QuizFromDb>(this.quizList); // 表格資料來源 (Material Table)
  @ViewChild(MatPaginator) paginator!: MatPaginator; // 分頁元件

  num = 1; // 測試用數字 (switch範例)
  upDown: boolean = false; // 排序方向控制 true=desc false=asc
  inputData!: string; // 搜尋框輸入的文字
  chooseDate!: string; // 選擇的日期
  endDate!: string; // 結束日期
  admincreate: boolean = false; // 是否為管理員模式
  selection: any; // 選取模型 (SelectionModel)

  // ---------------- 生命週期鉤子 (LifeCycle Hook) ----------------
  ngAfterViewInit() {
    // 初始化分頁器
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.http.getApi('http://localhost:8080/quiz/list').
    subscribe((res: any) =>{
      this.quizList = res.quizList;
      this.answerDataService.questData = res.quizList;
      this.dataSource.data = this.quizList;
      console.log(res.quizList);

    });


    // 判斷目前是否為管理員登入狀態
    this.admincreate = this.answerDataService.adminLogin;

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
    this.answerDataService.adminLogin = true;
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
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** 若未全選 → 全選；若已全選 → 清空選取 */
  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  goToQuiz(id:number){
    this.router.navigate(['/quiz',id]);
  }
}

// ---------------- 介面與假資料 ----------------

// 表格每列的資料結構定義


// 假資料：化學元素表
// const ELEMENT_DATA: QuizFromDb[] = [
//   { position: 1, name: 'Hydrogen', height: 180, weight: 1.0079, symbol: 'H' },
//   { position: 2, name: 'Helium', height: 180, weight: 4.0026, symbol: 'He' },

// ];
