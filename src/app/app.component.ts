import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Questionnaire';
  displayedColumns: string[] = ['position', 'name','height', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  num = 1;
  upDown:boolean=false;
  inputData!:string;
  chooseDate!:string;
  endDate!:string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
ngOnInit(): void {
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
  {position: 17, name: 'Chlorine', height:180,weight: 35.453, symbol: 'Cl'},
  {position: 19, name: 'Potassium', height:180,weight: 39.0983, symbol: 'K'},
  {position: 9, name: 'Fluorine', height:180,weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', height:180,weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', height:180,weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', height:180,weight: 24.305, symbol: 'Mg'},
  {position: 14, name: 'Silicon', height:180,weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', height:180,weight: 30.9738, symbol: 'P'},
  {position: 17, name: 'Chlorine', height:180,weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', height:180,weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', height:180,weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', height:180,weight: 40.078, symbol: 'Ca'},
]
