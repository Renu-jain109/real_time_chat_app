import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent implements OnInit {

  constructor(private authService:AuthService){};
  router = inject(Router);
  newRoomName : string = '';
  chatRooms : any [] = [];
  selectedRoom : string | null = null;


  ngOnInit(): void {
    this.authService.getChatRooms().subscribe((rooms)=>{
      // alert("rooms")
      console.log("rooms =",rooms);
      this.chatRooms = rooms;
      console.log("Chat rooms =",this.chatRooms);      
    })

  };


async createRoom() {
  try {

    const roomId = await this.authService.createChatRoom(this.newRoomName);

    console.log("New Room Created:", roomId);
    // this.newRoomName = ""; // Input field reset करें
  } catch (error) {
    console.error("Error in creating room:", error);
  }
}



selectRoom(roomId : string){
  console.log("selected room id",roomId);
  
  this.selectedRoom = roomId;
  console.log(this.selectedRoom);

}



  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
