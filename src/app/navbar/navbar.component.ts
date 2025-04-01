import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router){}
  authService = inject(AuthService);
  loggedIn : boolean = true;

 
  ngOnInit(): void {
  }

  logout(){
    this.authService.logout();
    alert("logout");
  }

  }
