import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { PosComponent } from './pos/pos.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ReceiptModalComponent } from './receipt-modal/receipt-modal.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, PosComponent, ProductModalComponent, ReceiptModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
