import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './car.component';
import { EditCarComponent } from './edit-car/edit-car.component';
import { CarInfoComponent } from './car-info/car-info.component';

const routes: Routes = [
  {path:'',component:CarComponent},
  {path:"info/:id",component:CarInfoComponent},
  {path:'add',component:EditCarComponent},
  {path:'edit/:id',component:EditCarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
