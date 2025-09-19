import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogComponent } from '../Dialog/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AnswerDataService } from '../@service/answer-data.service';

@Component({
  selector: 'app-backstage',
  imports: [MatTabsModule,FormsModule,MatPaginator,MatTableModule,MatCheckboxModule],
  templateUrl: './backstage.component.html',
  styleUrl: './backstage.component.scss'
})
export class BackstageComponent {
  constructor(private answerDataService:AnswerDataService){}
  displayedColumns: string[] = ['select','questId','questName', 'type', 'edit'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  questName!:string;
  questExplan!:string;
  chooseDate!:string;
  endDate!:string;
  tabNumber = 0;
  selection:any;
  questArray:Array<any>=[];
    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    const initialSelection:Array<any> = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<PeriodicElement>(allowMultiSelect, initialSelection);

  }
  nextTab(){
    this.tabNumber = 1;
  }

  addRow(){
    const currentData = this.dataSource.data;
    const maxId = currentData.length > 0 ? Math.max(...currentData.map(d => d.questId)) : 0;
    const questContent:PeriodicElement={
      questId:maxId+1,
      questName:'大俠愛吃漢堡包',
      type:'Q',
      edit:'編輯',
    };
    this.dataSource.data = [...this.dataSource.data, questContent];
  }
  isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

toggleAllRows() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
deleteSelected() {
    const remaining = this.dataSource.data.filter(row => !this.selection.isSelected(row)
    );
    this.dataSource.data = remaining;
    this.selection.clear();
  }
// 這段寫在要顯示dialog的畫面的TS裡
readonly dialog = inject(MatDialog);
showDialog(){
  const dialogRef = this.dialog.open(DialogComponent,{
    width:'1000px'
  });
  dialogRef.afterClosed().subscribe(result=>{
    console.log("Dialog 回傳:", result[0].questId);
    console.log("目前 dataSource:", this.dataSource.data);

     if (result) {
    const quest = {
    questId: result[0].questId,       // 確保數字
    questName: result[0].questName,
    type: result[0].type,
    edit: '編輯'};
    this.dataSource.data = this.dataSource.data.map(row =>
      row.questId === quest.questId ? quest : row
    );
  }
  });
}
}
export interface PeriodicElement {
  questId:number;
  questName:string;
  type:string;
  edit:string;
}
const ELEMENT_DATA: PeriodicElement[] = [];
