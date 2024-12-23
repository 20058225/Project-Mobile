import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private receiptsSubject = new BehaviorSubject<any[]>([]); // Holds the receipts
  receipts$ = this.receiptsSubject.asObservable(); // Observable to subscribe to

  constructor() {}

  // Update the receipts list
  updateReceipts(receipts: any[]) {
    this.receiptsSubject.next(receipts);
  }

  // Get the current list of receipts
  getReceipts(): any[] {
    return this.receiptsSubject.getValue();
  }
}
