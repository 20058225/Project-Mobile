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
      product.quantity++;
    } else {
      product.quantity = 1;
    }
  }
  incrementQuantity(product: any) { product.quantity = (product.quantity || 0) + 1; }  
  decrementQuantity(product: any) {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }
  // Function to plugin vibration
  async pluginVibration() {
    const { Haptics } = await import('@capacitor/haptics');
    await Haptics.vibrate();
    console.log("Vibrate!!");
  }
  resetQuantities() {
    this.products.forEach(product => {
      if (product.quantity > 0) {
        product.quantity = 0; // Reset quantity to 0
      }
    });
  }
  cancelBack() {
    this.resetQuantities(); 
    this.pluginVibration(); 
    this.dismiss(); 
  }
  addBack(){
    this.pluginVibration(); 
    this.dismiss(); 
  }
  
}
