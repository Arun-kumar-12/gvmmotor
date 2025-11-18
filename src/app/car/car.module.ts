import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CarRoutingModule } from './car-routing.module';
import { CarComponent } from './car.component';
import { EditCarComponent } from './edit-car/edit-car.component';
import { CarMediaDialogComponent } from './edit-car/car-media-dialog.component';
import { CarInfoComponent } from './car-info/car-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    CarComponent,
    EditCarComponent,
    CarMediaDialogComponent,
    CarInfoComponent
  ],
  imports: [
    CommonModule,
    CarRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgbModule
  ]
})
export class CarModule { }
