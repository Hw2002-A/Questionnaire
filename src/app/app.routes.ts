import { Routes } from '@angular/router';
import { FrontComponent } from './front/front.component';
import { ListComponent } from './front/list/list.component';
import { PreviewComponent } from './front/preview/preview.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BackstageComponent } from './backstage/backstage.component';

export const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'front', component: FrontComponent},
  {path:'list',component:ListComponent},
  {path:'preview',component:PreviewComponent},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'backstage',component:BackstageComponent},

  { path: 'quiz/:id', component: FrontComponent },
];
