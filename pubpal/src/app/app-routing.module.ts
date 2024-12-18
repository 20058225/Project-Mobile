import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PosComponent } from './pos/pos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'  // Ensure full path matching
  },
  {
    path: 'pos',
    component: PosComponent
  },
  {
    path: '**',
    redirectTo: 'pos'  // Fallback route for unmatched paths
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
