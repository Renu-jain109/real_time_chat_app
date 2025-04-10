import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }; // Inject Router for navigation

  ngOnInit(): void {
  }

  // Navigate user to chat room if logged in, else reload home page
  joinChat() {
    if (localStorage.getItem("idToken")) {
      this.router.navigate(['/chat/room']);  // Redirect to chat room if token exists
    } else {
      this.router.navigate(['/']); // Redirect to home if not authenticated
      window.location.reload(); // Reload the page
    }
  };

}
