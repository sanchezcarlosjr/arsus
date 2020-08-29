import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe, HTMLSanitizerPipe } from './dom-sanitizer.pipe';

@NgModule({
  declarations: [DomSanitizerPipe, HTMLSanitizerPipe],
  imports: [CommonModule],
  exports: [DomSanitizerPipe, HTMLSanitizerPipe],
})
export class DomSanitizerPipeModule {}
