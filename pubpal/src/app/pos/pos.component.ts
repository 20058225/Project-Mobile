import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ToastController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ReceiptService } from '../services/receipt.service';

import { Plugins } from '@capacitor/core';
const { Permissions } = Plugins;

async function requestPermission() {
  const { granted } = await Permissions['request']({
    name: 'storage',
  });
  if (!granted) {
    console.error('Permission denied!');
    return;
  }
}

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})

export class PosComponent implements OnInit {
  products: any[] = []; //@@ products JSON
  categories: string[] = []; //@@ Product categories
  selectedProductsList: any[] = []; //@@ Selected products in POS
  totalAmount: number = 0; //@@ Total price of selected products
  showFooter: boolean = true;
  receipts: any[] = [];

  constructor(
    private http: HttpClient, 
    private modalCtrl: ModalController, 
    private toastController: ToastController,
    private receiptService: ReceiptService) { }

  ngOnInit() { this.createReceiptsDirectory(),    this.loadProducts(); }

  loadProducts() {
    this.http.get<any>('assets/data/products.json').subscribe(data => {
      this.products = data.products;
      this.categories = [...new Set(this.products.map(p => p.category))];
    });
  }

  //modalOpen = false;
  async openProductModal(category: string) {
    const filteredProducts = this.products.filter(p => p.category === category);

    const modal = await this.modalCtrl.create({
      component: ProductModalComponent,
      componentProps: {
        categoryName: category,
        products: JSON.parse(JSON.stringify(filteredProducts))      
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        result.data.forEach((product: any) => this.addOrUpdateProduct(product));    
        this.calculateTotal();  
      }
    });
    await modal.present();
  }

  dismiss() { this.modalCtrl.dismiss(this.products); }

  addOrUpdateProduct(product: any) {
    const existingProduct = this.selectedProductsList.find(p => p.name === product.name);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.selectedProductsList.push({ ...product, quantity: product.quantity });
    }
  }

  incrementQuantity(product: any) { 
    const existingProduct = this.selectedProductsList.find(p => p.name === product.name);
  
    if (existingProduct) { existingProduct.quantity++; } 
    else { this.selectedProductsList.push({ ...product, quantity: 1 }); }
    
    this.calculateTotal();
  }
  
  decrementQuantity(product: any) {
    const existingProduct = this.selectedProductsList.find(p => p.name === product.name);
  
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        this.selectedProductsList = this.selectedProductsList.filter(p => p.name !== product.name);
      }
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.totalAmount = this.selectedProductsList.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
  }

  getProductQuantity(product: any): number {
    const existingProduct = this.selectedProductsList.find(p => p.name === product.name);
    return existingProduct ? existingProduct.quantity : 0;
  }

  removeProduct(product: any) {
    const index = this.selectedProductsList.indexOf(product);
    if (index > -1) {
      this.selectedProductsList.splice(index, 1);
      this.calculateTotalAmount();
    }
  }
  
  calculateTotalAmount() {
    this.totalAmount = this.selectedProductsList.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);
  }
  
  //@@ Function to plugin vibration
  async pluginVibration() {
    const { Haptics } = await import('@capacitor/haptics');
    await Haptics.vibrate();
    console.log("Vibrate!!");
  }

  async createReceiptsDirectory() {
    try {
      await Filesystem.stat({
        directory: Directory.Documents,
        path: 'receipts',
      });
      console.log('Receipts directory already exists.');
    } catch (error: any) {
      if (error.message.includes('does not exist')) {
        try {
          await Filesystem.mkdir({
            directory: Directory.Documents,
            path: 'receipts',
          });
          console.log('Receipts directory created successfully.');
        } catch (mkdirError) {
          console.error('Error creating receipts directory:', mkdirError);
        }
      } else {
        console.error('Error checking receipts directory:', error);
      }
    }
  }  
  
  selectedPayment: string | null = null;

  //@@ Method to handle payment selection
  selectPayment(method: string) {
    this.selectedPayment = method;
    console.log(`Payment selected: ${method}`);
  }

  //@@ Method to save the receipts
  async printReceipt() {
    const receiptContent = this.selectedProductsList.map(product => ({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      total: (product.price * product.quantity).toFixed(2),
    }));
  
    const totalAmount = this.totalAmount.toFixed(2);
    const receipt = {
      id: new Date().getTime().toString(),
      products: receiptContent,
      total: totalAmount,
      timestamp: new Date().toISOString(),
      paymentMethod: this.selectedPayment,
    };
  
    const filename = 'receipts.json';
  
    try {
      await this.createReceiptsDirectory();
  
      let existingReceipts: any[] = [];
      try {
        const readResult = await Filesystem.readFile({
          path: `receipts/${filename}`,
          directory: Directory.Documents,
        });
  
        const data = typeof readResult.data === 'string' ? readResult.data : await readResult.data.text();
        existingReceipts = JSON.parse(data);
      } catch (readError) {
        console.log('No existing receipts found, starting fresh.', readError);
      }
  
      existingReceipts.push(receipt);
  
      await Filesystem.writeFile({
        path: `receipts/${filename}`,
        directory: Directory.Documents,
        data: JSON.stringify(existingReceipts),
        encoding: Encoding.UTF8,
      });

      console.log('Receipt saved successfully:', receipt);
      this.receiptService.updateReceipts(existingReceipts); 

      this.selectedProductsList = [];
      this.totalAmount = 0;
      this.selectedPayment = null;
      
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  }  
  async showToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: position,
    });
    await toast.present();
  }
}