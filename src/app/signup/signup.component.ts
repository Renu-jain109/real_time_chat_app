import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;  // Signup form instance
  formBuilder = inject(FormBuilder); // For building reactive form
  authService = inject(AuthService); // For Firebase signup
  toastr = inject(ToastrService);
  router = inject(Router);


  ngOnInit(): void {
    // Initialize form with validation
    this.signupForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.pattern('^[a-zA-Z. ]+$')]], // Name: only letters/spaces
      email: ['', [Validators.required, Validators.email]], // Email: valid format
      password: ['',
        [Validators.required, // Ensures password is required
        Validators.minLength(6),// Ensures password is at least 6 characters long
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$')]], // Ensures password is at least 1 upper case, 1 number and 1 special character
    },
    );
  };


  // Sign-up method
  signUp() {
    if (this.signupForm.invalid) {
      this.toastr.error("All fields are required and must be valid!");
      return;
    }

    const { displayName, email, password } = this.signupForm.value;

    this.authService.signUp(email, password, displayName)
      .then(() => {
        this.toastr.success("Signup successful");
        this.signupForm.reset();
        this.router.navigate(['/login']); // Redirect after signup
      })
      .catch((error: any) => {
        console.error("Signup error:", error);
        this.toastr.error(error.message || "Signup failed");
        throw error;
      });
  }
}
