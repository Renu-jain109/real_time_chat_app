import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router){};

  ngOnInit(): void {
  }



  joinChat(){
    if(localStorage.getItem("idToken")){
      this.router.navigate(['/chat/room'])
    }else{
      this.router.navigate(['/']);
      // window.location.href="/"
      window.location.reload();
    }
    }

}
