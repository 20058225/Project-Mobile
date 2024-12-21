import { Component, Input } from '@angular/core'; // Missing imports for Angular Component
import { ModalController } from '@ionic/angular'; // For Ionic Modal
import { DatePipe } from '@angular/common'; // For Date Formatting
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'; // Capacitor Filesystem Plugin

@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.scss']
})
export class ReceiptModalComponent {
  @Input() orderDetails: any = {}; // Default to an empty object

  receiptText: string = '';

  constructor(private modalCtrl: ModalController, private datePipe: DatePipe) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async saveReceipt() {
    const receiptContent = JSON.stringify(this.orderDetails, null, 2);

    try {
      await Filesystem.writeFile({
        path: `receipt-${this.orderDetails.orderNumber}.txt`,
        data: receiptContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log('Receipt saved successfully!');
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  }
}
