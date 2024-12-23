import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PosComponent } from './pos/pos.component';
import { ProductModalComponent } from './product-modal/product-modal.component';

import { AppRoutingModule } from './app-routing.module';
import { ReceiptsListComponent } from './receipts-list/receipts-list.component';

@NgModule({
  declarations: [AppComponent, PosComponent, HomeComponent, ProductModalComponent, ReceiptsListComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
