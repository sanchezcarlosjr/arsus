import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DomSanitizerPipeModule } from '@app/@shared/dom-sanizater-pipe/dom-sanitizer-pipe.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@app/i18n';
import { AuthenticatedHeaderModule } from './authenticated-header/authenticated-header.module';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';
import { NgxsModule } from '@ngxs/store';
import { NewsState } from './news/news.state';
import { TweetComponent } from './tweet/tweet.component';
import { IframeModule } from '@app/@shared/iframe/iframe.module';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
  declarations: [PortfolioComponent, TweetComponent, ViewerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PortfolioRoutingModule,
    IonicModule,
    DomSanitizerPipeModule,
    I18nModule,
    IframeModule,
    NgxsModule.forFeature([NewsState]),
    AuthenticatedHeaderModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PortfolioModule {}
