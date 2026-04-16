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
    const data = { ...payload, createdAt: serverTimestamp(), userAgent: navigator.userAgent };

    await addDoc(collection(this.firestore, 'contactSubmissions'), data);

    await addDoc(collection(this.firestore, 'mail'), {
      to: 'jorge.juarez087@gmail.com',
      message: {
        subject: `Portfolio contact: ${payload.subject}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
      },
    });
  }
}
