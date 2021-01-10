import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiRoutingModule } from './api-routing.module';
import { ApiComponent } from './api.component';

@NgModule({
  declarations: [ApiComponent],
<<<<<<< HEAD
  imports: [CommonModule, ApiRoutingModule, IonicModule],
=======
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ApiRoutingModule,
    IonicModule
  ],
>>>>>>> 56a8547ac4a5d56de270cff50e80d9ac212d3759
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApiModule {}
