
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnswerDataService } from '../@service/answer-data.service';
import { HttpService } from '../@http-service/http.service';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from '../shared/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private answerDataService: AnswerDataService,
    private httpService: HttpService, private router: Router,
  private dialog:MatDialog) { }

  acc!: String;
  pwd!: String;
  adminLogin: boolean = false;

  ngOnInit(): void {

  }
  loginclick() {
    this.httpService.postAccount(this.acc, this.pwd).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.admin == true) {
          this.answerDataService.setAdminLogin(true);
          this.router.navigate(['/backstage'], { queryParams: {adminLogin:true}});
          this.showAlert('登入成功！');
        } else if (res.code === 200 && res.admin == false) {
          this.answerDataService.setAdminLogin(false);
          this.router.navigateByUrl('/list');
        }else if (res.code === 400) {
          this.showAlert('登入失敗！');
        }
      },
      error: (err) => {
        console.error(err);
        this.showAlert('登入失敗！');
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
