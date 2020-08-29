import { NgModule } from '@angular/core';
import { IframeComponent } from './iframe.component';
import { DomSanitizerPipeModule } from '../dom-sanizater-pipe/dom-sanitizer-pipe.module';
import { CommonModule } from '@angular/common';
import { BlobIframeComponent } from './blob-iframe/blob-iframe.component';

@NgModule({
  declarations: [IframeComponent, BlobIframeComponent],
  exports: [IframeComponent, BlobIframeComponent],
  imports: [CommonModule, DomSanitizerPipeModule],
})
export class IframeModule {}
