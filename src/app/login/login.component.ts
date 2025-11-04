
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnswerDataService } from '../@service/answer-data.service';
import { HttpService } from '../@http-service/http.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private answerDataService: AnswerDataService,
    private httpService: HttpService, private router: Router) { }

  acc!: String;
  pwd!: String;


  adminLogin: boolean = false;

  ngOnInit(): void {
    this.adminLogin = this.answerDataService.adminLogin;
  }
  loginclick() {

    this.httpService.postAccount(this.acc, this.pwd).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.admin == true) {
          alert("登入成功");
          this.router.navigateByUrl('/backstage');
        } else if (res.code === 200 && res.admin == false) {
          alert("登入成功");
          this.router.navigateByUrl('/list');
        }else if (res.code === 400) {
          alert("帳號或密碼錯誤");
        }
      },
      error: (err) => {
        console.error(err);
        alert("伺服器連線錯誤");
      }
    });
  }


}
