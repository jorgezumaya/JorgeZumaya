import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);

  async submit(payload: ContactSubmission): Promise<void> {
    await addDoc(collection(this.firestore, 'contactSubmissions'), {
      ...payload,
      createdAt: serverTimestamp(),
      userAgent: navigator.userAgent,
    });
  }
}
