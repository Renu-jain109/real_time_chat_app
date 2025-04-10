import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthError } from 'firebase/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  authService = inject(AuthService); // For Firebase login
  toastr = inject(ToastrService);
  router = inject(Router);
  fb = inject(FormBuilder); // For building reactive form
  loginForm!: FormGroup; // Login form instance


  ngOnInit(): void {
    // Form initialization with email and password validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Ensures the email is required and follows email format
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)]] // Password: min 6 chars, 1 uppercase, 1 number, 1 special char

    });
  };

  // Login method
  login() {
    const { email, password } = this.loginForm.value;

    if (this.loginForm.invalid) {
      this.toastr.error('Please fill all the required fields correctly.');
      return;
    }
    // Attempt login with Firebase
    this.authService.login(email, password).then(() => {
      this.toastr.success("Login Successful!");
      this.router.navigate(["/chat/room"]);
      this.clearForm();

    })
      .catch((error: AuthError) => {
        this.toastr.error("Incorrect email or password. Please try again.");
      });
  };

  // Reset form after login
  clearForm() {
    this.loginForm.reset();
  }



}
