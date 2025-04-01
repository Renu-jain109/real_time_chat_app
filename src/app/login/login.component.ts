import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { idToken } from '@angular/fire/auth';
import { AuthError } from 'firebase/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  loginForm = {
    email: '',
    password: ''
  }
  ngOnInit(): void {
  }

  login() {
    const email = this.loginForm.email.trim();
    const password = this.loginForm.password.trim();

    if (!email || !password) {
      this.toastr.error("Please fill in both fields.");
      return;
    }
    this.authService.login(email, password).then(() => {
      this.toastr.success("Login Successful!");
      this.router.navigate(["/chat/room"]);
      this.clearForm();

    })
      .catch((error: AuthError) => {
        console.error("Full error details:", error);
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);

        this.toastr.error("Incorrect email or password. Please try again.");
      });
  }

  clearForm() {
    this.loginForm.email = "";
    this.loginForm.password = "";
  }



  testToastr() {
    this.toastr.success('Test Toastr', 'Success', {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      toastClass: 'toast-top-right' // Add this line
    });
  }
}
