import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, addDoc,collectionData,  query, orderBy} from '@angular/fire/firestore';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth)
  constructor(private firestore: Firestore) {}


  async signUp(email: string, password: string, displayName: string) {    
    const userCredential = await createUserWithEmailAndPassword(this.auth,email,password);    
    if(userCredential.user){
      await updateProfile(userCredential.user,{displayName});
    }
  };

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("User not found");
      }

      const idToken = await user.getIdToken();  // Get the initial ID token

      // Store the ID token and user email in localStorage
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("email", email);

      // Refresh the token after it's stored
      const refreshedToken = await user.getIdToken(true); // Force refresh the token
      localStorage.setItem("idToken", refreshedToken); // Update the stored token with the refreshed one

      return refreshedToken; // Return the refreshed token  

    } catch (error: any) {
      // Handle Firebase errors directly here and re-throw
      throw error;
    };
  }

  // Create a chat room
 async createChatRoom(name : String){  
  console.log("name =" , name);
  
    const chatRoomsRef = collection(this.firestore,'rooms');
    return await addDoc(chatRoomsRef,{ name });
    
     

  }

// getChatRooms(): Observable<any[]> {

//   const chatRoomsRef = collection(this.firestore, 'rooms');
//   console.log("chatRoomsRef = ",chatRoomsRef);
  
//   return collectionData(chatRoomsRef, { idField: 'id' }); 
// }



getChatRooms(): Observable<any[]> {
  const chatRoomsRef = collection(this.firestore, 'rooms');
  console.log("chatRoomsRef = ", chatRoomsRef);

  const chatRoomsQuery = query(chatRoomsRef); // इसे Query टाइप में बदलें
  return collectionData(chatRoomsQuery, { idField: 'id' });
}

// getChatRooms(): Observable<any>{
//   const chatRoomRef = collection(this.firestore,'rooms');
//   const chatRoomQuery = query(chatRoomRef, orderBy('name'))
//   // const chatRoomQuery = query(chatRoomRef)
//   // , orderBy('name'));
//   return collectionData(chatRoomQuery, { idField: 'id' });
// }



logout() {
    localStorage.clear();
    return signOut(this.auth);
  }


}
