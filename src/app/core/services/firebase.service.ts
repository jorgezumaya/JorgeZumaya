import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  readonly firestore = inject(Firestore);
  readonly storage = inject(Storage);
}
