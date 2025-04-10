import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, addDoc, collectionData, query, orderBy, getDocs, where, setDoc, doc, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firestore = inject(Firestore);
  auth = inject(Auth);
  router = inject(Router);

  // Register new user
  async signUp(email: string, password: string, displayName: string) {
    try {
      //  Check if username is already taken
      const usersRef = collection(this.firestore, "users");
      const q = query(usersRef, where("displayName", "==", displayName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Username already taken. Please choose another.");
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update user display name
      await updateProfile(user, { displayName });

      // ✅ Wait until auth state is fully ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay


      // Store user in Firestore
      await setDoc(doc(this.firestore, "users", user.uid), {
        uid: user.uid,
        email,
        displayName
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Signup failed. Please try again.");
    }
  };




  // Login user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Store login info in localStorage
      const idToken = await user.getIdToken(true);  // Get the initial ID token

      localStorage.setItem("displayName", user.displayName || "");
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("email", user.email || "");

    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };



  // Create new chat room
  async createChatRoom(name: string) {
    try {
      const chatRoomsRef = collection(this.firestore, 'rooms');
      return await addDoc(chatRoomsRef, {
        name,
        createdAt: serverTimestamp(),
      });

    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  };



  // Get list of chat rooms
  getChatRooms(): Observable<any[]> {
    const chatRoomsRef = collection(this.firestore, 'rooms');
    const q = query(chatRoomsRef, orderBy('createdAt', 'desc')); // sort by latest first

    return collectionData(q, { idField: 'id' });
  };


  // Send a message
  sendMessage(roomId: string, messageObject: any) {
    const messageRef = collection(this.firestore, `rooms/${roomId}/messages`);

    return addDoc(messageRef, {
      textObj: messageObject,
      timestamp: new Date(), // Time Or use serverTimestamp()
      user: this.auth.currentUser?.displayName || 'Anonymous',
    });
  };


  // Listen to messages in real-time
  getMessages(roomId: string): Observable<any[]> {
    if (!roomId) return new Observable(); // Ensure roomId is valid
    const messagesRef = collection(this.firestore, `rooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: "id" }) as Observable<any[]>; // Real-time listener
  };



  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem('idToken');
  };


  // Logout user
  logout() {
    localStorage.clear();
    return signOut(this.auth);
  };
};




