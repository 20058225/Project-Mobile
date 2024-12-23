import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.scss'],
})
export class ReceiptsListComponent implements OnInit {
  receipts: any[] = [];

  constructor() {}

  async ngOnInit() {
    await this.loadReceipts();
  }

  async loadReceipts() {
    try {
      const fileContent = await Filesystem.readFile({
        directory: Directory.Documents,
        path: 'receipts/receipts.json',
      });
  
      const data = typeof fileContent.data === 'string' ? fileContent.data : await fileContent.data.text();
      this.receipts = JSON.parse(data);
  
      console.log('Receipts loaded successfully:', this.receipts);
    } catch (error) {
      console.error('Error loading receipts:', error);
      this.receipts = [];
    }
  }
    
}
