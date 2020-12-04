import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiRoutingModule } from './api-routing.module';
import { ApiComponent } from './api.component';



@NgModule({
  declarations: [ApiComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ApiRoutingModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApiModule { }
