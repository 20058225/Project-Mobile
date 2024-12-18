import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent {
  @Input() products: any[] = [];
  @Input() categoryName: string = '';

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    const selectedProducts = this.products.filter(p => p.quantity > 0);
    this.modalCtrl.dismiss(selectedProducts);
  }
  
  toggleProduct(product: any) {
    if (product.quantity && product.quantity > 0) {
      product.quantity ++;
    } else {
      product.quantity = 1;
    }
  }

  incrementQuantity(product: any) {
    product.quantity = (product.quantity || 0) + 1;
  }
  
  decrementQuantity(product: any) {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }
}
