import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatRoomComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(private authService: AuthService) { };

  sanitizer = inject(DomSanitizer);
  router = inject(Router);
  toastr = inject(ToastrService);

  newRoomName: string = '';
  chatRooms: any[] = [];

  selectedRoomName: string | null = null;
  selectedRoomId: string = "";
  messageObject: any = { bold: false, italic: false, link: "", text: "" };
  messages: any[] = []; // ✅ Declare without initialization
  userName: string | null | undefined = "";
  linkText: string = "";
  showLinkInput: boolean = false;


  // DOM reference to chat container for scrolling
  @ViewChild('chatContainer') chatContainer!: ElementRef; // ViewChild reference
  autoScroll: boolean = true;

  // Load chat rooms on component initialization
  ngOnInit(): void {
    this.authService.getChatRooms().subscribe((rooms) => {
      // Filter out rooms without valid timestamps
      this.chatRooms = rooms
        .filter(room => room.createdAt?.seconds)
    });
  };

  // Scroll chat to bottom after first view init
  ngAfterViewInit(): void {
    this.scrollToBottom();
  };

  // Auto-scroll chat on new messages
  ngAfterViewChecked(): void {
    if (this.autoScroll) {
      this.scrollToBottom();
    }
  };

  // Create a new chat room
  async createRoom() {
    if (!this.newRoomName.trim()) return;
    try {
      const docRef = await this.authService.createChatRoom(this.newRoomName.trim());
      this.newRoomName = ""; // Clear input after room creation
    } catch (error) {
      this.toastr.error("Error in creating room:");
    }
  };

  // Select a room and load its messages
  selectRoom(roomId: string, name: string) {
    if (!roomId) {
      this.toastr.error("Invalid chat room selected.");
      return;
    }

    this.selectedRoomName = name;
    this.selectedRoomId = roomId;
    this.messages = [];  // Clear previous messages

    // Subscribe to live messages in selected room
    this.authService.getMessages(this.selectedRoomId).subscribe((msgs) => {

      this.messages = msgs;
      this.userName = this.authService.auth.currentUser?.displayName;
      this.autoScroll = true;
      setTimeout(() => this.scrollToBottom(), 0);
    });
  };

  // Scroll chat window to bottom
  scrollToBottom() {
    try {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTo({
          top: this.chatContainer.nativeElement.scrollHeight,
          behavior: 'instant'
        })
      }
    } catch (e) {
      console.error("Scroll error:", e);
    }
  };


  // Send a message in the selected chat room
  async sendMessage() {
    if (!this.messageObject.text.trim()) {
      this.toastr.error("Message cannot be empty.");
      return;
    }

    try {
      await this.authService.sendMessage(this.selectedRoomId, this.messageObject);
      setTimeout(() => this.scrollToBottom(), 0);
      
      // Reset MessageObject
      this.messageObject = {
        bold: false,
        italic: false,
        link: "",
        text: ""
      };

    } catch (error) {
      this.toastr.error("Please select a chat room first.");
      return;
    }
  };


  // Logout and redirect to login page
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
};
