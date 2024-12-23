import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { HomeComponent } from '../home/home.component'; 
import { PosComponent } from '../pos/pos.component'; 
import { ReceiptsListComponent } from '../receipts-list/receipts-list.component';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        component: HomeComponent 
      },
      {
        path: 'pos',
        component: PosComponent 
      },
      {
        path: 'receipts',
        component: ReceiptsListComponent 
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}