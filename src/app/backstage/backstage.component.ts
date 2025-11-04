import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogComponent } from '../Dialog/dialog/dialog.component';
import { MatDialog} from '@angular/material/dialog';
import { AnswerDataService } from '../@service/answer-data.service';
import {  RouterLink } from '@angular/router';
import { HttpService } from '../@http-service/http.service';

@Component({
  selector: 'app-backstage',
  // 匯入需要的 Angular Material 模組與表單模組
  imports: [MatTabsModule, FormsModule, MatTableModule, MatCheckboxModule, RouterLink],
  templateUrl: './backstage.component.html',
  styleUrl: './backstage.component.scss'
})
export class BackstageComponent {
  // 建構子：注入後端資料服務 (AnswerDataService)
  constructor(private answerDataService: AnswerDataService, private http: HttpService) { }
  // MatTable 欄位名稱
  displayedColumns: string[] = ['select', 'questId', 'questName', 'type', 'edit'];
  // 表格資料來源，預設為空陣列
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // 取得 MatPaginator 元件的實例，用於分頁
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // 問卷相關欄位
  questName!: string;
  questExplan!: string;
  chooseDate!: string;
  endDate!: string;
  publish!:boolean;
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
    const initialSelection: Array<any> = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<PeriodicElement>(allowMultiSelect, initialSelection);

  }
  // 切換至下一個分頁 (tab)
  nextTab() {
    this.answerDataService.addQuestion({
      title: this.questName,
      startDate: this.chooseDate,
      endDate: this.endDate,
      description: this.questExplan,
      publish: this.publish,
      options: []
    });
  this.tabNumber = 1;
  }
  // 新增一筆問卷資料到表格中
  addRow() {
    const currentData = this.dataSource.data;
    // 找出目前最大 questId，並自動遞增
    const maxId = currentData.length > 0 ? Math.max(...currentData.map(d => d.questId)) : 0;
    // 建立新的問卷資料物件
    const questContent: PeriodicElement = {
      questId: maxId + 1,
      questName: "未編輯",
      type: '未編輯',
      edit: '編輯',
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
    // 過濾掉被選取的列
    const remaining = this.dataSource.data.filter(row => !this.selection.isSelected(row)
    );
    // 更新資料表內容
    this.dataSource.data = remaining;
    // 清空選取
    this.selection.clear();
  }
  // 這段寫在要顯示dialog的畫面的TS裡
  // MatDialog 依賴注入（顯示彈出視窗用）
  readonly dialog = inject(MatDialog);
  // 顯示對話框 DialogComponent
  showDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '1000px'
    });
    // 訂閱對話框關閉事件，接收回傳資料
    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog 回傳:", result);
      console.log("目前 dataSource:", this.dataSource.data);
      // 若有回傳資料則更新表格中對應的列
      if (result) {
        const quest = {
          questId: result[0].questId,       // 確保數字
          questName: result[0].questName,
          type: result[0].type,
          edit: '編輯'
        };
        // 用 map 更新對應 questId 的列
        this.dataSource.data = this.dataSource.data.map(row =>
          row.questId === quest.questId ? quest : row
        );
      }
    });
  }

  submitAllQuestions(){
    console.log("資料內容:", this.answerDataService.inquesData);
    this.http.postQuestion(this.answerDataService.inquesData).subscribe({
      next: (res: any) => {
        console.log("送出成功", res);
      },
     error: (err) => {
        console.error(err);
        alert("伺服器連線錯誤");
     }
      });
    }
}
// 問卷資料的型別定義
export interface PeriodicElement {
  questId: number;
  questName: string;
  type: string;
  edit: string;
}
// 初始空資料
const ELEMENT_DATA: PeriodicElement[] = [];
