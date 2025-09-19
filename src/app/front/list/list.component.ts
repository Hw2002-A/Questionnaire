import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AnswerDataService } from '../../@service/answer-data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-list',
  imports: [RouterOutlet,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  constructor(private answerDataService:AnswerDataService,
    private router:Router,
  ){}
  title = 'Questionnaire';
  displayedColumns: string[] = ['select','position', 'name','height', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  num = 1;
  upDown:boolean=false;
  inputData!:string;
  chooseDate!:string;
  endDate!:string;
  admincreate:boolean = false;
  selection:any;

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
ngOnInit(): void {
  this.admincreate = this.answerDataService.adminLogin;
  const initialSelection:Array<any> = [];
  const allowMultiSelect = true;
  this.selection = new SelectionModel<PeriodicElement>(allowMultiSelect, initialSelection);

    // 排序目前的table資料內容
    // 使用sort函式做排序(需要Array資料才能做排序)
    this.dataSource.data.sort((a,b)=>{
      if(a.position<b.position){
        return -1;
      }else{
        return 1;
      }
      return 0;
    });

    switch(this.num){
      // 符合時執行
      // 需要break跳出
      case(1):
      console.log(1);
      break;
      case(2):
      console.log(2);
      break;
    }
  // let newDate = new Date('2025-09-04');
  // newDate.setDate(newDate.getDate() +30);
  // console.log(newDate);
  }

  adminlogin(){
    this.answerDataService.adminLogin = true;
    this.router.navigate(['/login']);
  }


  powerDown() {
    if(this.upDown == false){
  this.dataSource.data = [...this.dataSource.data.sort((a, b) => a.position - b.position)];
  }else{
    this.dataSource.data = [...this.dataSource.data.sort((a, b) => b.position - a.position)];
  }
   this.upDown=!this.upDown ;
}

changeData(event:any){
    console.log((event.target as HTMLInputElement).value);

    console.log(this.inputData);
    let tidyData:PeriodicElement[] = [];
      for (let data of ELEMENT_DATA){
        if(data.name.indexOf(this.inputData) != -1){
          tidyData.push(data);
        }
      }
  this.dataSource.data = tidyData;}

      /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  height:number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hyd\rogen', height:180, weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', height:180,weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', height:180,weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', height:180,weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', height:180,weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', height:180,weight: 12.0107, symbol: 'C'},
  {position: 8, name: 'Oxygen', height:180,weight: 15.9994, symbol: 'O'},
  {position: 14, name: 'Silicon', height:180,weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', height:180,weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', height:180,weight: 32.065, symbol: 'S'},
  {position: 20, name: 'Calcium', height:180,weight: 40.078, symbol: 'Ca'},
]


