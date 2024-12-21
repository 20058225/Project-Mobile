import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ReceiptModalComponent } from '../receipt-modal/receipt-modal.component';
import { Platform } from '@ionic/angular'; 

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {
  products: any[] = []; // Full list of products from JSON
  categories: string[] = []; // Product categories
  selectedProductsList: any[] = []; // Selected products in POS
  totalAmount: number = 0; // Total price of selected products

  showFooter: boolean = true;

  constructor(private http: HttpClient, private modalCtrl: ModalController, private platform: Platform) { }

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.http.get<any>('assets/data/products.json').subscribe(data => {
      this.products = data.products;
      this.categories = [...new Set(this.products.map(p => p.category))];
      //console.log('Loaded products:', this.products);
    });
  }

  modalOpen = false;
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
        result.data.forEach((product: any) => {
          this.addOrUpdateProduct(product);
        });    
        this.calculateTotal();  
      }
    });
    await modal.present();
  }
  addOrUpdateProduct(product: any) {
    const existingProduct = this.selectedProductsList.find(p => p.name === product.name);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.selectedProductsList.push({ ...product, quantity: product.quantity });
    }
  }

  dismiss() { this.modalCtrl.dismiss(this.products); }

  // Increment product quantity
  incrementQuantity(product: any) {
    if (!product.price) {
      product.price = 0;
      console.warn('Product price is missing. Setting it to €0.', product);
      return;
    }
    
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
  
  // Function to plugin vibration
  async pluginVibration() {
    const { Haptics } = await import('@capacitor/haptics');
    await Haptics.vibrate();
    console.log("Vibrate!!");
  }
  selectedPayment: string | null = null; // Store the selected payment method

  // Method to handle payment selection
  selectPayment(method: string) {
    this.selectedPayment = method;
    console.log(`Payment selected: ${method}`);
  }

  // Method to print the receipt
  printReceipt() {
    const receiptContent = this.selectedProductsList.map(product => {
      return `${product.name} x${product.quantity} @ €${product.price.toFixed(2)} = €${(product.price * product.quantity).toFixed(2)}`;
    }).join('\n');

    const totalLine = `Total: €${this.totalAmount.toFixed(2)}`;
    const receipt = `--- Receipt ---\n${receiptContent}\n${totalLine}`;
    
    console.log(receipt);
    //alert(receipt); // Replace with actual receipt printing logic
  }
  
  async showReceiptModal() {
    const modal = await this.modalCtrl.create({
      component: ReceiptModalComponent,
      componentProps: {
        orderDetails: {
          orderNumber: Math.floor(Math.random() * 1000000), // Generate random order number
          items: this.selectedProductsList,
          totalAmount: this.totalAmount,
          paymentMethod: 'Cash/Card' 
        }
      }
    });
  
    await modal.present();
  }
}
