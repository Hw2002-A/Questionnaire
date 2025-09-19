import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnswerDataService } from '../@service/answer-data.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private answerDataService:AnswerDataService){}
  adminLogin:boolean=false;

  ngOnInit(): void {
    this.adminLogin = this.answerDataService.adminLogin;
  }
}
