import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ProductModalComponent } from '../product-modal/product-modal.component';

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

  constructor(private http: HttpClient, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any>('assets/data/products.json').subscribe(data => {
      this.products = data.products;
      this.categories = [...new Set(this.products.map(p => p.category))];
      console.log('Loaded products:', this.products);
    });
  }
  

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
          this.incrementQuantity(product);
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
      this.selectedProductsList.push({ ...product });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(this.products);
  }

  // Increment product quantity
  incrementQuantity(product: any) {
    if (!product.price) {
      console.error('Product price is missing for', product);
      return;
    }
    
    const existingProduct = this.selectedProductsList.find(p => p.name === product.name);
  
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      this.selectedProductsList.push({ ...product, quantity: 1 });
    }
    
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
}
