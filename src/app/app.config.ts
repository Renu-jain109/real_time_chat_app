import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

// import { ConfirmationService, MessageService } from 'primeng/api';
// import { providePrimeNG } from 'primeng/config';
// import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // MessageService,
    // ConfirmationService,
    provideAnimations(),  // ✅ Only this is needed for animations
    provideToastr({
      positionClass: 'toast-top-right', // Make sure it's exactly this
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    }),      // ✅ Toastr enabled


    provideFirebaseApp(() => initializeApp({
      projectId: "chat-app-76a0e",
      appId: "1:1071491638838:web:1b048b94e62f3e2770da97",
      storageBucket: "chat-app-76a0e.firebasestorage.app",
      apiKey: "AIzaSyByX45WpOjnNC_EAbjjDjq8uShUXJhDpPI",
      authDomain: "chat-app-76a0e.firebaseapp.com",
      messagingSenderId: "1071491638838"
    })),

    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideMessaging(() => getMessaging()),


    // providePrimeNG({
    //   theme: {
    //     preset: Aura
    //   }
    // })
  ]
};
