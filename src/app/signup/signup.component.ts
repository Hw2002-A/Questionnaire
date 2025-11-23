import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnswerDataService } from '../@service/answer-data.service';
import { HttpService } from '../@http-service/http.service';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from '../shared/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private dialog: MatDialog,
    private httpService: HttpService, private router: Router) { }

  userName!: String;
  userAccount!: String;
  userPwd!: String;

  signUpClick() {
    this.httpService.postSignAccount(this.userAccount, this.userPwd).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.showAlert('註冊成功！');
          this.router.navigateByUrl('/login');
        } else if (res.code === 400) {
          alert("無效的帳號或密碼");
        }
      },
      error: (err) => {
        console.error(err);
        this.showAlert('註冊失敗！');

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

