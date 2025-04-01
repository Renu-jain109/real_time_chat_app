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

  signupForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      displayName: ['', Validators.required]

    });
  };

  signUp(){

    const {email, password,displayName} = this.signupForm.value;
    

    this.authService.signUp(email,password,displayName,);

    if(this.signupForm.valid){
      this.toastr.success("Sign Up successfully");
      this.signupForm.reset();
      this.router.navigate(['/login']);

    }else{
      this.toastr.error("Please all fields required");
      this.signupForm.reset();
      return;
}
  }


  //  signUp() {

  //   const {username, email, password} = this.signupForm.value;

  //   this.authService.signUp(username,email, password);
  //   if(this.signupForm.valid){
  //     this.toastr.success("Sign Up successfully");
  //     this.signupForm.reset();
  //   }else{
  //     this.toastr.error("Please all fields required");
  //     this.signupForm.reset();
  //     return;
  //   }
  // }

}
