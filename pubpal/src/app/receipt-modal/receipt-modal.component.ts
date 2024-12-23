import { Component, Input } from '@angular/core'; 
import { ModalController } from '@ionic/angular'; 
import { DatePipe } from '@angular/common'; 
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'; 
@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.scss']
})
export class ReceiptModalComponent {
  @Input() orderDetails: any = {}; // Default to an empty object

  receiptText: string = '';

  constructor(private modalCtrl: ModalController, private datePipe: DatePipe) {}

  dismiss() { this.modalCtrl.dismiss(); }

  async saveReceipt() {
    const receiptContent = JSON.stringify(this.orderDetails, null, 2);
    const receiptFileName = `receipt-${this.orderDetails.orderNumber}-${new Date().toISOString()}.txt`;
  
    try {
      await Filesystem.writeFile({
        path: receiptFileName,
        data: receiptContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log('Receipt saved successfully!');
      alert('Receipt saved successfully!');
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  }
}