import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: '', redirectTo: 'home',pathMatch:'full'},
  {path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  {path: 'car', loadChildren: () => import('./car/car.module').then(m => m.CarModule)},
  {path: 'home', component:HomeComponent},
  {path: 'orders',component:OrdersComponent},
  {path: 'profile',component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // 👈 scrolls to top on navigation
      anchorScrolling: 'enabled'            // optional: allows #anchor scrolling
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
