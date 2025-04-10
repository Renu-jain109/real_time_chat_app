import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }
  authService = inject(AuthService); // Inject AuthService
  loggedIn: boolean = false; // Login status


  ngOnInit(): void {
    // Set login status on load
    if (this.authService.isAuthenticated()) {
      this.loggedIn = true;
    }
  };

  logout() {
    this.authService.logout(); // Logout function
    this.loggedIn = false; // Update login status
  };

};
