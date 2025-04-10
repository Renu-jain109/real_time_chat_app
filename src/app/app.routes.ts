import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'signup',
        component:SignupComponent
    },
    {
        path:'chat/room',
        component:ChatRoomComponent
    },
    {
        path:'**',
        redirectTo:''
    }
];
