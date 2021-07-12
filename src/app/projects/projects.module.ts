import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IframeModule } from '@shared/iframe/iframe.module';

@NgModule({
  declarations: [ProjectsComponent],
  imports: [CommonModule, TranslateModule, ProjectsRoutingModule, IonicModule, IframeModule],
})
export class ProjectsModule {}
